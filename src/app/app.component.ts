import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';
import { ClienteDTO } from '../models/cliente.dto';
import { ClienteService } from '../services/domain/cliente.service';
import { StorageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';

import { timer } from 'rxjs/observable/timer';


@Component({
  templateUrl: 'app.html',
  selector: 'page-app',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  showSplash = true;

  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  cliente: ClienteDTO;
  picture : string;
  cameraOn: boolean = false;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public authService : AuthService, 
    public profile: ClienteService,
    public storage : StorageService) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Perfil', component: 'ProfilePage' },
      { title: 'Categorias', component: 'CategoriesPage' },
      { title: 'Carrinho', component: 'CartPage' },
      { title: 'Trocar foto', component: 'ChangePicturePage' },
      { title: 'Sobre', component: 'AboutPage' },
      { title: 'Sair', component: '' }
    ];
    
    this.initializeCliente();

  }  

  initializeCliente(){
    let localUser = this.storage.getLocalUser();
    if(localUser){
    this.profile.findByEmail(localUser.email).subscribe(response => {
      this.cliente = response as ClienteDTO;
      this.getImageIfExists();
    },
    error => {});
  }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false)
    });
  }

  openPage(page : {title: string, component: string}) {

    switch(page.title){
      case 'Sair':
        this.authService.logout();
        this.nav.setRoot('HomePage');
        break;
       
      default:  
        this.nav.setRoot(page.component);

    }
  }

  getImageIfExists(){
    this.profile.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = API_CONFIG.bucketBaseUrl + "/cp" + this.cliente.id + ".jpg";
    },
    error => {});
  }
}
