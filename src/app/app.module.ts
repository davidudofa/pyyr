import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Angular4PaystackModule } from 'angular4-paystack';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FlutterwaveModule } from "flutterwave-angular-v3"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PyyrserviceService } from './pyyrservice.service';
import { StorageService } from './storageservice';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
  declarations: [AppComponent, ActivityComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), FlutterwaveModule, IonicStorageModule.forRoot(), FormsModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule, Angular4PaystackModule],
  providers: [QRScanner, PyyrserviceService, FlutterwaveModule, StorageService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
