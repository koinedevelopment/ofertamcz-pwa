import { SorteioModalPage } from './../sorteio-modal/sorteio-modal';
import { FireService } from './../../services/fire.service';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-sorteios-realizados',
  templateUrl: 'sorteios-realizados.html'
})
export class SorteiosRealizadosPage {
  sorteios: any;
  ganhador: boolean = false;
  nomeGanhador: string = '';
  idUser: string = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireService: FireService, 
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public platform: Platform
    ) {
    
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando sorteios'
    });
    loading.present();

    this.idUser = this.fireService.uid;
    this.fireService.getSorteiosRealizados()
      .subscribe(sorteios => {
        this.sorteios = sorteios;
        loading.dismiss();
        console.log(this.sorteios);
      })
  }

  goToEstabelecimento(key: string){
    this.fireService.getEstabelecimentoById(key)
      .then(snap => {
        this.navCtrl.push(EstabelecimentoPage,{estabelecimento: snap.val()});
      })
  }

  inscrever(sorteio){
    let modalSorteio = this.modalCtrl.create(SorteioModalPage,{sorteio: sorteio});
    modalSorteio.present();
  }

  getNome(sorteio): string{
    return sorteio.titulo;
  }


}
