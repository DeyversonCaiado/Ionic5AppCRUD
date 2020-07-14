import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController,AlertController } from '@ionic/angular';
import { AccessProviders } from "../providers/access-providers";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  your_name: string = "";
  gender: string = "";
  date_birth: string = "";
  email_address: string = "";
  password: string = "";
  confirm_pass: string = "";
  disabledButton;
  alertController: any;
  constructor(
    private router: Router,
    private toastCtrl:ToastController,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private accssPrvdrs:AccessProviders
  ) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.disabledButton = false;
  }

  async tryRegister(){
    if(this.your_name==""){
      this.presentToast("Seu nome é obrigatório")
    }else if(this.gender==""){
      this.presentToast("O genero é obrigatório")
    }else if(this.date_birth==""){
      this.presentToast("Data de nascimento é obrigatório")
    }else if(this.email_address==""){
      this.presentToast("O Email é obrigatório")
    }else if(this.password==""){
      this.presentToast("A senha é obrigatória")
    }else if(this.confirm_pass!= this.password){
      this.presentToast("As senhas não são iguais")
    }else{

      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Por favor aguarde...',
      });
      loader.present();

      return new Promise(resolve =>{
        let body ={
          aksi: 'proses_register',
          your_name: this.your_name,
          gender: this.gender,
          date_birth: this.date_birth,
          email_address: this.email_address,
          password: this.password,
        }

        this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.success == true){
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
          }else{
            loader.dismiss();
            this.disabledButton = false;
            this.presentAlert(res.msg);
            console.log(res);
            
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
      duration:1500,
      position:'top'
    });
    toast.present();
  }
  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Fechar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Tentar novamente',
          handler: () => {
            this.tryRegister();
          }
        }
      ]
    });

    await alert.present();
  }
}
