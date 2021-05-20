import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {RegisterFormInterface} from '../interfaces/register-form.interface';
import {LoginFormInterface} from '../interfaces/login-form.interface';
import {catchError, map, tap} from 'rxjs/operators';
import {UsuarioModel} from '../models/usuario.model';


declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.base_url;
  public auth2: any;
  public usuario: UsuarioModel;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise<void>(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '189675231445-82mi4j5enmkh31h3egbfs4tvj8ebt9l7.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });

  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        //  console.log(resp);
        const {email, google, nombre, role, uid, img = ''} = resp.usuario;
        /*
        Importante crear una nueva instancia del usuario en lugar de asignar directamente
        el objeto a la propiedad usuario de la clase usuario service
         */
        this.usuario = new UsuarioModel(nombre, email, '', img, google, role, uid);
        // Renuevo el token
        localStorage.setItem('token', this.token);
        return true;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    );
  }

  crearUsuario(formData: RegisterFormInterface) {
    return this.http.post(`${this.baseUrl}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${this.baseUrl}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginFormInterface) {
    return this.http.post(`${this.baseUrl}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${this.baseUrl}/login/google`, {token})
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }
}
