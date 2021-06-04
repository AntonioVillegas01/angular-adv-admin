import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {UsuarioService} from '../../services/usuario.service';
import {UsuarioModel} from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public usuario: UsuarioModel;

  constructor(public sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
   // this.menuItems = sidebarService.menu;
    this.usuario = this.usuarioService.usuario;
    //  console.log(this.menuItems);
  }

  ngOnInit(): void {
  }

}
