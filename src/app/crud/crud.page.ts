import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from '../providers/access-providers';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  id: number;
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
    private accssPrvdrs:AccessProviders,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data:any)=>{
      console.log('ngOnInit: '+data);
      this.id = data.id;

      if(this.id!=0){
        this.loadUser();
      }
    });
  }
  ionViewDidEnter(){
    this.disabledButton = false;
  }

  loadUser(){
        return new Promise(resolve =>{
          let body ={
            aksi: 'load_single_data',
            id: this.id
          }
  
          this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
            this.your_name = res.result.your_name;
            this.gender= res.result.gender;
            this.date_birth= res.result.date_birth;
            this.email_address= res.result.email_address;
          });
        });
  
  }

  async crudAction(a){
    if(this.your_name==""){
      this.presentToast("Seu nome é obrigatório")
    }else if(this.gender==""){
      this.presentToast("O genero é obrigatório")
    }else if(this.date_birth==""){
      this.presentToast("Data de nascimento é obrigatório")
    }else if(this.email_address==""){
      this.presentToast("O Email é obrigatório")
    }else if(this.password=="" && this.id==0){
      this.presentToast("A senha é obrigatória")
    }else{

      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Por favor aguarde...',
      });
      loader.present();

      return new Promise(resolve =>{
        let body ={
          aksi: 'proses_crud',
          id: this.id,
          your_name: this.your_name,
          gender: this.gender,
          date_birth: this.date_birth,
          email_address: this.email_address,
          password: this.password,
          action: a
        }

        this.accssPrvdrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.success == true){
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast(a+res.msg);
            this.router.navigate(['/home']);
          }else{
            loader.dismiss();
            this.disabledButton = false;
            this.presentAlert(res.msg,a);
            console.log(res.erro);
            
          }

        },(err)=>{
          loader.dismiss();
            this.disabledButton = false;
            this.presentAlert('Tempo limite alcançado, tente depois',a);
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
  async presentAlert(a,b) {
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
            this.crudAction(b);
          }
        }
      ]
    });

    await alert.present();
  }


}
