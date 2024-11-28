import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonHttpService } from '../common/services/common-http.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent <T> {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private commonService: CommonHttpService<T>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
    //  console.log('Datos enviados:', { email, password, rememberMe });
      let login ={
        email,
        password
      }
      await this.commonService.post('auth/login',login)
      .then((response : T ) => {
        const auth : any = response; 
        if (auth?.token) {
          localStorage.setItem('authToken', auth.token); 
        }
        console.log('Response from API:', response);
      })
      .catch(error => {
        console.error('Error login', error);
      });
      
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
