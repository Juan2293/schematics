import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ TableModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  data!: any[];

  cols!: any[];


  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.get<%= classify(name) %>s();   
    
    this.cols = <%= cols %>
  }

  async get<%= classify(name) %>s(){
    await this.commonService.getApiData()
       .then(response => {
         this.data = response
         console.log('Response from API:', response);
       })
       .catch(error => {
         console.error('Error requesting dish:', error);
       });  
   }

}
