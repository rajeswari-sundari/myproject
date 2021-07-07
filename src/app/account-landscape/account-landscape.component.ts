import { Component, OnInit, ViewChild } from '@angular/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-account-landscape',
  templateUrl: './account-landscape.component.html',
  styleUrls: ['./account-landscape.component.css']
})
export class AccountLandscapeComponent implements OnInit {
  @ViewChild("tabset", { static: true }) tabset: TabsetComponent;

  public tabID: Number;
  public tabMenu: any;
  public tabsets: any[]

  public userRole: string;
  //public isSBU: boolean = false;
  constructor(private _routeParameters: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.userRole = sessionStorage.getItem("UserRole");
    console.log(this.userRole);
    //this.isSBU = this.userRole == 'SBU' ? true : false;
    if(sessionStorage.getItem("AccessSBU") == 'true' ||
    ((this.userRole=='RPOC' || this.userRole=='APOC') && sessionStorage.getItem('HasAccess') == 'true')) {
      this.tabsets = [
        {title: 'Dashboard', ID: 1}
      ]
    } else {
      this.tabsets = [
        { title: 'Dashboard', ID: 1 },
        { title: 'Manage controls', ID: 2 },
        { title: 'Manage integrations', ID: 3 },
        { title: 'Published records', ID: 4 }
      ]
    }
    this._routeParameters.params.subscribe((data) => {
      console.log(data);
      if(data['action'] == 1){
        this.tabsets[1].active = true;   
      }else if(data['action']==2){
        this.tabsets[2].active = true;
      }
      else if(data['action']==3){
        this.tabsets[3].active = true;
      }
      else{
        this.tabsets[0].active = true;
      }
    })

    
  }

  SelectTab(tab: TabDirective) {
    tab.active = true;
  }

  tabactive(tabID): void {
    if (tabID == 4) {
      this.tabMenu = null;
    }
    else {
      this.tabsets[tabID].active = true;
    }
  }

}
