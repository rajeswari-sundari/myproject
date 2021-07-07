import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValuePairDTO } from '../../../Common/KeyValuePairDTO';
import {ActivatedRoute,Router} from "@angular/router";
import { ConfirmDialogComponent } from '../../../Shared/confirm-dialog/confirm-dialog.component'
import { ToastrService } from'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlLandscapeService } from '../control-landscape.service';
import { ManageControlsSearch,ManageControls,ManageControlsdata} from '../controlLandscapeClass';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-control-landscape-edit',
  templateUrl: './control-landscape-edit.component.html',
  styleUrls: ['./control-landscape-edit.component.css']
})
export class ControlLandscapeEditComponent implements OnInit {
  
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @Input() data;

  public modalRef: BsModalRef;

  public controls  : ManageControls [] = [];
  public categories : any[];
  public controlData : ManageControls;
  public manageControlsSearchData : ManageControlsSearch ; // used for displaying
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
  public ControlLandscapeEdit : ManageControlsdata ;  // used while saving
  public keyWeightage : number;
  public compWeightage : number;
  public keyCount : number;
  public complianceCount : number;

  constructor(private _manageControlsServiceClient : ControlLandscapeService, private _routeParameters : ActivatedRoute,
    private modalService: BsModalService, private toastr: ToastrService, private _router: Router,
    private spinnerService: NgxSpinnerService ) { }

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
        //this.parentWeightage = this.controls[0].parent_weightage;
        this.parentCategoryName = this.controls[0].parent_category_name;
        console.log(this.controls);

        for (let x of this.controls) {
          if (x.indicator_type == '') {
            x.indicator_type = 'Key';
          }
          if (x.follow_up_required == '') {
            x.follow_up_required = 'No';
          }
         
        }

      }
      else {
        this.AddControl(1);
      }
      this.spinnerService.hide()
    });
    this._manageControlsServiceClient.getCategory(this.manageControlsSearchData).subscribe((data : KeyValuePairDTO[]) => {
      this.categories = data;
      console.log(this.categories);
    });
  }


  AddControl (cIndex) : void {    
    this.controlData = new ManageControls();
    var lastIndex = this.controls[cIndex]
    console.log(this.controls)
    if(lastIndex.category_id != null && lastIndex.control_name != null && lastIndex.weightage != null && lastIndex.weightage <= 100 ){
      this.controlData.parent_category_id =  this.controls[0].parent_category_id;
      this.controlData.parent_category_name = this.controls[0].parent_category_name;        
      this.controlData.category_id = null;
      this.controlData.control_name = null;
      this.controlData.indicator_type = 'Key';
      this.controlData.follow_up_required = 'No';    
      this.controlData.weightage = null;    
      this.controls.push(this.controlData);
    }else{
      return;
    }

  }


  DeleteControl (data : number) : void {
    console.log(data);
    console.log(this.controls);
    this.controls.splice(data,1)
   
  }

  validateWeightage() : boolean {
    var result : boolean = true;
    this.controldatas  = null;
   //this.parentWeightage =0;
    // this.totalWeightage  =0;  
    this.controldatas = this.controls;
    
    var categorygroup = new Set(this.controldatas.map(m=>m.category_id));
   // var categorygroup = Array.from(categorygroupSet);

    categorygroup.forEach(catID =>
       {
         if(result) {
         this.compWeightage = 0;
         this.keyWeightage = 0;
         this.keyCount = 0;
         this.complianceCount = 0;
         this.controldatas.filter(y=>y.category_id == catID).forEach(x =>
          {
            if(x.indicator_type == 'Compliance'){
              this.compWeightage = this.compWeightage + Number(x.weightage);
              this.complianceCount += 1;
            }else if (x.indicator_type == 'Key'){
              this.keyWeightage = this.keyWeightage + Number(x.weightage);
              this.keyCount += 1;
            }   
          });
           if(this.keyCount == 0 && this.complianceCount == 0){
            this.toastr.error("Atleast one Key or Compliance weightage for the control", 'error');
            result =  false;
            return result;
           }
          else if(this.keyWeightage != 100 && this.keyCount > 0){
            this.toastr.error("Sum of Key Weightage should be equal to 100 for the category " + this.controldatas.find(c=>c.category_id == catID).category_name , 'error');
            result =  false;
            return result;
          }
          else if(this.compWeightage != 100 && this.complianceCount > 0){
            this.toastr.error("Sum of Compliance Weightage should be equal to 100 for the category " + this.controldatas.find(c=>c.category_id == catID).category_name, 'error');
            result =  false;
            return result;
          }
       }
      }
      );
    console.log(categorygroup);
    this.controls = this.controldatas;
    //result = true;
    return result;
      // this.controldatas.forEach(x=>
      //   {
      //     this.totalWeightage =  this.totalWeightage + Number(x.weightage);
      //     if(x.indicator_type == 'Compliance'){
      //       this.compWeightage = this.compWeightage + Number(x.weightage);
      //     }else if (x.indicator_type == 'Key'){
      //       this.keyWeightage = this.keyWeightage + Number(x.weightage);
      //     }                  
      // });
      //   if(this.keyWeightage == 100 && this.compWeightage == 100){
      //     this.controls = this.controldatas;
      //     return true;
      //   }
      //   else{
      //     if((this.keyWeightage != 100)  && (this.compWeightage != 100)){
      //       this.toastr.error("Please check Key weightage total and Compliance weightage total", 'error');
      //     }else{
      //       if(this.keyWeightage != 100 ){
      //         this.toastr.error("Sum of Key Weightage should be equal to 100", 'error');
      //       }else if(this.compWeightage != 100){
      //         this.toastr.error("Sum of Compliance Weightage should be equal to 100", 'error');
      //       }
      //     }       
      //   }
       
        // return true;

        console.log("keyweight"+ this.keyWeightage);
        console.log("compwe"+ this.compWeightage);
        
    
    
  }
  SaveControls() : void {
    // let's call our modal window only if weightage validation success
     if(this.validateWeightage()) {
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Save Control",
          message: "Are you sure you want to save the control(s)?",
          callback: (result) => {
            if(result == 'yes') {
              this.ControlLandscapeEdit = new ManageControlsdata();
              this.controls.forEach(x => {
                // if(x.category_name == null || x.category_name == "")  {
                  x.category_name = this.categories.filter(t=>t.Key == x.category_id)[0].Value;
                // }
                x.control_desc = x.control_name;
                // x.parent_weightage = this.parentWeightage;
              });
              //this.addEditManageControls.controlData  = [];
              this.ControlLandscapeEdit.accLsAddUpdateControlContexts = this.controls;
                            
              this.ControlLandscapeEdit.user_id =  sessionStorage.getItem('UserID');           
              this.ControlLandscapeEdit.p_parent_category_id = this.ParentCategoryID;
              console.log(this.ControlLandscapeEdit);
              this._manageControlsServiceClient.AddEditControls(this.ControlLandscapeEdit).subscribe((data) => {
                if (data == "failure") {
                  this.toastr.error("Control updated failed", 'error');
                } else {
                  this.toastr.success("Control updated successfully." ,'Success', { enableHtml: true });
                  this._router.navigateByUrl('/Accountlandscape/1');
                }
              });
            } else {
              // this.GetControlData();
              return;
            }
          }
        }
      })
      
    }
  }

CancelEdit(){
  // this.tabactive.emit(2);
  this._router.navigateByUrl('/Accountlandscape/1');
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
    if(x.category_id == null || x.control_name == "" || x.control_name==null|| x.weightage == null || ( x.weightage != null && x.weightage.toString() == "") ||  isNaN(x.weightage))
    {
      result = true;
      return result;
    }
  }
  return result;
}
}
