import {UsuarioModel} from '../models/usuario.model';

export interface CargarUsuariosInterface{
  total: number;
  usuarios: UsuarioModel[];
}
