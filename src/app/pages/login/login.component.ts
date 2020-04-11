import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel = new UsuarioModel();
  recordar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }

  }

  login( form: NgForm ){
  
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por Favor...',
      showConfirmButton: false,
    })
    Swal.showLoading();

    this.authService.login( this.usuario ).subscribe(
      res => {
        Swal.close();

        if ( this.recordar ) {
          localStorage.setItem('email', this.usuario.email)
        }


        this.router.navigate(['home']);
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        })
      }
    )

  }

}
