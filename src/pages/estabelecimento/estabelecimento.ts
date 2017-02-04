import { FireService } from './../../services/fire.service';
import { Component} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-estabelecimento',
  templateUrl: 'estabelecimento.html'
})
export class EstabelecimentoPage {
  estabelecimento: any;
  linkLocalizacao: any;
  photo: string = 'http://www.guiachef.com.br/wp-content/uploads/2015/06/padaria.jpg';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireService: FireService, 
    public alertCtrl: AlertController,
    public sanitizer: DomSanitizer,
    public platform: Platform
  ){

    this.estabelecimento = this.navParams.get('estabelecimento');
    console.log(this.estabelecimento);
    this.estabelecimento.imagemCapa? this.photo = this.estabelecimento.imagemCapa : this.photo = 'http://www.guiachef.com.br/wp-content/uploads/2015/06/padaria.jpg';
    if(this.estabelecimento.localizacao){
      this.linkLocalizacao = "http://maps.google.com/maps?q=" + this.estabelecimento.localizacao.latitude + ',' + this.estabelecimento.localizacao.longitude + "("+ this.estabelecimento.nome +")&z=15";
    
      console.log(this.linkLocalizacao);

    }
  }

  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    })

  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction(() => {
        console.log(this.navCtrl.getActive().name)
        if(this.navCtrl.getActive().name == 'EstabelecimentoPage')
          this.navCtrl.pop();
      })
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  call(numero){
    console.log('ligou: ', numero);
    
  }

  openImage(){
    let imagem = this.estabelecimento.imagemAdicional;
  }
}
