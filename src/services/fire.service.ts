import { Facebook } from 'ionic-native';
import { Injectable } from '@angular/core';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class FireService {
    public uid: string = '';
    public auth$ = this.af.auth;
    constructor(public af: AngularFire, public events: Events) {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.uid = user.uid;
                console.log('onAuthState ',user);
            }
        })
    }

    saveCategoria(categoria: string): firebase.Promise<any> {
        return firebase.database().ref('categorias/').push({nome: categoria});
    }

    getCategorias(): Observable<any>{
        return this.af.database.list('categorias', {
            query: {
                orderByChild: 'ativo',
                equalTo: true
            }
        });
    }
    
    getCategoriasComEstabelecimentos(): Observable<any>{
        return this.af.database.list('categorias_estabelecimentos');
    }

    getEstabelecimentos():Observable<any>{
        return this.af.database.list('estabelecimentos');
    }

    getEstabelecimentoById(id: string): firebase.Promise<any>{
        return firebase.database().ref('estabelecimentos/'+id).once('value');
    }

    getEstabelecimentosByKeyCategoria(key: string):Observable<any> {
        return this.af.database.list('estabelecimentos', {
            query: {
                orderByChild: 'categoria_validade',
                equalTo: key+'_'+true
            }
        })
    }

    getCategoriaByKey(key):Observable<any> {
        return this.af.database.object('categorias/'+key);
    }

    getDestaques(){
        return this.af.database.list('destaques/');
    }

    getSorteios(): Observable<any> {
        return this.af.database.list('sorteios/', {
            query: {
                orderByChild: 'pendente',
                equalTo: true
            }
        })
    }

    getSorteiosRealizados(): Observable<any> {
        return this.af.database.list('sorteios/', {
            query: {
                orderByChild: 'pendente',
                equalTo: false
            }
        })
    }

    inscreverUsuario(sorteio: any):firebase.Promise<any> {
        let uid = firebase.auth().currentUser.uid;
        let email = firebase.auth().currentUser.email;
        let nome = firebase.auth().currentUser.displayName;

        return this.af.database.list('inscricoes/').push({
            id_sorteio: sorteio.$key,
            id_usuario: uid,
            sorteio_usuario: sorteio.$key+'_'+uid,
            nome_usuario: nome,
            email_usuario: email
        });
    }

    getInscricaoBySorteio(sorteio): Observable<any>{
        let uid = firebase.auth().currentUser.uid;
        return this.af.database.list('inscricoes/',{
            query: {
                orderByChild: 'sorteio_usuario',
                equalTo: sorteio.$key+'_'+uid
            }
        })
    }

    //AUTH

    loginWithFacebook(){
        this.auth$.login({
            provider: AuthProviders.Facebook,
            method: AuthMethods.Redirect
            })
            .then(userFacebook => {
                console.log('User facebook: ', userFacebook)
                let credential = firebase.auth.FacebookAuthProvider.credential(userFacebook.facebook.providerId);
                firebase.auth().signInWithCredential(credential)
                    .then(user => {
                        console.log('Login with facebook', user);
                        this.saveUserInfo(user, 'facebook')
                            .then(_ => {
                                this.getUserByUid(user.uid)
                                    .then(snap => {
                                        //this.events.publish('user:registered', snap.val())
                                    }) 
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }

    saveUserInfo(user:any, provider: string){
        console.log('user saveinfo: ', user);
        let currentUser = firebase.auth().currentUser; 
        let uid = currentUser.uid;
        console.log('Current user (Save user info)', currentUser);
        let promise: Promise<any>; 
        let obj_user: any;
        //Tratando se o usuário logou com o Facebook ou com o Google. Alguns campos tem nomes diferentes
        if(provider == 'facebook'){
            obj_user = {
                uid: uid,
                nome: user.displayName,
                imagem: user.photoURL,
                email: user.email 
            }
        }

        if(provider == 'google'){
            obj_user = {
                uid: uid,
                nome: user.displayName,
                imagem: user.imageUrl,
                email: user.email 
            }
        }
        promise = new Promise((resolve, reject)=>{
            firebase.database().ref('usuarios_app/'+uid).once('value')
                .then(snapshot => {
                    console.log('snapshot verificação se há usuario cadastrado', snapshot.val());
                    if(!snapshot.val()){
                        firebase.database().ref('usuarios_app/'+uid).set(obj_user)
                        .then(data => {
                            resolve(true);
                        })
                    }
                    if(snapshot.val()){
                        //this.events.publish('user:registered', snapshot.val())
                    }
                })
        })
        return promise;
    }


    fetchProviders(provider): Promise<any> {
        
        if(provider === 'google.com'){
            let promise = new Promise((resolve, reject) => {
                this.auth$.login({
                    provider: AuthProviders.Google,
                    method: AuthMethods.Popup
                    })
                    .then(user => {
                        let credential = firebase.auth.GoogleAuthProvider.credential(user.google.providerId) 
                        console.log('credential let promise: ',credential);
                        resolve(credential);                    
                    })
            });
            return promise;            
        }
    }

    getUserByUid(uid): firebase.Promise<any> {
        return firebase.database().ref('usuarios_app/'+uid).once('value');
    }

    getUserId():string{
        return firebase.auth().currentUser.uid;
    }

    checkLogin(){
        let uid = firebase.auth().currentUser.uid;
        this.getUserByUid(uid)
            .then(snap => {
                if(snap.val()){
                    console.log('Está logado.')
                    //this.events.publish('user:registered', snap.val())
                }
                else{
                    console.log('Nao está logado');
                }
            })
    }
    logout(){
        return firebase.auth().signOut();
    }
}