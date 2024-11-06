import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

export class PostgresService {
    
  static async executeQuery<T>(query: string, params: string[] = []): Promise<T[]> {
    this.loadEnvVariables();
    const client = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port: Number(process.env.DB_PORT)  || 5432,
    });

    try {
      await client.connect();
      const response = await client.query(query, params);
      return response.rows as T[]; 
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw error;
    } finally {
      await client.end(); // Cierra la conexión independientemente del resultado
    }
  }


   static loadEnvVariables(){
    const envPath = path.join(process.cwd(), '.env');
    dotenv.config({ path: envPath });
  }
}