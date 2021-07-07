import { Component, OnInit } from '@angular/core';
import { ManageControlsService } from '../manage-controls/manage-controls.service';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { ControlDTO } from './ControlDTO';
import { ManageControlsSearch,ManageControls,ManageControlsdata }  from '../manage-controls/manageControlsSearch';
import {ActivatedRoute,Router} from "@angular/router";
//import {MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../Shared/confirm-dialog/confirm-dialog.component'
import { ToastrService } from'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-add-edit-control',
  templateUrl: './add-edit-control.component.html',
  styleUrls: ['./add-edit-control.component.css']
})
export class AddEditControlComponent implements OnInit {

  public modalRef: BsModalRef;

  public controls  : ManageControls [] = [];
  public categories : any[];
  public controlData : ManageControls;
  public manageControlsSearchData : ManageControlsSearch ;
  public manageControls : ManageControls;
  private controldatas : any[];
  private ParentCategoryID : number;
  public parentWeightage : number;
  private totalWeightage : number;
  public parentCategoryName : string;
  private restrictAutoCalcWeightage : number;
  private nonRestrictAutoCalcWeightage : number;
  private nonRestrictEqualWeightage :number ;
  private nonRestrictWeightageCount : number;
  private bothRestrictNonRestrictWeightage : number;
  //public  errorMessage : string;
  public addEditManageControls : ManageControlsdata ;
  constructor(private _manageControlsServiceClient : ManageControlsService, private _routeParameters : ActivatedRoute,
              private modalService: BsModalService, private toastr: ToastrService, private _router: Router,
              private spinnerService: NgxSpinnerService ) { }
// private _matDialog: MatDialog, 
  ngOnInit() {
    this._routeParameters.params.subscribe((data) =>{
      this.ParentCategoryID = data['parentCategoryID'];
    });
    this.GetControlData();
  }
  GetControlData():void{
    this.manageControlsSearchData = new ManageControlsSearch();
      
    this.manageControlsSearchData.ParentCategoryID = this.ParentCategoryID;
      console.log(this.manageControlsSearchData);
      this.spinnerService.show()
    this._manageControlsServiceClient.getControls(this.manageControlsSearchData).subscribe((data) =>{
      if(data.length > 0) {
        this.controls = data;
        this.parentWeightage = this.controls[0].parent_weightage;
        this.parentCategoryName = this.controls[0].parent_category_name;
        console.log(this.controls);
      }
      else {
        this.AddControl();
      }
      this.spinnerService.hide()
    });
    this._manageControlsServiceClient.getCategory(this.manageControlsSearchData).subscribe((data : KeyValuePairDTO[]) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  AddControl () : void {
    this.controlData = new ManageControls();
    console.log(this.controls)
    this.controlData.parent_category_id =  this.controls[0].parent_category_id;
    this.controlData.parent_category_name = this.controls[0].parent_category_name;
    this.controlData.parent_weightage = this.controls[0].parent_weightage;
    this.controlData.category_id = null;
    this.controlData.control_name = null;
    this.controlData.restrict_weightage_calc  = "No";
    this.controlData.weightage = null;
    this.controlData.objective = null;
    this.controls.push(this.controlData);
  }

  DeleteControl (data : number) : void {
    console.log(data);
    console.log(this.controls);
    this.controls.splice(data,1)
   
  }
  updateRestoreDefaultWeightageCalc()  : void {
    this.controls.forEach(x=> {
      x.restrict_weightage_calc = "No";
    });
    console.log(this.controls);
  }

  UpdateWeightage() : boolean {
    if(this.validationcontrol()) {
    this.controldatas  = null;
   //this.parentWeightage =0;
    this.totalWeightage  =0;
    this.restrictAutoCalcWeightage = 0;
    this.nonRestrictAutoCalcWeightage =0;
    this.nonRestrictEqualWeightage = 0;
    this.nonRestrictWeightageCount =0;
    
    this.controldatas = this.controls;
    //this.parentWeightage =this.controldatas[0].parent_weightage;
    //this.errorMessage = null;
   // for(let x of this.controldatas) 
      this.controldatas.forEach(x=> 
        {
          this.totalWeightage =  this.totalWeightage + Number(x.weightage);
          if(x.restrict_weightage_calc == "Yes") {
            this.restrictAutoCalcWeightage = this.restrictAutoCalcWeightage + Number(x.weightage);
          }
          else {
            this.nonRestrictAutoCalcWeightage = this.nonRestrictAutoCalcWeightage + Number(x.weightage);
            this.nonRestrictWeightageCount = this.nonRestrictWeightageCount + 1;
          }
        });
        //this.bothRestrictNonRestrictWeightage = this.restrictAutoCalcWeightage + this.nonRestrictAutoCalcWeightage;
        if(this.parentWeightage >= this.restrictAutoCalcWeightage){
          var Weightagesum = (this.parentWeightage -  this.restrictAutoCalcWeightage) ;
          this.nonRestrictEqualWeightage = Weightagesum > 0 ? Weightagesum/this.nonRestrictWeightageCount : 0;
          this.controldatas.forEach(x=> 
            {
              if(x.restrict_weightage_calc == "No")
              {
                x.weightage = this.nonRestrictEqualWeightage.toFixed(2);
              }
            });
        }
        else {
          this.toastr.error("Total Weightage should be lesser than Parent Weightage", 'error');
         // this.errorMessage ="Total Weightage should be lesser then Parentweightage"
         return false;
        }
        this.controls = this.controldatas;
        return true;
    }
     
      // console.log("ParentWeightage:" + this.parentWeightage);
      // console.log("totalWeightage : " + this.totalWeightage);
      // console.log("restrictAutoCalcWeightage:" + this.restrictAutoCalcWeightage);
      // console.log("nonRestrictAutoCalcWeightage:" + this.nonRestrictAutoCalcWeightage);
      // console.log("nonRestrictWeightageCount:" + this.nonRestrictWeightageCount);
      // console.log("nonRestrictEqualWeightage:" + this.nonRestrictEqualWeightage);
    
  }

  submitbuttonhideShow() :  boolean{
    var result = false;
    for(let x of this.controls) {
      if(x.control_name!=null){
      if(!x.control_name.replace(/\s/g, '').length)
          {
            x.control_name=null;
          }
        }
      if(x.category_id == null || x.control_name == "" || x.control_name==null|| x.weightage == null || ( x.weightage != null && x.weightage.toString() == "") ||  isNaN(x.weightage) || x.weightage > 100 || this.parentWeightage == null)
      {
        result = true;
        return result;
      }
    }
    return result;
  }

  validationcontrol() : boolean {
    var result = false;
    //this.controls.forEach(x=> {
      if(Number(this.parentWeightage) <= 100) {
        for(let x of this.controls) {
          if(x.category_id != null && x.control_name != "" && x.weightage.toString() != "" &&  !isNaN(x.weightage)  && this.parentWeightage != null)
          {
            result = true;
            
          }
          else {
            this.toastr.error("Please entered required fields and valid value. ", 'error');
            result = false;
            return result;
          }
        }
      }
      else {
          this.toastr.error("Parent Weightage should be lesser than or equal 100. ", 'error');
            result = false;
            return result;
      }

      
    return result;

  }
  SaveControls() : void {
    if(this.validationcontrol() && this.UpdateWeightage()) {// let's call our modal window
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Save Control",
          message: "Are you sure you want to save the control(s)?",
          callback: (result) => {
            if(result == 'yes') {
              this.addEditManageControls = new ManageControlsdata();
              this.controls.forEach(x => {
                if(x.category_name == null || x.category_name == "")  {
                  x.category_name = this.categories.filter(t=>t.Key == x.category_id)[0].Value;
                }
                x.parent_weightage = this.parentWeightage;
              });
              //this.addEditManageControls.controlData  = [];
              this.addEditManageControls.jsonadd = this.controls;
              this.addEditManageControls.userID =  "567059"
              console.log(this.addEditManageControls);
              this._manageControlsServiceClient.AddEditControls(this.addEditManageControls).subscribe((data) => {
                if (data == "failure") {
                  this.toastr.error("Control updated failed", 'error');
                } else {
                  this.toastr.success("Control updated successfully." ,'Success', { enableHtml: true });
                  this._router.navigateByUrl('/Managecontrols');
                }
              });
            } else {
              this.GetControlData();
            }
          }
        }
      })
      
    }
  }
  // const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
  //   maxWidth: "600px",
  //   maxHeight : "200px",
  //   data: {
  //     title: "Save Control",
  //     message: "Are you sure you want to save the control(s)?"
  //   }
  // });// listen to response
  // dialogRef.afterClosed().subscribe(dialogResult => {
  //   // if user pressed yes dialogResult will be true, 
  //   // if he pressed no - it will be false
  //   console.log(dialogResult);
  //   if(dialogResult){
  //     // console.log(this.controls);
  //     //this.addEditManageControls = [];
  //     this.addEditManageControls = new ManageControlsdata();
  //     this.controls.forEach(x => {
  //       if(x.category_name == null || x.category_name == "")  {
  //         x.category_name = this.categories.filter(t=>t.Key == x.category_id)[0].Value;
  //       }
  //       x.parent_weightage = this.parentWeightage;
  //     });
  //     //this.addEditManageControls.controlData  = [];
  //     this.addEditManageControls.jsonadd = this.controls;
  //     this.addEditManageControls.userID =  "567059"
  //     console.log(this.addEditManageControls);
  //     this._manageControlsServiceClient.AddEditControls(this.addEditManageControls).subscribe((data) => {
  //       if (data == "failure") {
  //         this.toastr.error("Control updated failed", 'error');
  //       } else {
  //         this.toastr.success("Control updated successfully." ,'Success', { enableHtml: true });
  //         this._router.navigateByUrl('/Managecontrols');
  //       }
  //     });
  //   } else {
  //     this.GetControlData();
  //   }
  // });
}
