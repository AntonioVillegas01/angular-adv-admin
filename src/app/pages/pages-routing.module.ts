import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';

import {AuthGuard} from '../guards/auth.guard';

import {DashboardComponent} from './dashboard/dashboard.component';
import {ProgressComponent} from './progress/progress.component';
import {Grafica1Component} from './grafica1/grafica1.component';
import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {PromesasComponent} from './promesas/promesas.component';
import {RxjsComponent} from './rxjs/rxjs.component';
import {PerfilComponent} from './perfil/perfil.component';

import {UsuariosComponent} from './mantenimientos/usuarios/usuarios.component';
import {HospitalesComponent} from './mantenimientos/hospitales/hospitales.component';
import {MedicosComponent} from './mantenimientos/medicos/medicos.component';
import {MedicoComponent} from './mantenimientos/medicos/medico.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
      {path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'}},
      {path: 'grafica1', component: Grafica1Component, data: {titulo: 'Grafica #1'}},
      {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de Cuenta'}},
      {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
      {path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJS'}},
      {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil Usuario'}},

      // mantenimientos
      {path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Usuarios de aplicación'}},
      {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Hospitales de aplicación'}},
      {path: 'medicos', component: MedicosComponent, data: {titulo: 'Médicos de aplicación'}},
      {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Detalle de Médico'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
