import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {SidebarService} from '../services/sidebar.service';

// para declarar una funcion global que inicializa los plugins
// tslint:disable-next-line:typedef
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit{


  constructor(private settingsService: SettingsService,
              private sideBarService: SidebarService) {
  }

  ngOnInit(): void {
    customInitFunctions();
    this.sideBarService.cargarMenu();
    console.log(this.sideBarService.menu)
  }





}
