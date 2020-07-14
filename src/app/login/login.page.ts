import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController,AlertController,NavController } from '@ionic/angular';
import { AccessProviders } from "../providers/access-providers";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  email_address: string = "";
  password: string = "";
  disabledButton;

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
    this.disabledButton = false;
  }

  async tryLogin(){
   if(this.email_address==""){
      this.presentToast("O Email é obrigatório")
    }else if(this.password==""){
      this.presentToast("A senha é obrigatória")
    }else{

      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Por favor aguarde...',
      });
      loader.present();

      return new Promise(resolve =>{
        let body ={
          aksi: 'proses_login',
          email_address: this.email_address,
          password: this.password,
        }

        this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.success == true){
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast('Bem vindo!');
            this.storage.set('storage_xxx', res.result);// Criar sessão no storage
            console.log('resultado original:'+res.result);
            this.storage.get('storage_xxx').then((res)=>{
              console.log('resultado:'+res);
            });
            this.navCrtl.navigateRoot(['/home']);
          }else{
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast('E-mail ou senha inválido!');
            console.log(res.msg);
            
          }

        },(err)=>{
          loader.dismiss();
            this.disabledButton = false;
            this.presentToast('Tempo limite alcançado, tente depois');
            console.log(err);
        });
      });


    }
  }

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration:1500
    });
    toast.present();
  }

  openRegister(){
    this.router.navigate(['/register']);
  }

}
