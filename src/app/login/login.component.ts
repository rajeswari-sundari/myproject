import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUserService } from '../app-user.service';
declare var jQuery: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public UserID:string;
  public UserRole:string;
  public hasAccess: any;
  public hasAccessSBU: any;
  public emailReturnUrl : string;
  public loggeduser : any;
  constructor(private userService: AppUserService, public toastr: ToastrService, private _router: Router,
    private _routeParameters : ActivatedRoute) {
    _routeParameters.queryParams.subscribe((data) => {
      this.emailReturnUrl = data["returnUrl"];
      })
  }

  ngOnInit() {
  }

  OnLogin() {
    var userID=jQuery("#userID").val();
    this.userService.getValidUser(userID).subscribe((data :any) => {
      console.log(data);
      if(data['success']=="success"){
        this.UserID=data['ID'];
        this.UserRole=data['Role'];
        this.hasAccess = data['HasAccessAccLs'];
        this.hasAccessSBU = data['HasAccessEDPAMSBU'];
        sessionStorage.setItem("UserID", this.UserID);
        sessionStorage.setItem("UserRole", this.UserRole);
        sessionStorage.setItem("HasAccess", this.hasAccess);
        sessionStorage.setItem("AccessSBU", this.hasAccessSBU);
        console.log(sessionStorage.getItem('HasAccess'));
        this.userService.loggedIn.next(this.UserID);
        console.log(this.UserRole)
          if(this.emailReturnUrl != null) {
            this._router.navigateByUrl(this.emailReturnUrl);
          }else {
            if((this.UserRole == 'RPOC' || this.UserRole == 'APOC') && this.hasAccess == true) {
              this._router.navigateByUrl('Accountlandscape')
            }
            else if(this.UserRole == 'RPOC' || this.UserRole == 'APOC') {
              this._router.navigateByUrl('Mytasks');
            } else if(this.UserRole == 'MDU' || this.hasAccessSBU == true || 
            ((this.UserRole == 'RPOC' || this.UserRole == 'APOC') && this.hasAccessSBU == true)) {
              this._router.navigateByUrl('Accountlandscape')
            }  
          }
        }
        else if(data['success']=="failure"){
          this.toastr.error("Invalid User", 'error');
          jQuery("#userID").val('');
        }
        else{
          this.toastr.error("Something went wrong in db", 'error');
          jQuery("#userID").val('');
        }
    })
   }

}
