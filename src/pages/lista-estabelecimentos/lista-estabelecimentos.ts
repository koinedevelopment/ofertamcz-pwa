import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-lista-estabelecimentos',
  templateUrl: 'lista-estabelecimentos.html'
})
export class ListaEstabelecimentosPage {

  keyCategoria: string;
  estabelecimentos: any[];
  categoria: string = '';
  title: string = '';
  loading: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireService: FireService, 
    public loadingCtrl: LoadingController,
    public platform: Platform
    ){
      
      this.keyCategoria = this.navParams.get('keyCategoria');
      this.fireService.getCategoriaByKey(this.keyCategoria)
        .subscribe(categoria => {
          this.categoria = categoria;
          this.title = categoria.nome;
        })
      
  }

  ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
        content: 'Carregando estabelecimentos',
        showBackdrop: false
      });
    
     // loading.present();

    this.fireService.getEstabelecimentosByKeyCategoria(this.keyCategoria)
      .subscribe(estabelecimentos => {
        //loading.dismiss();
        this.loading = false;
        this.estabelecimentos = estabelecimentos;
      });

  }

  openImage(estabelecimento: any){
    let imagem = estabelecimento.imagemCapa;

  }

  onSelectEstabelecimento(estabelecimento){
    this.navCtrl.push(EstabelecimentoPage, {estabelecimento: estabelecimento});
    console.log(estabelecimento);
  }

  ionViewDidEnter(){
  }

}
