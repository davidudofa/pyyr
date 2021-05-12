import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storageservice';
import { PyyrserviceService } from '../pyyrservice.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.page.html',
  styleUrls: ['./userlogin.page.scss'],
})
export class UserloginPage implements OnInit {
  registered_user: any;
  newlogin: boolean = false;
  newlogin_data: any ={};
  login_data: any = {};

  constructor(public storage: StorageService, public pyyrservice: PyyrserviceService, public toastController: ToastController, public alert: AlertController,  public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {

    this.registered_user = JSON.parse(this.storage.get('registered_user'));
    console.log(this.registered_user);
    if(this.registered_user==null){ 
      //this.router.navigate(["/register"], { relativeTo: this.route });
      this.newlogin = true;
      this.registered_user = {};
    }else{
      this.newlogin = false;
      this.registered_user.firstName = this.registered_user.fullname.split(' ').slice(0, -1).join(' ');
      this.registered_user.lastName = this.registered_user.fullname.split(' ').slice(-1).join(' ');
      this.storage.set('registered_user', JSON.stringify(this.registered_user));
    }
      
    

  }

//login user using stored data
  loginUser(){
    if (!this.login_data.passcode){
      this.showMessage('danger', 'Please enter your passcode');
      return false;
    }else if (this.registered_user.passcode == this.login_data.passcode){
      this.showMessage('success', 'Successfully logged in! Welcome to PyyR. Fund your wallet and continue the adventure');
      this.router.navigate(["/home"], { relativeTo: this.route });
    }else{
      this.showMessage('danger', 'Invalid login credentials');
      return false;
    }
    
  }

//unlink device and delete storage data...
  async unlinkDevice(){
   const alert = await this.alert.create({
     cssClass: 'my-custom-class',
     header: 'Are you sure?',
     message: ' <strong>This action will clear your saved pyyr app data from this device</strong>!!!',
     buttons: [
       {
         text: 'Delete',
         handler: (blah) => {
           console.log('Confirm okay: blah');
           if (this.storage.deleteUser(this.registered_user)) {
             this.router.navigate(["/register"], { relativeTo: this.route });
           }

         }
       }, {
         text: 'Cancel',
         role: 'cancel',
         cssClass: 'secondary',
         handler: (blah) => {
           console.log('Confirm Cancel: blah');
         }
       }
     ]
   })
    await alert.present();
  }

//new user login to device.
  newloginUser(){
    if (!this.newlogin_data.walletid){
      this.showMessage('danger', 'Please enter your Wallet ID');
      return false;
    } else if (!this.newlogin_data.passcode){
      this.showMessage('danger', 'Please enter your passcode');
      return false;
    }else{
      this.pyyrservice.applogin(this.newlogin_data).subscribe(async resp=>{
        var tmp: any = {};
        tmp = resp;
        if (tmp.status == 200) {
          this.showMessage('success', 'Successfully logged in! Welcome to PyyR. Fund your wallet and continue the adventure');
          await this.storage.set('registered_user', JSON.stringify(tmp.data));
          this.router.navigate(["/home"], { relativeTo: this.route });
        }
      },error=>{
        this.showMessage('danger', error.message);
      })
    }
  }

//navigate to register page
  registerUser(){
    this.router.navigate(["/register"], { relativeTo: this.route });
  }

//show alerts and messages
  async showMessage(msg_type, msg) {
    const toast = await this.toastController.create({
      color: msg_type,
      animated: true,
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
