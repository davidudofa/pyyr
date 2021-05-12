import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  @Input() activity_details: any;
  @Input() currentModal: any;
  groupArr: any;
  lastDate: any;

  constructor() { }

  ngOnInit() {

    this.groupArr = this.activity_details.reduce((r, { date }) => {
      if (!r.some(o => o.date == date)) {
        r.push({ date, groupItem: this.activity_details.filter(v => v.date == date) });
      }
      return r;
    }, []);
    
  }

  dismissModal(){
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => { this.currentModal = null; });
    }
  }

  displayDates(item): boolean {
    if (item.date !== this.lastDate) {
      this.lastDate = item.date;
      return true;
    } else {
      return false;
    }
  }

}
