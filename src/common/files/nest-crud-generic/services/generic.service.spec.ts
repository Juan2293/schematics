import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseService } from './generic.service';

// Mock para la entidad de prueba
class MockEntity {
    id: string;
    name: string;
}

// DTO de prueba
class MockDto {
    name: string;
}

// Mock del repositorio
const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
});

describe('BaseService', () => {
    let service: BaseService<MockEntity, MockDto>;
    let repository: jest.Mocked<Repository<MockEntity>>;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: Repository,
                    useValue: mockRepository(),
                },
                {
                    provide: BaseService,
                    useFactory: (entityRepository: Repository<MockEntity>) =>
                        new BaseService<MockEntity, MockDto>(entityRepository),
                    inject: [Repository],
                },
            ],
        }).compile();

        service = module.get<BaseService<MockEntity, MockDto>>(BaseService);
        repository = module.get(Repository) as jest.Mocked<Repository<MockEntity>>;
    });

    describe('create', () => {
        it('debería crear y guardar una entidad con éxito', async () => {
            const mockDto = { name: 'Test Entity' };
            const mockEntity = { id: '1', name: 'Test Entity' };

            repository.create.mockReturnValue(mockEntity as MockEntity);
            repository.save.mockResolvedValue(mockEntity as MockEntity);

            const result = await service.create(mockDto);

            expect(repository.create).toHaveBeenCalledWith(mockDto);
            expect(repository.save).toHaveBeenCalledWith(mockEntity);
            expect(result).toEqual(mockEntity);
        });

        it('debería lanzar un BadRequestException para errores de validación', async () => {
            const mockDto = { name: 'Invalid Entity' };

            repository.create.mockReturnValue(mockDto as MockEntity);
            repository.save.mockRejectedValue({ code: '23505' });

            await expect(service.create(mockDto)).rejects.toThrow(BadRequestException);
        });

        it('debería lanzar un InternalServerErrorException para otros errores', async () => {
            const mockDto = { name: 'Entity' };

            repository.create.mockReturnValue(mockDto as MockEntity);
            repository.save.mockRejectedValue(new Error('Unexpected Error'));

            await expect(service.create(mockDto)).rejects.toThrow(InternalServerErrorException);
        });

    });

    // describe('findAll', () => {
    //     it('debería usar los valores predeterminados si no se proporcionan `take` y `skip`', async () => {
    //         const mockEntities = [{ id: '1', name: 'Test Entity' }];
    //         repository.find.mockResolvedValue(mockEntities);

    //         const paginationDto = {}; // No se proporcionan valores
    //         const result = await service.findAll(paginationDto);

    //         expect(repository.find).toHaveBeenCalledWith({ take: 10, skip: 0 }); // Valores por defecto
    //         expect(result).toEqual(mockEntities);
    //     });

    //     it('debería usar los valores proporcionados para `take` y `skip`', async () => {
    //         const mockEntities = [{ id: '1', name: 'Test Entity' }];
    //         repository.find.mockResolvedValue(mockEntities);

    //         const paginationDto = { take: 5, skip: 2 }; // Valores proporcionados
    //         const result = await service.findAll(paginationDto);

    //         expect(repository.find).toHaveBeenCalledWith({ take: 5, skip: 2 });
    //         expect(result).toEqual(mockEntities);
    //     });
    // });

    describe('findOne', () => {
        it('debería devolver una entidad por id', async () => {
            const mockEntity = { id: '1', name: 'Test Entity' };
            repository.findOne.mockResolvedValue(mockEntity);

            const result = await service.findOne('1');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(result).toEqual(mockEntity);
        });

        it('debería lanzar NotFoundException si no encuentra la entidad', async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.findOne('1')).rejects.toThrow(
                new NotFoundException(`Entity with id 1 not found`),
            );
        });
    });

    describe('findOneBy', () => {
        it('debería devolver una entidad con los términos proporcionados', async () => {
            const mockEntity = { id: '1', name: 'Test Entity' };
            repository.findOne.mockResolvedValue(mockEntity);

            const result = await service.findOneBy({ name: 'Test Entity' });

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { name: 'Test Entity' },
            });
            expect(result).toEqual(mockEntity);
        });

        it('debería lanzar NotFoundException si no encuentra la entidad', async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.findOneBy({ name: 'Nonexistent' })).rejects.toThrow(
                new NotFoundException(`Entity with provided search terms not found`),
            );
        });
    });

    describe('update', () => {
        it('debería actualizar y devolver la entidad', async () => {
            const mockEntity = { id: '1', name: 'Updated Entity' };
            repository.preload.mockResolvedValue(mockEntity);
            repository.save.mockResolvedValue(mockEntity);

            const result = await service.update('1', { name: 'Updated Entity' });

            expect(repository.preload).toHaveBeenCalledWith({
                id: '1',
                name: 'Updated Entity',
            });
            expect(repository.save).toHaveBeenCalledWith(mockEntity);
            expect(result).toEqual(mockEntity);
        });

        it('debería lanzar NotFoundException si la entidad no existe', async () => {
            repository.preload.mockResolvedValue(null);

            await expect(
                service.update('1', { name: 'Updated Entity' }),
            ).rejects.toThrow(new NotFoundException(`T with id: 1 not found`));
        });

        it('debería manejar errores de base de datos al guardar la entidad', async () => {
            const mockEntity = { id: '1', name: 'Updated Entity' };
            repository.preload.mockResolvedValue(mockEntity);
            repository.save.mockRejectedValue(new Error('DB error')); // Simula un error en save()

            const handleDBExceptionsSpy = jest.spyOn(service as any, 'handleDBExceptions'); 

            await expect(
                service.update('1', { name: 'Updated Entity' }),
            ).rejects.toThrow(Error); 

            expect(repository.preload).toHaveBeenCalledWith({
                id: '1',
                name: 'Updated Entity',
            });
            expect(repository.save).toHaveBeenCalledWith(mockEntity);
            expect(handleDBExceptionsSpy).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('delete', () => {
        it('delete item by id', async () => {
            const mockEntity = { id: '1', name: 'Entity to Delete' };
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);
            repository.remove.mockResolvedValue(mockEntity);

            await service.delete('1');

            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(repository.remove).toHaveBeenCalledWith(mockEntity);
        });
    });

});