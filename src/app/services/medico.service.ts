import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MedicoModel} from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(): Observable<MedicoModel[]> {
    const url = `${this.baseUrl}/medicos`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, medicos: MedicoModel[] }) => resp.medicos)
      );
  }

  obtenerMedicoPorId(id: string): Observable<MedicoModel> {
    const url = `${this.baseUrl}/medicos/${id}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, medico: MedicoModel }) => resp.medico)
      );
  }

  crearMedicos(medico: { nombre: string, hospital: string }) {
    const url = `${this.baseUrl}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: MedicoModel) {
    const url = `${this.baseUrl}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  eliminarMedico(medico: MedicoModel) {
    const url = `${this.baseUrl}/medicos/${medico._id}`;
    return this.http.delete(url, this.headers);
  }

}
