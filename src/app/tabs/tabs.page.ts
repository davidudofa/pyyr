import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storageservice';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public storage: StorageService, public router: Router, public route: ActivatedRoute) {
    var registered_user = JSON.parse(this.storage.get('registered_user'));
    console.log(registered_user);
    if (registered_user == null) {
      this.router.navigate(["/login"], { relativeTo: this.route });
    }else{
      registered_user.firstName = registered_user.fullname.split(' ').slice(0, -1).join(' ');
      registered_user.lastName = registered_user.fullname.split(' ').slice(-1).join(' ');
      this.storage.set('registered_user', JSON.stringify(registered_user));
    }
  }

}
