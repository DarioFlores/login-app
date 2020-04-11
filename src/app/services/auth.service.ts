import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'https://identitytoolkit.googleapis.com/v1/accounts:'
  private apikey:string = 'AIzaSyCFVNoBoyXuaLOFHto0faoGVgdrRtR24Ns'

  private userToken:string = '';

  constructor(
    private http: HttpClient
  ) { }


  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken)

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  getToken(){

    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }


  logout(){
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel){

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }signInWithPassword?key=${ this.apikey }`, authData)
            .pipe(
              map(
                res => {
                  console.log('Entro a el map rxjs');
                  this.saveToken( res['idToken']);
                  return res
                }
              )
            );

  }

  newUser( usuario: UsuarioModel){
    
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }signUp?key=${ this.apikey }`, authData)
            .pipe(
              map(
                res => {
                  console.log('Entro a el map rxjs');
                  this.saveToken( res['idToken'])
                  return res
                }
              )
            );

  }

  isAuth(): boolean{

    if ( this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      console.log('Token Expirado')
      return false;
    }

  }

  // crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
}
