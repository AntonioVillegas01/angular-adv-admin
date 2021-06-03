import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CargarUsuariosInterface} from '../interfaces/cargar-usuarios.interface';
import {map} from 'rxjs/operators';
import {UsuarioModel} from '../models/usuario.model';
import {environment} from '../../environments/environment';
import {HospitalModel} from '../models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  baseUrl = environment.base_url;

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

  // todo: Implementar paginacion
  cargarHospitales(): Observable<HospitalModel[]> {
    const url = `${this.baseUrl}/hospitales`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, hospitales: HospitalModel[] }) => resp.hospitales)
      );
  }

  crearHospitales(nombre: string) {
    const url = `${this.baseUrl}/hospitales`;
    return this.http.post(url, {nombre}, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${this.baseUrl}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.headers);
  }

  eliminarHospital(hospital: HospitalModel) {
    const url = `${this.baseUrl}/hospitales/${hospital._id}`;
    return this.http.delete(url, this.headers);
  }
}
