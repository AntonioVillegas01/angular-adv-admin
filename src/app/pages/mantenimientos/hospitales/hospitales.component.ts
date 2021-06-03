import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalService} from '../../../services/hospital.service';
import {HospitalModel} from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {delay} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {BusquedasService} from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public totalHospitales = 0;
  public hospitales: HospitalModel[] = [];
  public hospitalesTemp: HospitalModel[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;


  constructor(
    private hospitalService: HospitalService,
    private busquedaService: BusquedasService,
    private modalImagenService: ModalImagenService) {
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    ).subscribe(img => {
      this.cargarHospitales();
    });
  }
  ngOnDestroy() {
    this.imgSubs.unsubscribe()
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
        this.totalHospitales = hospitales.length;
      });
  }

  guardarCambios(hospital: HospitalModel) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire(
          'Actualizado!',
          `El hospital ${hospital.nombre} se actualizo correctamente`,
          'success'
        );
      });
  }

  borrarHospital(hospital: HospitalModel) {
    Swal.fire({
      title: 'Borrar hospital?',
      text: `Esta a punto de Borrar a ${hospital.nombre} - ${hospital._id}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital)
          .subscribe((resp: any) => {
            this.cargarHospitales();
            Swal.fire(
              'hospital Borrado!',
              `El hospital ${hospital.nombre} - ${hospital._id} se eliminó correctamente`,
              'success'
            );
          });
      }
    });
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      titleText: 'Crear Hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Ingresa el nombre del hospital'
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospitales(value)
        .subscribe((resp: any) => {
          Swal.fire(
            'Ok!',
            `El hospital ${value} - se creó correctamente`,
            'success'
          );
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: HospitalModel) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.hospitales = [...this.hospitalesTemp];
    }
    this.busquedaService.buscar('hospitales', termino)
      .subscribe(resultados => {
        this.hospitales = resultados;
      });
  }
}
