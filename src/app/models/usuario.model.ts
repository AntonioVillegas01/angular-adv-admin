import {environment} from '../../environments/environment';

const baseUrl = environment.base_url;

export class UsuarioModel {

  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string,
  ) {
  }

  get imagenUrl() {
    // /uploads/usuarios/no-image
   // console.log(this.img);
    if ( !this.img ) {
      return `${ baseUrl }/uploads/usuarios/no-image`;
    } else if ( this.img.includes('https') ) {
      return this.img;
    } else if ( this.img ) {
      return `${ baseUrl }/uploads/usuarios/${ this.img }`;
    } else {
      return `${ baseUrl }/uploads/usuarios/no-image`;
    }
  }
}
