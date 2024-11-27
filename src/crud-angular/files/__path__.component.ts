import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonHttpService } from '../common/services/common-http.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
 
@Component({
  selector: 'app-<%= name %>',
  standalone: true,
  imports: [CommonModule,ButtonModule,RippleModule, ToastModule,
  TableModule,DialogModule,ReactiveFormsModule,ConfirmDialogModule,ToolbarModule,FileUploadModule],
  templateUrl: './<%= name %>.component.html',
  styleUrl: './<%= name %>.component.scss'
})
export class <%= classify(name) %>Component   <T> {
 
 
 
  @ViewChild('dt') dt: Table | undefined;
  data!: any [];
  selectedProduct!: any;
  cols!:any[];
  visibleCols!:any[];
  visible: boolean = false;
  form!: FormGroup;
  edit: boolean = false;
  delete: boolean = false;
  id:unknown;
  title: string = "<%= name %>";
  globalFilterFields: string[] = [];
 
 
 
  constructor(private commonService: CommonHttpService<T>,private messageService: MessageService,private confirmationService: ConfirmationService,) {}
 
async  ngOnInit() {
    this.cols = <%= cols %>;
    this.visibleCols = this.cols.filter(col => col?.visible);
    this.globalFilterFields = this.visibleCols.map(col => col?.field);
    this.initializeForm();
     await this.get<%= classify(name) %>s();   
  }
 
  async get<%= classify('<%= camelize(name) %>') %>s(){
    await this.commonService.get(<%= camelize(name) %>s)
         .then((response : T ) => {
           this.data =  response as any [];
           console.log('Response from API:', response);
         })
         .catch((error: any) => {
           console.error('Error requesting dish:', error);
         });
   
     }
 
 
   initializeForm() {
    
    const group: { [key: string]: FormControl } = {};
    this.cols.forEach((col) => {
      if(col.field!=="id")
      group[col.field] = new FormControl('');
    });
    this.form = new FormGroup(group);
  }
 
  popUp(message: string, severity:string,detail:string='') {
    this.messageService.add({ severity: severity, summary: message, detail: detail });
}
  showDialog() {
    this.visible = true;
    this.form.reset();
    this.edit = false;
  }
 
  async onSubmit() {
  await this.commonService.post('<%= camelize(name) %>',this.form.value)
      .then((response : T )=> {
        let data = response as any;
        this.data = [... this.data, data];
        this.popUp("Create record",'success');
      })
      .catch((error: any) => {
        console.log(error);
        this.popUp("Create error",'error', error?.message);
      });
      this.visible = false;
  }
 
  async updateForm (record: any){
    this.visible = true;
    this.edit = true;
    this.form.patchValue(record);
    this.id= record?.id;
  }
 
  async editRecord() {
    await this.commonService.update(`<%= camelize(name) %>/${this.id}`,this.form.value,)
    .then((response : T ) => {
        let data = response as any;
        const index = this.data.findIndex(data => data.id === this.id);
        if (index !== -1) {
          this.data[index] = data;
        }
      this.popUp("Update record",'success',`El <%= name %> "${data?.title}" se actualizó correctamente.`);
    })
    .catch((error: any) => {
      console.error('Error requesting :', error);
      this.popUp("Update error",'error');
    });
    this.visible = false;
    this.edit = false;
    this.id= '';
  }
 
  confirmDelete(event: Event, id:unknown) {
  
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
 
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            this.deleteRecord(id);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }
 
  async deleteRecord(id: unknown) {
    this.delete =true;
    await this.commonService.delete(`<%= camelize(name) %>/${id}`)
    .then((response : T )=> {
      const index = this.data.findIndex(data => data.id === id);
      if (index !== -1) {
        this.data.splice(index, 1);
      }
    })
    .catch((error: any) => {
      console.error('Error requesting :', error);
      this.popUp("Delete error",'error');
    });
  
  }
 
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }
 
  get dialogHeader(): string {
    return this.edit ? 'Edit' : 'Create';
  }
 
 
}