import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PyyrserviceService {
  configUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  register(register_data) {
    /*
    console.log(register_data);
    register_data = { fullname: "David Udofa", usermail: "mike@udofa.com", passcode: "AlienCode69?.", userbvn: 2399227282, useracct: 123332232 } */
    return this.http.post(this.configUrl + 'register', register_data);
  };

  applogin(login_data){
    /*
    console.log(login_data);
    login_data = {walletid: "CLEPT06", passcode: "AlienCode69?."} */
    return this.http.post(this.configUrl + 'login', login_data);
  }

  getWalletdetails(walletid){
    /*console.log(walletid);
    walletid = "WALLETID";*/
    return this.http.get(this.configUrl+'walletdetails?walletid='+walletid);
  }

  updateWallet(walletdetails){
    /*console.log(walletdetails)

    */
   return this.http.post(this.configUrl+'updatewallet?walletid='+walletdetails.walletid, walletdetails);
  }

  validateWallet(walletid){
    return this.http.get(this.configUrl+'verifywallet?walletid='+walletid);
  }
}
