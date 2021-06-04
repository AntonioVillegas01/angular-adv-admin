import {Component} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {UsuarioModel} from '../../models/usuario.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {

  public usuario: UsuarioModel;

  constructor(private router: Router,
              private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
  }


  logout() {
    this.usuarioService.logout();
  }


  buscar(termino: string) {
    if(termino.length === 0){
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
