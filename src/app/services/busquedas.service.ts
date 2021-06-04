import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CargarUsuariosInterface} from '../interfaces/cargar-usuarios.interface';
import {environment} from '../../environments/environment';
import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';
import {UsuarioModel} from '../models/usuario.model';
import {HospitalModel} from '../models/hospital.model';
import {MedicoModel} from '../models/medico.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) {
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformarUsuario(resultados: any[]): UsuarioModel[] {
    return resultados.map(
      user => new UsuarioModel(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformarHospital(resultados: any[]): HospitalModel[] {
    return resultados;
  }

  private transformarMedicos(resultados: any[]): MedicoModel[] {
    return resultados;
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url = `${baseUrl}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => {
          console.log(resp);
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuario(resp.resultados);
            case 'hospitales':
              return this.transformarHospital(resp.resultados);
              break;
            case 'medicos':
              return this.transformarMedicos(resp.resultados);
              break;
            default:
              return [];
          }
        })
      );
  }

  busquedaGlobal(termino: string) {
    const url = `${baseUrl}/todo/${termino}`;
    return this.http.get(url, this.headers)
  }
}
