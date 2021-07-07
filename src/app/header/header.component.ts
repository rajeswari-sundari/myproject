import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUserService } from '../app-user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit {
  public UserID:string;
  public Login:boolean;

  public RpocApoc: boolean = false;

  loggedUser: any;
  constructor(private authService: AppUserService, private _routeParameters : ActivatedRoute) {
    this.authService.loggedIn.subscribe((data : any)=>{
      console.log(data)
      this.loggedUser = data;
      if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
        this.RpocApoc = true;
      } else if(sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') {
        this.loggedUser = null;
      } else if(sessionStorage.getItem("AccessSBU") == 'true') {
        this.loggedUser = null;
      }
    });
   }

  ngOnInit() {
    this.loggedUser = sessionStorage.getItem('UserID');
    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC')  && sessionStorage.getItem('HasAccess') == 'true') {
      this.RpocApoc = true;
    }else if(sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') {
      this.loggedUser = null;
    } 
    else if(sessionStorage.getItem("AccessSBU") == 'true') {
      this.loggedUser = null;
    }
  }
  onMenuClosed():void {
    var menu = document.getElementById('menuBtn');
        if (menu) {
            menu.style.display = 'none';            
        }
  }

  onSelect(event: any):void{
    console.log(event);
      var menu = document.getElementById('menuitem');
      console.log(menu);
      menu.style.display = 'block';
      menu.style.position = 'absolute';
      menu.style.left = event.pageX + 5 + 'px';
      menu.style.top = event.pageY + 5 + 'px';
  }  
  openNav() {
    document.getElementById("mySidepanel").style.width = "350px";
    // if(sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') {
    //   this.RpocApoc = true;
    // }
  }
  
  closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }
}
