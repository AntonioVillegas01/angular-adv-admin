import Swal from 'sweetalert2';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {BusquedasService} from '../../../services/busquedas.service';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {UsuarioService} from '../../../services/usuario.service';
import {UsuarioModel} from '../../../models/usuario.model';
import {delay} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: UsuarioModel[] = [];
  public usuariosTemp: UsuarioModel[] = [];
  public desde: number = 0;
  public limit: number = 5;
  public cargando: boolean = true;
  public currentUserId: string;
  public imgSubs: Subscription;


  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) {
    this.currentUserId = usuarioService.uid;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    ).subscribe(img => {
        this.cargarUsuarios();
      });
  }
  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.limit, this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }


  resultadosPorPagina(limit: number) {
    this.limit = limit;
    return this.cargarUsuarios();
  }


  cambiarPagina(valor) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = [...this.usuariosTemp];
    }
    this.busquedasService.buscar('usuarios', termino)
      .subscribe(resultados => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: UsuarioModel) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire(
        'Error!',
        `No puedes borrarte a ti mismo`,
        'error'
      );
    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Esta a punto de Borrar a ${usuario.email} - ${usuario.uid}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe((resp: any) => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario Borrado!',
              `El usuario ${usuario.email} - ${usuario.uid} se eliminó correctamente`,
              'success'
            );
          });

      }
    });
  }

  cambiarRole(usuario: UsuarioModel) {
    this.usuarioService.guardarUsuario(usuario).subscribe(resp => {
      console.log(resp);
    }, error => {
      Swal.fire(
        'Error!',
        `Error al actualizar usuario: ${error}`,
        'error'
      );
    });
  }

  abrirModal(usuario: UsuarioModel) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
    console.log(usuario);
  }
}
