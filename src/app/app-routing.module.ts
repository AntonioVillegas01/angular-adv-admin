import {NgModule} from '@angular/core';
import {AuthRoutingModule} from './auth/auth.routing.module';
import {RouterModule, Routes} from '@angular/router';
import {NopagefoundComponent} from './nopagefound/nopagefound.component';
import {PagesRoutingModule} from './pages/pages-routing.module';
import {PagesComponent} from './pages/pages.component';

const routes: Routes = [

  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting
  // path: '/medicos' MedicosRouting
  // path: '/compras' ComprasRouting

  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', component: NopagefoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
