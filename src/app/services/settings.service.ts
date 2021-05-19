import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  private linkTheme = document.querySelector('#theme');

  constructor() {
    this.setTheme();
  }

  setTheme() {
    const url = localStorage.getItem('theme') || './assets/css/colors/default.css';
    this.linkTheme.setAttribute('href', url);
  }

  changeTheme(theme: string, links: NodeList) {
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme(links);
  }

  checkCurrentTheme(links: NodeList[] | NodeList): void {
  links.forEach(el => {
      el.classList.remove('working');
      const btnTheme = el.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');
      if (btnThemeUrl === currentTheme) {
        el.classList.add('working');
      }
    });
  }
}
