import { Component, OnInit } from '@angular/core';
import { ManageControlsService } from '../manage-controls/manage-controls.service';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { GetAuditChecklist,ChecklistJsondata }  from '../manage-controls/manageControlsSearch';
import {ActivatedRoute,Router} from "@angular/router";
//import {MatDialog} from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../Shared/confirm-dialog/confirm-dialog.component'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-checklist',
  templateUrl: './add-edit-checklist.component.html',
  styleUrls: ['./add-edit-checklist.component.css']
})
export class AddEditChecklistComponent implements OnInit {

  public modalRef: BsModalRef;

  public params:any;
  public AuditList  : GetAuditChecklist [] = [];
  public Auditdata : GetAuditChecklist;
  public AuditChecklistData : GetAuditChecklist ;
  public ChecklistJson:ChecklistJsondata;
  private audit_category_id : number;
  public  errorMessage : string;
  public auditCategoryName : string;
  constructor(private _manageControlsServiceClient : ManageControlsService, private _routeParameters : ActivatedRoute,
              private modalService: BsModalService, public toastr: ToastrService,private _router:Router,
              private spinnerService: NgxSpinnerService ){ }
// private _matDialog: MatDialog , 
  ngOnInit() {
    this._routeParameters.params.subscribe((data) =>{
      this.audit_category_id = data['auditCategoryID'];
    });
   this.GetCheckListData();
  }
  GetCheckListData()
  {
    this.AuditChecklistData = new GetAuditChecklist();
    this.AuditChecklistData.audit_category_id = this.audit_category_id;
    this.spinnerService.show()
  this._manageControlsServiceClient.getDuringAuditCheckList().subscribe((data) =>{
    if(data.length > 0) {
      this.AuditList = data.filter(d => d['audit_category_id']==this.audit_category_id);
      this.auditCategoryName = this.AuditList[0].audit_category_name;
    }
    else {
      this.AddChecklist();
    }
    this.spinnerService.hide()
  });
  }
  AddChecklist () : void {
    this.Auditdata = new GetAuditChecklist();
    this.Auditdata.audit_checklist = null;
    this.Auditdata.audit_category_id=this.audit_category_id;
    this.Auditdata.audit_category_name=this.AuditList[0].audit_category_name;
    this.AuditList.push(this.Auditdata);
    
  }
  DeleteChecklist (data : number) : void {
    this.AuditList.splice(data,1);
  }

  validationcontrol() : boolean {
    var result = false;
        for(let x of this.AuditList) {
          if(x.audit_checklist!=null){
          if(!x.audit_checklist.replace(/\s/g, '').length)
          {
            x.audit_checklist=null;
          }
        }
          if(x.audit_checklist!=null)
          {
            result = true;         
          }
          else {
            this.toastr.error("Please entered required field", 'error');
            result = false;
            return result;
          }
        }
        return result; 
    }

  SaveCheckList() : void {
    if(this.validationcontrol()) {
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Save CheckList",
          message: "Are you sure you want to save the checklist?",
          callback: (result) => {
            if(result == 'yes') {
              this.ChecklistJson = new ChecklistJsondata();
              this.ChecklistJson.ChecklistData = this.AuditList;
              this._manageControlsServiceClient.AddEditCheckList(this.ChecklistJson).subscribe((data: any) => {
                if (data == "failure") {
                  this.toastr.error("CheckList Update Failed", 'Error');
                } else {
                  this.toastr.success("Checklist Saved Successfully" ,'Success', { enableHtml: true });
                  this._router.navigateByUrl('/Managecontrols/D');
                } 
              });
            } else {
              this.GetCheckListData();
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
  //     title: "Save CheckList",
  //     message: "Are you sure you want to save the checklist?"
  //   }
  // });
  // dialogRef.afterClosed().subscribe(dialogResult => {
  //   if(dialogResult) {
  //     this.ChecklistJson = new ChecklistJsondata();
  //     this.ChecklistJson.ChecklistData = this.AuditList;
  //     this._manageControlsServiceClient.AddEditCheckList(this.ChecklistJson).subscribe((data: any) => {
  //       if (data == "failure") {
  //         this.toastr.error("CheckList Update Failed", 'Error');
  //       } else {
  //         this.toastr.success("Checklist Saved Successfully" ,'Success', { enableHtml: true });
  //         this._router.navigateByUrl('/Managecontrols/D');
  //       } 
  //     });
  //   } else {  
  //     this.GetCheckListData();     
  //   }
  // })
}
