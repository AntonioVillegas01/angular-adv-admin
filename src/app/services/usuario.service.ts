import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {RegisterFormInterface} from '../interfaces/register-form.interface';
import {LoginFormInterface} from '../interfaces/login-form.interface';
import {catchError, delay, map, tap} from 'rxjs/operators';
import {UsuarioModel} from '../models/usuario.model';
import {CargarUsuariosInterface} from '../interfaces/cargar-usuarios.interface';


declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }


  private baseUrl = environment.base_url;
  public auth2: any;
  public usuario: UsuarioModel;


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

  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
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
        const {email, google, nombre, role, uid, img = ''} = resp.usuario;
        /*
        Importante crear una nueva instancia del usuario en lugar de asignar directamente
        el objeto a la propiedad usuario de la clase usuario service
         */
        this.usuario = new UsuarioModel(nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(resp.token, resp.menu);
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
          console.log(resp.menu)
          this.guardarLocalStorage(resp.token, resp.menu);
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
        tap(({token, menu}: any) => {
          this.guardarLocalStorage(token, menu);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${this.baseUrl}/login/google`, {token})
      .pipe(
        delay(100),
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  cargarUsuarios(limit?: number, desde?: number): Observable<CargarUsuariosInterface> {
    const url = `${this.baseUrl}/usuarios?limit=${limit}&desde=${desde}`;
    return this.http.get<CargarUsuariosInterface>(url, this.headers)
      .pipe(
        // delay(3000),
        map(resp => {
          const usuarios = resp.usuarios.map(
            user => new UsuarioModel(user.nombre, user.email, '', user.img, user.google, user.role, user.uid));
          return {
            total: resp.total,
            usuarios
          };
        })
      );
  }

  eliminarUsuario(usuario: UsuarioModel) {
    const url = `${this.baseUrl}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.baseUrl}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

}
