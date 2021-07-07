import { Component, OnInit } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { LoadPreAuditChecklistTasks, SavePreAuditbyRPOC,MDUUserlist } from '../../my-tasks';
import { MyTasksService } from '../../my-tasks.service';

declare var jQuery: any;
@Component({
  selector: 'app-preaudit-update-tasks',
  templateUrl: './preaudit-update-tasks.component.html',
  styleUrls: ['./preaudit-update-tasks.component.css']
})
export class PreauditUpdateTasksComponent implements OnInit {

  public modalRef: BsModalRef;

  public loadpreauditChecklist: LoadPreAuditChecklistTasks;
  public savepreauditbyRPOC: SavePreAuditbyRPOC;
  public mduuserlist:MDUUserlist[];

  public preChecklisttask: any[];
  public actionParam:any;

  public isPOC: boolean = false;
  public isMDU: boolean = false;
  public isDisabled:boolean=true;
  public MDUlist:string="";

  public isRpocApocMdu: boolean = false;
  
  constructor(private _router: Router, private modalService: BsModalService, private _manageTaskServiceClient: MyTasksService,
    private _routeParameters: ActivatedRoute, private toastr: ToastrService, private spinnerService: NgxSpinnerService) {
    this.loadpreauditChecklist = new LoadPreAuditChecklistTasks();
    this.savepreauditbyRPOC = new SavePreAuditbyRPOC();

    this.loadpreauditChecklist.target_achieved = null;
  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      console.log(data)
      this.actionParam = data['action'];
      this.loadpreauditChecklist.audit_id = data['auditID'];
    })

    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }

    //this.loadpreauditChecklist.audit_id = '1';
    this.loadpreauditChecklist.user_id = sessionStorage.getItem('UserID');

    this.spinnerService.show();
    this._manageTaskServiceClient.LoadPreAuditReadiness(this.loadpreauditChecklist).subscribe((data: any) => {
      this.preChecklisttask = data.filter(d => d['audit_checklist_id'] == this.actionParam);
      this.isPOC = this.preChecklisttask[0].user_role == 'POC' ? true : false;
      this.isMDU = this.preChecklisttask[0].task_status == ""  || this.preChecklisttask[0].task_status == "Rejected by MDU"  ? true : false;
      if(this.isPOC==false){
          this._manageTaskServiceClient.MDUUserlist().subscribe((data:any[])=>{
          this.mduuserlist=data;
          this.mduuserlist.forEach(element => {
          this.MDUlist+=";"+element.associatedetail;
          });
          this.MDUlist=this.MDUlist.substring(1);
          })
       
      }
      this.loadpreauditChecklist.target_achieved = this.preChecklisttask[0].target_achieved;
      this.loadpreauditChecklist.comments = this.preChecklisttask[0].comments;
      console.log(this.preChecklisttask);
      if(this.loadpreauditChecklist.target_achieved == "") {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      this.spinnerService.hide();
    })
  }

  targetclick() {
    if(this.loadpreauditChecklist.target_achieved != "") {
      console.log(this.loadpreauditChecklist.target_achieved)
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
  commentsclick(value){
    if(!(value.replace(/\s/g, '').length))
    {
      this.savepreauditbyRPOC.p_comments = '';
    }
  }

  SaveUpdateChecklist() {
    this.savepreauditbyRPOC.p_audit_id = this.loadpreauditChecklist.audit_id;
    this.savepreauditbyRPOC.p_user_id = this.loadpreauditChecklist.user_id;
    this.savepreauditbyRPOC.p_audit_checklist_id = this.actionParam;
    this.savepreauditbyRPOC.p_preaudit_checklist_id = this.preChecklisttask[0].preaudit_checklist_id;
    this.savepreauditbyRPOC.p_target_achieved = this.loadpreauditChecklist.target_achieved;
    // this.savepreauditbyRPOC.p_comments = this.loadpreauditChecklist.comments;
    this.savepreauditbyRPOC.p_role = this.preChecklisttask[0].user_role;
    this.savepreauditbyRPOC.p_action = 'SAVE';
    this._manageTaskServiceClient.SubmitPreAuditbyRPOC(this.savepreauditbyRPOC).subscribe((data: any) => {
      if(data == 'success') {
        this.toastr.success("Checklist " + this.savepreauditbyRPOC.p_audit_id + " saved successfully", 'Success', { enableHtml: true });
          console.log(this.savepreauditbyRPOC);
      }
    })
  }

  SubmitUpdateChecklist() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Submit Task",
        message: "Are you sure you want to submit your Task?",
        callback: (result) => {
          if(result == 'yes') {
            this.savepreauditbyRPOC.p_audit_id = this.loadpreauditChecklist.audit_id;
            this.savepreauditbyRPOC.p_user_id = this.loadpreauditChecklist.user_id;
            this.savepreauditbyRPOC.p_audit_checklist_id = this.actionParam;
            this.savepreauditbyRPOC.p_preaudit_checklist_id = this.preChecklisttask[0].preaudit_checklist_id;
            this.savepreauditbyRPOC.p_target_achieved = this.loadpreauditChecklist.target_achieved;
            // this.savepreauditbyRPOC.p_comments = this.loadpreauditChecklist.comments;
            this.savepreauditbyRPOC.p_role = this.preChecklisttask[0].user_role;
            this.savepreauditbyRPOC.p_action = 'SUBMIT';
            this._manageTaskServiceClient.SubmitPreAuditbyRPOC(this.savepreauditbyRPOC).subscribe((data: any) => {
              if(data == 'success') {
                // when POC submits , send email service // TaskCompletion/PreAuditMDURCMMail
                this._manageTaskServiceClient.sendPreAuditRPOCSubmitmail(this.savepreauditbyRPOC).subscribe((emaildata: any) => {                          
                  console.log('preaudit checklist submit email by RPOC')
                })
                this.toastr.success("New Checklist " + this.savepreauditbyRPOC.p_audit_id + " submitted successfully", 'Success', { enableHtml: true })
                this._router.navigateByUrl('Mytasks');
              }
            })
          } else if(result == 'no') {
            console.log('no');
          }
        }
      }
    })
  }

  // UpdatePreAuditTask(eve: any) {
  //   this.savepreauditbyRPOC.p_audit_id = this.loadpreauditChecklist.audit_id;
  //   this.savepreauditbyRPOC.p_user_id = this.loadpreauditChecklist.user_id;
  //   this.savepreauditbyRPOC.p_audit_checklist_id = this.actionParam;
  //   this.savepreauditbyRPOC.p_preaudit_checklist_id = this.preChecklisttask[0].preaudit_checklist_id;
  //   this.savepreauditbyRPOC.p_target_achieved = this.loadpreauditChecklist.target_achieved;
  //   // this.savepreauditbyRPOC.p_comments = this.loadpreauditChecklist.comments;
  //   this.savepreauditbyRPOC.p_role = this.preChecklisttask[0].user_role;
  //   // this.savepreauditbyRPOC.p_action = 'SAVE';
  //   if(eve.target.name == "btnSave") {
  //     this.savepreauditbyRPOC.p_action = 'SAVE';
  //   } else if(eve.target.name == "btnSubmit") {
  //     this.savepreauditbyRPOC.p_action = 'SUBMIT';
  //   }
  //   this._manageTaskServiceClient.SubmitPreAuditbyRPOC(this.savepreauditbyRPOC).subscribe((data: any) => {
  //     if(data == 'success') {
  //       if(eve.target.name == 'btnSave') {
  //         this.toastr.success("New audit saved successfully", "success");
  //         console.log(this.savepreauditbyRPOC);
  //       }
  //       if(eve.target.name == 'btnSubmit') {
  //         this.modalRef = this.modalService.show(ConfirmDialogComponent, {
  //           initialState: {
  //             title: "Update Task",
  //             message: "Are you sure you want to Update your Task?",
  //             callback: (result) => {
  //               if(result == 'yes') {
  //                 this._router.navigateByUrl('/Mytasks/');
  //               }
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
    
  // }

  ShowSubmit() {
    
    if(this.loadpreauditChecklist.target_achieved == "" || this.loadpreauditChecklist.target_achieved == null) {
      this.toastr.error("Target achieved should not be empty","error");
      return;
    }
    jQuery("#Submitpopup").modal();
    this.loadpreauditChecklist.comments = "";
    // } else {
    //   this.ApproveSubmitPopup()
    // }
  }

  ShowReject() {
    jQuery("#Rejectpopup").modal();
    this.savepreauditbyRPOC.p_comments = "";
  }

  CloseSubmitPopup() {
    jQuery("#Submitpopup").modal('hide');
    this.loadpreauditChecklist.comments = "";
  }

  CloseRejectPopup() {
    jQuery("#Rejectpopup").modal('hide');
    this.savepreauditbyRPOC.p_comments = "";
  }

  ApproveSubmitPopup(action: any) {
    this.savepreauditbyRPOC.p_audit_id = this.loadpreauditChecklist.audit_id;
    this.savepreauditbyRPOC.p_user_id = this.loadpreauditChecklist.user_id;
    this.savepreauditbyRPOC.p_audit_checklist_id = this.actionParam;
    this.savepreauditbyRPOC.p_preaudit_checklist_id = this.preChecklisttask[0].preaudit_checklist_id;
    this.savepreauditbyRPOC.p_target_achieved = this.loadpreauditChecklist.target_achieved;
    this.savepreauditbyRPOC.p_comments = action.target.name == "btnApprove" ? this.loadpreauditChecklist.comments : this.savepreauditbyRPOC.p_comments ;
    this.savepreauditbyRPOC.p_role = this.preChecklisttask[0].user_role;
    if(action.target.name == "btnApprove") {
      this.savepreauditbyRPOC.p_action = 'APPROVE';
    } else if(action.target.name == "btnReject") {
      this.savepreauditbyRPOC.p_action = 'REJECT';
    }
    this._manageTaskServiceClient.SubmitPreAuditbyRPOC(this.savepreauditbyRPOC).subscribe((data: any) => {
      if(data == 'success') {
        
        if(action.target.name == 'btnApprove') {
           //MDU case. no need of email service for success case
          jQuery("#Submitpopup").modal('hide');
          this.toastr.success("Pre-audit checklist tasks has been approved.", "Success", { enableHtml: true });
          this._router.navigateByUrl('Mytasks');
        } else if(action.target.name == 'btnReject') {
          // MDU case. send reject email. need email service // TaskCompletion/PreAuditRejectionMail
          this._manageTaskServiceClient.sendPreAuditRejectionmail(this.savepreauditbyRPOC).subscribe((emaildata: any) => {                          
            console.log('preaudit rejection email from Update page')
          })
          jQuery("#Rejectpopup").modal('hide');          
          this.toastr.success("Pre-audit checklist tasks has been rejected.", "Success", { enableHtml: true });
          this._router.navigateByUrl('Mytasks');
        }
      }
    })
  }

  BacktoChecklist() {
    this._router.navigateByUrl("/Mytasks/Preaudittasks/" + this.loadpreauditChecklist.audit_id);
  }

  CanceltoChecklist() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Discard Changes",
        message: "Are you sure you want to Discard your Changes?",
        callback: (result) => {
          if(result == 'yes') {
            this._router.navigateByUrl("/Mytasks/Preaudittasks/" + this.loadpreauditChecklist.audit_id);
          }
        }
      }
    })
  }
  // const dialogRef = this._matDialog.open( ConfirmDialogComponent, {
  //   maxWidth: "600px",
  //   maxHeight : "200px",
  //   data: {
  //       title: "Update Task",
  //       message: "Are you sure you want to Update your Task?"}
  // });
  // dialogRef.afterClosed().subscribe(dialogResult => {
  //   if(dialogResult){
  //     this._router.navigateByUrl('/Mytasks/Preaudittasks/a/b');
  //   }
  // })
}
