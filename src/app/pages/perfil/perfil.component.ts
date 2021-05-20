import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {UsuarioModel} from '../../models/usuario.model';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {of} from 'rxjs';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: UsuarioModel;
  public imageSubir: File;
  public imgTemp: any | null;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(resp => {
        const {nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        localStorage.setItem('email', email);
        Swal.fire({
          title: 'Guardado!',
          text: 'La información se actualizó correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }, err => {
        Swal.fire({
          title: 'Ocurrio un Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
    console.log(this.perfilForm.value);
  }


  cambiarImagen(file: File) {
    this.imageSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imageSubir, 'usuarios', this.usuario.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire({
          title: 'Guardado!',
          text: 'Imagen actualizada',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }).catch(e => {
      console.log(e);
      Swal.fire({
        title: 'Ocurrio un Error!',
        text: 'No se pudo subir la imagen',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    });
  }
}
