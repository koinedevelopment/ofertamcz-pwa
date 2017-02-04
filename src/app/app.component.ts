import { SorteiosPage } from './../pages/sorteios/sorteios';
import { FireService } from './../services/fire.service';
import { Component, ViewChild } from '@angular/core';
import {App, IonicApp, MenuController, Platform, Events, NavController, NavParams, Modal, LoadingController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';
@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  rootPage = HomePage;
  categorias;
  user; 

  public nav: any;
  constructor(
    platform: Platform, 
    public fireService: FireService, 
    public events: Events,
    public loadingCtrl: LoadingController,
    private _app: App, 
    private _ionicApp: IonicApp, 
    private _menu: MenuController
    ) {

    platform.ready().then(() => {
      this.setupBackButtonBehavior ();
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          let loading = this.loadingCtrl.create({
            content: 'Acessando conta...',
            showBackdrop: false
          });
          loading.present()
          this.fireService.getUserByUid(user.uid)
            .then(snap => {
              loading.dismiss();
              this.user = snap.val();
            })

        }
      })

      this.events.subscribe('user:registered', user => {
        this.user = user;
        console.log('this.user: ',this.user)
      });
      
    

    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      })
    });
  }

  loginWithFacebook(){
    this.fireService.loginWithFacebook();
  }

  logout(){
    console.log('Logout');
    this.fireService.logout()
      .then(_ => {
        this.user = null;
      })
  }

  goToSorteios(){
    this.nav.push(SorteiosPage);
  }

  setupBackButtonBehavior (){
    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Register browser back button action(s)
      window.onpopstate = (evt) => {

        // Close menu if open
        if (this._menu.isOpen()) {
          this._menu.close ();
          return;
        }

        // Close any active modals or overlays
        let activePortal = this._ionicApp._loadingPortal.getActive() ||
          this._ionicApp._modalPortal.getActive() ||
          this._ionicApp._toastPortal.getActive() ||
          this._ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        // Navigate back
        if (this._app.getRootNav().canGoBack()) this._app.getRootNav().pop();

      };

      // Fake browser history on each view enter
      this._app.viewDidEnter.subscribe((app) => {
        history.pushState (null, null, "");
      });

    }
    
  }

}
