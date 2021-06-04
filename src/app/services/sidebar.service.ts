import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    if (this.menu.length === 0) {
      console.log('error al cargar menu');
    }
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       {titulo: 'Main', url: ''},
  //       {titulo: 'ProgressBar', url: 'progress'},
  //       {titulo: 'Graficas', url: 'grafica1'},
  //       {titulo: 'Promesas', url: 'promesas'},
  //       {titulo: 'RxJS', url: 'rxjs'},
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       {titulo: 'Usuarios', url: 'usuarios'},
  //       {titulo: 'Hospitales', url: 'hospitales'},
  //       {titulo: 'Médicos', url: 'medicos'}
  //     ]
  //   },
  // ];
}
