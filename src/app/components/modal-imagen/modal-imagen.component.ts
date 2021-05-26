import {Component, OnInit} from '@angular/core';
import {ModalImagenService} from '../../services/modal-imagen.service';
import {FormGroup} from '@angular/forms';
import {UsuarioModel} from '../../models/usuario.model';
import Swal from 'sweetalert2';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: []
})
export class ModalImagenComponent implements OnInit {

  public imageSubir: File;
  public imgTemp: any | null;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imageSubir, tipo, id)
      .then(img => {
        Swal.fire({
          title: 'Guardado!',
          text: 'Imagen actualizada',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
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
