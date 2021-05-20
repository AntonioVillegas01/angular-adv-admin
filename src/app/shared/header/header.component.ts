import {Component} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {UsuarioModel} from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {

  public usuario: UsuarioModel;

  constructor(private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
  }


  logout() {
    this.usuarioService.logout();
  }


}
