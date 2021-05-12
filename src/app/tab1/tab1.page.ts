import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';

import { ActivityComponent } from '../activity/activity.component';

import { PaystackOptions } from 'angular4-paystack';
import { Flutterwave, AsyncPaymentOptions, PaymentSuccessResponse } from "flutterwave-angular-v3"
import { PyyrserviceService } from '../pyyrservice.service';
import { StorageService } from '../storageservice';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  logged_user: any =  {};
  txnHistory: any;
  //paymentData: any;
  publicKey: any;
  customerDetails: any;
  customizations: any;
  meta: any;
  wallet_topup: any = {};


  constructor(public loadingController: LoadingController,
   public toastController: ToastController, 
   public flutterwave: Flutterwave, 
   public pyyrservice: PyyrserviceService, 
   public router: Router, 
   public modal: ModalController,
    public alertController: AlertController,
   public route: ActivatedRoute, 
   public storage: StorageService) { }

 

  paymentInit() {
    console.log('Payment initialized');
    this.loading();
  }

  
  ngOnInit() {
    var registered_user = JSON.parse(this.storage.get('registered_user'));
    console.log(registered_user);
    if (registered_user == null) {
      this.router.navigate(["/login"], { relativeTo: this.route });
    } else {
      this.logged_user = registered_user;
      var txn_hist = JSON.parse(this.storage.get('txn_history'));
      console.log(txn_hist);
      if (!txn_hist){
        this.pyyrservice.getWalletdetails(registered_user.walletid).subscribe(resp => {
          var tmp: any;
          tmp = resp;
          var wallet_bal = 0;
          tmp.data.forEach(function (item, index) {
            wallet_bal = wallet_bal + item.credit;
            wallet_bal = wallet_bal - item.debit;
            item.date = new Date(item.date).toDateString();
          })
          this.txnHistory = tmp.data;
          this.storage.set('txn_history', JSON.stringify(tmp.data));
          this.logged_user.walletbalance = wallet_bal;
          this.storage.set('registered_user', JSON.stringify(this.logged_user));
        })
      }else{
        var wallet_bal = 0;
        txn_hist.forEach(function (item, index) {
          wallet_bal = wallet_bal + item.credit;
          wallet_bal = wallet_bal - item.debit;
          item.date = new Date(item.date).toDateString();
        })
        this.txnHistory = txn_hist; 
        this.storage.set('txn_history', JSON.stringify(txn_hist));
        this.logged_user.walletbalance = wallet_bal;
        this.storage.set('registered_user', JSON.stringify(this.logged_user));
      }
      
      
    }
  }

  paymentData: AsyncPaymentOptions = {
    public_key: "FLWPUBK_TEST-9eab35b23e792ee10b8f6826201f98ad-X",
  tx_ref: this.generateReference(),
  amount: this.wallet_topup.amount,
  currency: 'NGN',
  payment_options: 'card,ussd',
    meta: { 'counsumer_id': this.logged_user.walletid, 'consumer_mac': this.logged_user.usermail },
    customer: { name: this.logged_user.fullname, email: this.logged_user.usermail, walletid: this.logged_user.walletid },
    customizations: { title: 'PyyR Wallet', description: this.logged_user.fullname, logo: '../../assets/img/pyyr_logo.png' },
}

 /* makePayment() {
    this.flutterwave.inlinePay(this.paymentData)
  }*/
  makePaymentCallback(response: PaymentSuccessResponse): void {
    console.log("Payment callback", response);
  }
  closedPaymentModal(): void {
    console.log('payment is closed');
  }

  makePayment() {
    this.paymentData.amount = this.wallet_topup.amount;
    this.paymentData.meta = { 'counsumer_id': this.logged_user.walletid, 'consumer_mac': this.logged_user.usermail },
    this.paymentData.customer = { name: this.logged_user.fullname, email: this.logged_user.usermail, walletid: this.logged_user.walletid },
    this.paymentData.customizations = { title: 'PyyR Wallet', description: this.logged_user.fullname, logo: '../../assets/img/pyyr_logo.png' },

      console.log(this.paymentData);
    this.flutterwave.asyncInlinePay(this.paymentData).then(
      (response) => {
        console.log("Promise Res", response);
        var tmp: any;
        tmp=response;
        /*
"walletid": "CLEPT06",
        "from": "Card",
        "to": "CLEPT06",
        "amount": 5000,
        "credit": 5000,
        "debit": 0,
        "balance": 5000,
        "desc": "wallet topup",
        "date": "2021-05-05 00:01:43",
        "ref": "ABCD1234"


        {status: "successful", customer: {…}, transaction_id: 2078082, tx_ref: "1620569028704", flw_ref: "FLW-MOCK-395098b06129d5fbcdaf468fd814567b", …}
amount: 10
currency: "NGN"
customer: {name: "Udofa Dave", email: "nyime2@gmail.com", phone_number: "08032000145"}
flw_ref: "FLW-MOCK-395098b06129d5fbcdaf468fd814567b"
status: "successful"
transaction_id: 2078082
tx_ref: "1620569028704"
[[Prototype]]: Object
        */
        this.wallet_topup.from = "Card";
        this.wallet_topup.walletid = this.logged_user.walletid;
        this.wallet_topup.to = this.logged_user.walletid;
        this.wallet_topup.amount = tmp.amount;
        this.wallet_topup.credit = tmp.amount;
        this.wallet_topup.debit = 0;
        this.wallet_topup.balance = (this.logged_user.walletbalance + tmp.amount);
        this.wallet_topup.desc = "wallet topup";
        this.wallet_topup.date = new Date();
        this.wallet_topup.ref = tmp.flw_ref;
        this.pyyrservice.updateWallet(this.wallet_topup).subscribe(resp=>{
          console.log(resp);
          var _tmp : any;
          _tmp = resp;
          if(_tmp.status==200){
            var wallet_bal = 0;
            _tmp.data.forEach(function (item, index) {
              wallet_bal = wallet_bal + item.credit;
              wallet_bal = wallet_bal - item.debit;
              item.date = new Date(item.date).toDateString();
            })
            this.txnHistory = _tmp.data;
            this.storage.set('txn_history', JSON.stringify(_tmp.data));
            this.logged_user.walletbalance = wallet_bal;
            this.showMessage('success', "Wallet topup successful");
          }
        }, error=>{
          this.showMessage('danger', error.message);
        })

        this.flutterwave.closePaymentModal(5)
      }
    )
  }
  
  generateReference(): string {
    let date = new Date();
    return date.getTime().toString();
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

  async loading() {
    const loading = await this.loadingController.create({
      duration: 5000,
      message: 'Please wait...',
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }

  openLink(link_add){
    this.router.navigate([link_add], { relativeTo: this.route });
  }

 async moreActivity(){
    const modal = await this.modal.create({
      component: ActivityComponent,
      componentProps: {
        'activity_details': this.txnHistory,
        'currentModal': this.modal
      }
    });
    return await modal.present();

  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Top Up Wallet!',
      backdropDismiss: false,
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Enter Amount to Top up',
          cssClass: 'specialClass',
          attributes: {
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            if(alertData.amount){
              console.log('Confirm Ok' + alertData.amount);
              this.wallet_topup.amount = alertData.amount;
              this.makePayment();
            }else{
              return false;
            }
            
          }
        }
      ]
    });

    await alert.present();
  }

}
