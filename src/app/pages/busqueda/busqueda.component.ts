import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BusquedasService} from '../../services/busquedas.service';
import {UsuarioModel} from '../../models/usuario.model';
import {MedicoModel} from '../../models/medico.model';
import {HospitalModel} from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  public terminoBusqueda: string = '';
  public usuarios: UsuarioModel[] = [];
  public medicos: MedicoModel[] = [];
  public hospitales: HospitalModel[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({termino}) => {
        this.terminoBusqueda = termino;
        this.busquedaGlobal(termino);
      });
  }

  busquedaGlobal(termino: string) {
    this.busquedaService.busquedaGlobal(termino)
      .subscribe(({usuarios, hospitales, medicos}: any) => {
        this.usuarios = usuarios;
        this.hospitales = hospitales;
        this.medicos = medicos;
      }, error => {
        console.log(error);
      });

  }

  abrirMedico(medico: MedicoModel) {
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);

  }
}
