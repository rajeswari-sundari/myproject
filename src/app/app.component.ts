import { Component,OnInit,ViewChild } from '@angular/core';
import { AppUserService }from './app-user.service';
import {MatMenuTrigger} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';


declare var jQuery: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  
  private menuTrigger: MatMenuTrigger;
  title = 'ART';
  public APIURL : string;
 // public LoginPage:boolean=false;
  //public Login:boolean=true;

   //public UserID:string;
  // public UserRole:string;

    
  constructor( private _router : Router) {
    
  }
    
  ngOnInit() {​​ 
    //this._router.navigateByUrl('/Login');
    // var url=window.location.href;
    // var pageName=url.substring(url.lastIndexOf('/')+1);
    // if(pageName=='' || pageName==null){
    //  this.LoginPage=true;
    //  this.Login=false;
    // }
   // this._router.navigateByUrl('/Login');
  
    }  
    // onSelect(event: any):void{
    //   console.log(event);
    //  // if(window.getSelection && window.getSelection().toString()){
    //     var menu = document.getElementById('menuitem');
    //     console.log(menu);
    //     menu.style.display = 'block';
    //     menu.style.position = 'absolute';
    //     menu.style.left = event.pageX + 5 + 'px';
    //     menu.style.top = event.pageY + 5 + 'px';
  
    //     //this.menuTrigger.openMenu();  
    //   //}
      
    // }  

    // onMenuClosed():void {
    //   var menu = document.getElementById('menuBtn');
    //       if (menu) {
    //           menu.style.display = 'none';            
    //       }
    // }

    // openNav() {
    //   document.getElementById("mySidepanel").style.width = "350px";
    // }
    
    // closeNav() {
    //   document.getElementById("mySidepanel").style.width = "0";
    // }

    // OnLogin() {
    //   var userID=jQuery("#userID").val();
    //   this.userService.getValidUser(userID).subscribe((data :any) => {
    //     if(data['success']=="success"){
    //       this.UserID=data['ID'];
    //       this.UserRole=data['Role'];
    //       sessionStorage.setItem("UserID", this.UserID);
    //       sessionStorage.setItem("UserRole", this.UserRole);
    //       console.log(this.UserRole)
    //       this.LoginPage=false;
    //       this.Login=true;
    //       if(this.UserRole == 'RPOC' || this.UserRole == 'APOC') {
    //         this._router.navigateByUrl('Mytasks');
    //       } else if(this.UserRole == 'MDU') {
    //         this._router.navigateByUrl('Accountlandscape')
    //       }
    //       }
    //       else if(data['success']=="failure"){
    //         this.toastr.error("Invalid User", 'error');
    //         jQuery("#userID").val('');
    //       }
    //       else{
    //         this.toastr.error("Something went wrong in db", 'error');
    //         jQuery("#userID").val('');
    //       }
    //   })
    //  }
   
    
}
