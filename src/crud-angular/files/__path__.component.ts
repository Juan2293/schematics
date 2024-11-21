import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonHttpService } from '../common/services/common-http.service';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-<%= path %>',
  standalone: true,
  imports: [TableModule, CommonModule, ToolbarModule, ButtonModule, DialogModule, FormsModule, InputNumberModule, InputTextModule],
  templateUrl: './<%= path %>.component.html',
  styleUrl: './<%= path %>.component.scss'
})
export class <%= classify(name) %>Component {

  dataSource!: any[];

  cols!: any[];

  <%= camelize(name) %>!: any;

  <%= camelize(name) %>Dialog: boolean = false;
  submitted: boolean = false;


  constructor(private commonHttpService: CommonHttpService<any>) {}

  ngOnInit() {
    this.get<%= classify(name) %>s();   
    
    this.cols = <%= cols %>
  }

  async get<%= classify(name) %>s(){
    await this.commonHttpService.get('/<%= path %>')
       .then(response => {
         this.dataSource = response
         console.log('Response from API:', response);
       })
       .catch(error => {
         console.error('Error requesting dish:', error);
       });  
   }

  openNew() {
    this.<%= camelize(name) %> = {};
    this.submitted = false;
    this.<%= camelize(name) %>Dialog = true;
  }

  hideDialog() {
    this.<%= camelize(name) %>Dialog = false;
    this.submitted = false;
  }

  async save() {
    this.submitted = true;

    await this.commonHttpService.post('/<%= path %>',this.<%= camelize(name) %>)
    .then(response => {
      this.dataSource = [...this.dataSource, response]
      console.log('Response from API:', response);
      this.<%= camelize(name) %>Dialog =false;
    }) 
    .catch(error => {
      console.error('Error requesting dish:', error);
    });
}

}
