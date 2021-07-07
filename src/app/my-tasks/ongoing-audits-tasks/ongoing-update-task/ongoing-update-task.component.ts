import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { OngoingAuditDetails, OngoingPreAuditChecklistDetails, SaveAudibyMDU,EmailDetails , SavePreAuditbyRPOC} from '../../my-tasks';
import { MyTasksService } from '../../my-tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
@Component({
  selector: 'app-ongoing-update-task',
  templateUrl: './ongoing-update-task.component.html',
  styleUrls: ['./ongoing-update-task.component.css']
})
export class OngoingUpdateTaskComponent implements OnInit {

  public modalRef: BsModalRef;

  public loadOngoingList: OngoingAuditDetails;
  public loadOngoingChecklist: OngoingPreAuditChecklistDetails;
  public saveAuditbyMDU: SaveAudibyMDU;
  public SavePreAuditbyRPOC: SavePreAuditbyRPOC;
  
  public newOngoingList: any[];
  public newOngoingChecklist: any[];

  public audit_Type: string;
  public EmailDetails : EmailDetails;
  public selectedFile2:File;

  public isRPOC: boolean = false;
  public isPOC: boolean = false;
  public isDisabled: boolean = true;
  public isDisabled1: boolean = true;
  public isDisabled2: boolean = true;
  public isDisabled3: boolean = true;

  public isRpocApocMdu: boolean = false;

  constructor(private _router: Router, private _routeParameters: ActivatedRoute, 
    private _manageTaskServiceClient: MyTasksService, private toastr: ToastrService, 
    private modalService: BsModalService, private spinnerService: NgxSpinnerService) {
      this.loadOngoingList = new OngoingAuditDetails();
      this.loadOngoingChecklist = new OngoingPreAuditChecklistDetails();
      this.saveAuditbyMDU = new SaveAudibyMDU();
      this.SavePreAuditbyRPOC = new SavePreAuditbyRPOC();      
      this.EmailDetails = new EmailDetails();
      this.loadOngoingList.target_achieved = null;
      this.loadOngoingList.MDU_comments = null;
      

  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      console.log(data);
      this.audit_Type = data['audittype'];
      if(this.audit_Type == 'AUDIT') {
        this.loadOngoingList.p_audit_id = data['auditID'];
        this.loadOngoingList.control_id = data['action'];
        this.loadOngoingList.user_id = sessionStorage.getItem('UserID');
      } else if(this.audit_Type == 'PREAUDIT'){
        this.loadOngoingChecklist.audit_id = data['auditID'];
        this.loadOngoingChecklist.audit_checklist_id = data['action'];
        this.loadOngoingChecklist.user_id = sessionStorage.getItem('UserID');
      }
    })

    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }

    if(this.audit_Type == 'AUDIT') {
      this.selectedFile2 = null;
      // this.loadOngoingList.evidence = null;
      //this.loadOngoingList.RPOC_comments = null;
      this.spinnerService.show();
      this._manageTaskServiceClient.ListOngoingAudits(this.loadOngoingList).subscribe((data: any) => {
        console.log(data)
        this.newOngoingList = data.filter(d => d['control_id']==this.loadOngoingList.control_id);
        this.isRPOC = this.newOngoingList[0].pending_with == 'RPOC' ? true : false;
        this.loadOngoingList.target_achieved = this.newOngoingList[0].target_achieved;
        this.loadOngoingList.MDU_comments = this.newOngoingList[0].MDU_comments == "" ? this.newOngoingList[0].RPOC_comments : this.newOngoingList[0].MDU_comments;
        if(this.loadOngoingList.evidence != null || this.loadOngoingList.evidence != '') {
          this.loadOngoingList.evidence = this.newOngoingList[0].evidence;
        }
        console.log(this.newOngoingList);
        if(this.loadOngoingList.target_achieved=="" && this.loadOngoingList.MDU_comments=="") {
          this.isDisabled=true;
        } else {
          this.isDisabled=false;
        }
        // if(this.loadOngoingList.RPOC_comments == "") {
        //   this.isDisabled2 = true;
        // } else {
        //   this.isDisabled2 = false;
        // }
        this.spinnerService.hide();
      })
    } else if(this.audit_Type == 'PREAUDIT') {
      this.loadOngoingChecklist.comments = null;
      this.spinnerService.show();
      this._manageTaskServiceClient.ListOngoingPreAuditChecklist(this.loadOngoingChecklist).subscribe((data: any) => {
        console.log(data);
        this.newOngoingChecklist = data.filter(c => c['audit_checklist_id'] == this.loadOngoingChecklist.audit_checklist_id);
        this.isPOC = this.newOngoingChecklist[0].pending_with == 'RPOC' ? true : false;
        this.loadOngoingChecklist.target_achieved = this.newOngoingChecklist[0].target_achieved;
        if(this.loadOngoingChecklist.target_achieved == "") {
          this.isDisabled1=true;
        } else {
          this.isDisabled1=false;
        }
        // if(this.loadOngoingChecklist.comments == "") {
        //   this.isDisabled3 = true;
        // } else {
        //   this.isDisabled3 = false;
        // }
        console.log(this.newOngoingChecklist);
        this.spinnerService.hide()
      })
    }
    
  }

  targetclick(event):void{
    let reg = /^([0-9]+)*[0-9]+$/;
    console.log(reg.test(this.loadOngoingList.target_achieved));
    if(reg.test(this.loadOngoingList.target_achieved) == true && Number(this.loadOngoingList.target_achieved)<=100) {
      if(this.loadOngoingList.target_achieved!="" && this.loadOngoingList.MDU_comments!=""){
        this.isDisabled=false;
      } else{
        this.isDisabled=true;
      }
    } else{
      this.isDisabled=true;
    }
  }

  radioclick(): void {
    if(this.loadOngoingChecklist.target_achieved != "") {
      console.log(this.loadOngoingChecklist.target_achieved)
      this.isDisabled1 = false;
    } else {
      this.isDisabled1 = true;
    }
  }

  rejectaudit(value : any): void {
    if(!(value.replace(/\s/g, '').length))
    {
      this.loadOngoingList.comments = '';
    }
  }


  rejectlist(value:any): void {
    if(!(value.replace(/\s/g, '').length))
    {
      this.loadOngoingChecklist.comments = '';
    }
   
  }

  onFileSelect2(event) {
    this.selectedFile2 = event.target.files[0];
    this.loadOngoingList.evidence = this.selectedFile2.name;
  //   // console.log(this.EvidenceFileName);
  }

  SaveOngoing() {
    if(this.audit_Type == 'AUDIT') {
      this.saveAuditbyMDU.audit_id = this.loadOngoingList.p_audit_id;
      this.saveAuditbyMDU.control_id = this.loadOngoingList.control_id;
      this.saveAuditbyMDU.user_id = this.loadOngoingList.user_id;
      this.saveAuditbyMDU.audit_type = this.audit_Type;
      this.saveAuditbyMDU.comments = this.loadOngoingList.MDU_comments;
      this.saveAuditbyMDU.p_target_achieved = this.loadOngoingList.target_achieved;
      this.saveAuditbyMDU.evidence = this.loadOngoingList.evidence;
      this.saveAuditbyMDU.action = 'SAVE';
      // if(this.loadOngoingList.evidence == "" || this.loadOngoingList.evidence == null) {
      //   this.saveAuditbyMDU.evidence = "No attachments";
      // }
      // else {
        if(this.selectedFile2 == null) {
          this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
            if(data == 'success') {
              this.toastr.success("Ongoing Audit " + this.loadOngoingList.p_audit_id + " Saved Successfully","Success");
              console.log(this.saveAuditbyMDU);
            }
          })
        } else {
          let formData = new FormData();
          formData.append('file', this.selectedFile2, this.selectedFile2.name);
          this._manageTaskServiceClient.ImportEvidence(formData).subscribe((data: any) => {
            if(data == "Invalidfiletype") {
              this.toastr.error("File type error, Evidence allows only pdf, jpg & png files should be less than 5MB","error");
            }
            else {
              this.saveAuditbyMDU.evidence = data;
              console.log(this.saveAuditbyMDU.evidence)
              // this.UpdateReadinessTask(eve.target.name);
            }
          })
          this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
            if(data == 'success') {
              this.toastr.success("Ongoing Audit " + this.loadOngoingList.p_audit_id + " Saved Successfully","Success");
              console.log(this.saveAuditbyMDU);
            }
          })
        }
      // }
    } 
    else if(this.audit_Type == 'PREAUDIT'){
      this.saveAuditbyMDU.audit_id = this.loadOngoingChecklist.audit_id;
      this.saveAuditbyMDU.user_id = this.loadOngoingChecklist.user_id;
      this.saveAuditbyMDU.p_audit_checklist_id = this.loadOngoingChecklist.audit_checklist_id;
      this.saveAuditbyMDU.p_preaudit_checklist_id = this.newOngoingChecklist[0].preaudit_checklist_id;
      this.saveAuditbyMDU.audit_type = this.audit_Type;
      this.saveAuditbyMDU.p_target_achieved = this.loadOngoingChecklist.target_achieved;
      this.saveAuditbyMDU.action = 'SAVE';
      this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
        if(data == 'success') {
          this.toastr.success("Ongoing Checklist " + this.loadOngoingChecklist.audit_id + " Saved Successfully","Success");
          console.log(this.saveAuditbyMDU);
        }
      })
    }
  }

  SubmitOngoing() {
    if(this.audit_Type == 'AUDIT') {
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Submit & Approve Task",
          message: "Are you sure you want to Submit & Approve your Task?",
          callback: (result) => {
            if(result == 'yes') {
              this.saveAuditbyMDU.audit_id = this.loadOngoingList.p_audit_id;
              this.saveAuditbyMDU.control_id = this.loadOngoingList.control_id;
              this.saveAuditbyMDU.user_id = this.loadOngoingList.user_id;
              this.saveAuditbyMDU.audit_type = this.audit_Type;
              this.saveAuditbyMDU.comments = this.loadOngoingList.MDU_comments;
              this.saveAuditbyMDU.p_target_achieved = this.loadOngoingList.target_achieved;
              this.saveAuditbyMDU.evidence = this.loadOngoingList.evidence;
                this.saveAuditbyMDU.action = 'APPROVE'; 
               // this.EmailDetails.p_audit_id = this.saveAuditbyMDU.audit_id;
               // this.EmailDetails.p_control_ids = this.saveAuditbyMDU.control_id;      
                // Email Usecase only for - pending with RPOC    
                if(this.selectedFile2 == null) {
                  this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
                    if(data == 'success') {
                      // send mail to APOC /TaskCompletion/APOCMail once MDU submits 
                      /* removed usecase
                      this._manageTaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
                        console.log('emailsuccess')
                       })
                       */
                      this.toastr.success("Ongoing Audit" + this.loadOngoingList.p_audit_id + " Approved Successfully","Success");
                      this._router.navigateByUrl('Mytasks')
                      console.log(this.saveAuditbyMDU);
                    }
                  })
                } else {
                  let formData = new FormData();
                  formData.append('file', this.selectedFile2, this.selectedFile2.name);
                  this._manageTaskServiceClient.ImportEvidence(formData).subscribe((data: any) => {
                    if(data == "Invalidfiletype") {
                      this.toastr.error("File type error, Evidence allows only pdf, jpg & png files should be less than 5MB","error");
                    }
                    else {
                      this.saveAuditbyMDU.evidence = data;
                      console.log(this.saveAuditbyMDU.evidence)
                      // this.UpdateReadinessTask(eve.target.name);
                    }
                  })
                  this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
                    if(data == 'success') {
                      
                      //send mail to APOC /TaskCompletion/APOCMail once MDU submits 
                      /*removed usecase
                      this._manageTaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
                        console.log('emailsuccess')
                       })
                       */
                      this.toastr.success("Ongoing Audit" + this.loadOngoingList.p_audit_id + " Approved Successfully","Success");
                      this._router.navigateByUrl('Mytasks')
                      console.log(this.saveAuditbyMDU);
                    }
                  })
                }
              //}
            }
          }
        }
      })
    }
    else if(this.audit_Type == 'PREAUDIT') {
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Submit & Approve Task",
          message: "Are you sure you want to Submit & Approve your Task?",
          callback: (result) => {
            if(result == 'yes') {
              this.saveAuditbyMDU.audit_id = this.loadOngoingChecklist.audit_id;
              this.saveAuditbyMDU.user_id = this.loadOngoingChecklist.user_id;
              this.saveAuditbyMDU.p_audit_checklist_id = this.loadOngoingChecklist.audit_checklist_id;
              this.saveAuditbyMDU.p_preaudit_checklist_id = this.newOngoingChecklist[0].preaudit_checklist_id;
              this.saveAuditbyMDU.audit_type = this.audit_Type;
              this.saveAuditbyMDU.p_target_achieved = this.loadOngoingChecklist.target_achieved;
              this.saveAuditbyMDU.action = 'SUBMIT';
              
              this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
                if(data == 'success') {               
                   /*        removed usecase       
                  this.SavePreAuditbyRPOC.p_audit_id = this.saveAuditbyMDU.audit_id
                  this.SavePreAuditbyRPOC.p_audit_checklist_id = this.saveAuditbyMDU.p_audit_checklist_id
                  this.SavePreAuditbyRPOC.p_preaudit_checklist_id = this.saveAuditbyMDU.p_preaudit_checklist_id 
                  // /TaskCompletion/PreAuditMDURCMMail check this
                 
                   this._manageTaskServiceClient.sendPreAuditRPOCSubmitupdatemail(this.SavePreAuditbyRPOC).subscribe((emaildata: any) => {                          
                     console.log('Update page - preaudit checklist submit email by RPOC')
                   })
                   */
                  this.toastr.success("Ongoing Checklist " + this.loadOngoingChecklist.audit_id + " Approved Successfully","Success");
                  this._router.navigateByUrl('Mytasks')
                  console.log(this.saveAuditbyMDU);
                }
              })
            } else if(result == 'no') {
              console.log('no');
            }
          }
        }
      })
    }
  }

  ApproveOngoing() {
    jQuery("#Approvepopup").modal();
    this.loadOngoingList.comments="";
    this.loadOngoingChecklist.comments="";
  }

  RejectOngoing() {
    jQuery("#Rejectpopup").modal();
    this.loadOngoingList.comments="";
    this.loadOngoingChecklist.comments="";
  }

  CloseApprovePopup() {
    jQuery("#Approvepopup").modal('hide');
  }

  CloseRejectPopup() {
    jQuery("#Rejectpopup").modal('hide');
  }

  ApproveRejectPopup(event: any) {
    if(this.audit_Type == 'AUDIT') {
      this.saveAuditbyMDU.audit_id = this.loadOngoingList.p_audit_id;
      this.saveAuditbyMDU.control_id = this.loadOngoingList.control_id;
      this.saveAuditbyMDU.user_id = this.loadOngoingList.user_id;
      this.saveAuditbyMDU.audit_type = this.audit_Type;
      this.saveAuditbyMDU.comments = this.loadOngoingList.comments;
      this.saveAuditbyMDU.p_target_achieved = this.loadOngoingList.target_achieved;
      this.saveAuditbyMDU.evidence = this.loadOngoingList.evidence;
      if(event.target.name == 'btnApprove') {
        this.saveAuditbyMDU.action = 'APPROVE';
      } else if(event.target.name == 'btnReject') {
        this.saveAuditbyMDU.action = 'REJECT';
      }
      this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
        this.EmailDetails.p_audit_id = this.saveAuditbyMDU.audit_id;
        this.EmailDetails.p_control_ids = this.saveAuditbyMDU.control_id;
        if(data == 'success') {
          //this._router.navigateByUrl('Mytasks')
          if(event.target.name == 'btnApprove') {           
           // Email sent to MDU when APOC approves the audit /TaskCompletion/MDURCMMail
           /* removed usecase
           if(this.newOngoingList[0].pending_with == 'APOC'){            
            this._manageTaskServiceClient.sendApproveMail(this.EmailDetails).subscribe((emaildata: any) => {                          
              console.log('/TaskCompletion/MDURCMMail emailsuccess')
             })   
            
           }
            */
            jQuery("#Approvepopup").modal('hide');
            console.log(this.saveAuditbyMDU);
            this.toastr.success("Ongoing Audit Approved Successfully","Success");
            this._router.navigateByUrl('Mytasks')
          } else if(event.target.name == 'btnReject') {            
            // send mail to RPOC  if MDU or APOC rejects the mail /TaskCompletion/RejectionMail
            this._manageTaskServiceClient.sendRejectMail(this.EmailDetails).subscribe((emaildata: any) => {                          
              console.log('emailsuccess')
             })
            jQuery("#Rejectpopup").modal('hide');
            console.log(this.saveAuditbyMDU);
            this.toastr.success("Ongoing Audit Rejected Successfully","Success");
            this._router.navigateByUrl('Mytasks')
          }
          
        }
      })
    }
    else if(this.audit_Type == 'PREAUDIT') {
      this.saveAuditbyMDU.audit_id = this.loadOngoingChecklist.audit_id;
      this.saveAuditbyMDU.user_id = this.loadOngoingChecklist.user_id;
      this.saveAuditbyMDU.p_audit_checklist_id = this.loadOngoingChecklist.audit_checklist_id;
      this.saveAuditbyMDU.p_preaudit_checklist_id = this.newOngoingChecklist[0].preaudit_checklist_id;
      this.saveAuditbyMDU.audit_type = this.audit_Type;
      this.saveAuditbyMDU.p_target_achieved = this.loadOngoingChecklist.target_achieved;
      this.saveAuditbyMDU.comments = this.loadOngoingChecklist.comments;
      if(event.target.name == 'btnApprove') {
        this.saveAuditbyMDU.action = 'APPROVE';
      } else if(event.target.name == 'btnReject') {
        this.saveAuditbyMDU.action = 'REJECT';
      }      
      this._manageTaskServiceClient.SaveAuditMDU(this.saveAuditbyMDU).subscribe((data: any) => {
        if(data == 'success') {
          if(event.target.name == 'btnApprove') {
            jQuery("#Approvepopup").modal('hide');
            this.toastr.success("Ongoing Checklist Approved Successfully","Success");
            this._router.navigateByUrl('Mytasks')
          } else if(event.target.name == 'btnReject') {     
            this.SavePreAuditbyRPOC.p_audit_id = this.saveAuditbyMDU.audit_id
            this.SavePreAuditbyRPOC.p_audit_checklist_id = this.saveAuditbyMDU.p_audit_checklist_id
            this.SavePreAuditbyRPOC.p_preaudit_checklist_id = this.saveAuditbyMDU.p_preaudit_checklist_id 
            // TaskCompletion/PreAuditRejectionMail use this email service
            this._manageTaskServiceClient.sendPreAuditRejectionmail(this.SavePreAuditbyRPOC).subscribe((emaildata: any) => {                          
              console.log('Update page- preaudit rejection email')
            })
            jQuery("#Rejectpopup").modal('hide');
            this.toastr.success("Ongoing Checklist Rejected Successfully","Success");
            this._router.navigateByUrl('Mytasks')
          }
          console.log(this.saveAuditbyMDU);
        }
      })
    }
  }

  BacktoOngoing() {
    if(this.audit_Type == 'AUDIT') {
      this._router.navigateByUrl("/Mytasks/Ongoingauditlist/" + this.loadOngoingList.p_audit_id + "/" + this.audit_Type);
    } else if(this.audit_Type == 'PREAUDIT'){
      this._router.navigateByUrl("/Mytasks/Ongoingauditlist/" + this.loadOngoingChecklist.audit_id + "/" + this.audit_Type);
    }

  }

  CancelOngoing() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Discard Changes",
        message: "Are you sure you want to Discard your Changes?",
        callback: (result) => {
          if(result == 'yes') {
            if(this.audit_Type == 'AUDIT') {
              this._router.navigateByUrl("/Mytasks/Ongoingauditlist/" + this.loadOngoingList.p_audit_id + "/" + this.audit_Type);
            } else if(this.audit_Type == 'PREAUDIT') {
              this._router.navigateByUrl("/Mytasks/Ongoingauditlist/" + this.loadOngoingChecklist.audit_id + "/" + this.audit_Type);
            }
          } else if(result == 'no') {
            console.log('no');
          }
        }
      }
    })
  }
}
