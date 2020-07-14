import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../providers/access-providers';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  datastorage: any;
  name: string;

  users: any=[];
  limit:number = 13;
  start: number = 0;

  constructor(
    private router: Router,
    private toastCtrl:ToastController,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private accssPrvdrs:AccessProviders,
    private storage : Storage,
    public navCrtl : NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storage.get('storage_xxx').then((res)=>{
      console.log(res);
      this.datastorage = res;
      this.name = this.datastorage.your_name;
    });

    this.start =0;
    this.users = [];
    this.loadUsers();
  }

  async doRefresh(event){
    const loader = await this.loadingCtrl.create({
      message: 'Por favor aguarde...',
    });
    loader.present();

    this.ionViewDidEnter();
    event.target.complete();

    loader.dismiss();
  }

  async loadData(event:any){
    this.start += this.limit;
    setTimeout(() => {
     this.loadUsers().then(()=>{
        event.target.complete();
      });
    }, 500);
  }

  loadUsers(){
    
      return new Promise(resolve =>{
        let body ={
          aksi: 'load_users',
          start: this.start,
          limit: this.limit,
        }

        this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
           for (let datas of res.result){// espcialmente se você quiser user infiniti scroll por limite e dados
             this.users.push(datas);
           }
           resolve(true);
          
        });
      });
  }

  delData(a){
    return new Promise(resolve =>{
      let body ={
        aksi: 'del_users',
        id: a
      }

      this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
        if(res.success == true){
          this.presentToast('Apagado com sucesso!');
          this.ionViewDidEnter();
        }else{
          this.presentToast('Houve algum erro!');
          
        }
        
      });
    });
  }

  async prosesLogout(){
    this.storage.clear();
    this.navCrtl.navigateBack(['/intro']);
    const toast = await this.toastCtrl.create({
      message: 'Tchau!',
      duration:1500
    });
    toast.present();
  }

  openCrud(a){
    this.router.navigate(['/crud/'+a]);
  }
  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration:1500
    });
    toast.present();
  }
}
