import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PyyrserviceService } from '../pyyrservice.service';
import { StorageService } from '../storageservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  myForm: FormGroup;
  submitted = false;
  constructor(public formBuilder: FormBuilder, public storage: StorageService, public route: ActivatedRoute, public router: Router, public toastController: ToastController, public pyyrservice: PyyrserviceService) { }
  reguser: any = {};
  registerform: boolean = true;

  async ngOnInit() {
    const registered_user = this.storage.get('registered_user');
    if(registered_user!=null){
      console.log('unsdasdsdefined');
      this.router.navigate(["/userlogin"], { relativeTo: this.route });
    }
  }

  get errorCtr() {
    return this.myForm.controls;
  }

  regDetails(){
    console.log(this.reguser);
    this.submitted = true;
    var passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!this.reguser.fullname) {
      this.showMessage('danger', 'Your fullname is required.');
      return false;
    } else if (!this.reguser.usermail) {
      this.showMessage('danger', 'Your email address is required.');
      return false;
    } else if (!this.validateEmail(this.reguser.usermail)){
      this.showMessage('danger', 'Please enter a valid email.');
      return false;
    } else if (!this.reguser.passcode){
      this.showMessage('danger', 'Choose a password');
      return false;
    } else if (!this.reguser.passcode.match(passwordregex)) {
      this.showMessage('danger', 'Your password is too weak.');
      return false;
    }else{
      console.log(this.reguser);
      this.registerform = false;
    }
  }

  regBank(){
    if(!this.reguser.userbvn){
      this.showMessage('danger', 'Please enter your BVN');
      return false;
    }else if(!this.reguser.useracct) {
      this.showMessage('danger', 'Please enter your account number');
      return false;
    }else{
      this.pyyrservice.register(this.reguser).subscribe(async resp=>{
        var tmp: any = {};
        tmp=resp;
        if(tmp.status==200){
          this.showMessage('success', 'Successfully Registered! Welcome to PyyR. Fund your wallet and begin the adventure');
          await this.storage.set('registered_user', JSON.stringify(this.reguser));
          this.router.navigate(["/userlogin"], { relativeTo: this.route });
        }
      }, error=>{
        this.showMessage('danger', error.message);
      })
    }
  }

  async showMessage(msg_type, msg) {
    const toast = await this.toastController.create({
      color: msg_type,
      animated: true,
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  newLogin(){
    this.router.navigate(["/userlogin"], { relativeTo: this.route });
  }

}
