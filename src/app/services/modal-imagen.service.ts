import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal = true;
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string;

  // notifica al componente cuando se cambia la imagen
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-image',
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
//    this.img = img;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${baseUrl}/uploads/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }
}
