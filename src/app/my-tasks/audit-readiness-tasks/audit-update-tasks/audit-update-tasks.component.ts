import { Component, Input, OnInit } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { LoadAuditReadiness, SaveAuditbyAPOC, SaveAuditbyRPOC,EmailDetails, SaveAuditReadinessTask,MDUUserlist} from '../../my-tasks';
import { MyTasksService } from '../../my-tasks.service';

declare var jQuery: any;
@Component({
  selector: 'app-audit-update-tasks',
  templateUrl: './audit-update-tasks.component.html',
  styleUrls: ['./audit-update-tasks.component.css']
})
export class AuditUpdateTasksComponent implements OnInit {
  @Input() data;

  public modalRef: BsModalRef;
  public loadauditReadinesslist: LoadAuditReadiness;
  public saveauditTask: SaveAuditReadinessTask;
  public saveAuditbyAPOCData: SaveAuditbyAPOC;  
  public newReadinessList: any[];
  public audit_id: any;

  //public apoc_comments: string;

  public selectedFile1:File;
  public EvidenceFileName:any;

  //public isRpoc: boolean = false;
  public isApoc: boolean = false;
  public isMDU: boolean = false;
  public MDUlist:string="";
  public actionParam:any;
  public isDisabled:boolean=true;
  public isDisabled1: boolean = true;
  public mduuserlist:MDUUserlist[];
  public EmailDetails : EmailDetails;

  public isRpocApocMdu: boolean = false;

  constructor(private _router: Router, private modalService: BsModalService, private _routeParameters: ActivatedRoute,
  private _managetaskServiceClient: MyTasksService, private toastr: ToastrService, private spinnerService: NgxSpinnerService) {
    this.loadauditReadinesslist = new LoadAuditReadiness();
    this.saveauditTask = new SaveAuditReadinessTask();
    this.saveAuditbyAPOCData = new SaveAuditbyAPOC();
    
    this.EmailDetails = new EmailDetails();
    this.loadauditReadinesslist.target_achieved=null;
    this.loadauditReadinesslist.RPOC_comments=null;
  
  }
  ngOnInit() {
    this.selectedFile1 = null;
    this.loadauditReadinesslist.evidence = null;
    this._routeParameters.params.subscribe((data) => {
      this.actionParam = data['action'];
      this.loadauditReadinesslist.audit_id = data['auditID'];
      //Email updation
      //this.loadauditReadinesslist.user_id = data['userid'];
      //sessionStorage.setItem("UserID",data['userid']);
    });
    
    this.loadauditReadinesslist.user_role = sessionStorage.getItem('UserRole');
    this.loadauditReadinesslist.user_id = sessionStorage.getItem('UserID');;
    // this.loadauditReadinesslist.control_id = "1";
    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }
    this.spinnerService.show();
    this._managetaskServiceClient.LoadAuditReadiness(this.loadauditReadinesslist).subscribe((data: any) => {
      console.log(data);
      this.newReadinessList = data.filter(d => d['control_id']==this.actionParam);
      //this.isRpoc = this.newReadinessList[0].user_role == 'RPOC' ? true : false;
      this.isApoc = this.newReadinessList[0].user_role == 'APOC' ? true : false;
      this.isMDU = this.newReadinessList[0].user_role == 'MDU' ? true : false;
      if(this.isMDU==true){
        this._managetaskServiceClient.MDUUserlist().subscribe((data:any[])=>{
        this.mduuserlist=data;
        this.mduuserlist.forEach(element => {
        this.MDUlist+=";"+element.associatedetail;
        });
        this.MDUlist=this.MDUlist.substring(1);
        })
      }
      this.loadauditReadinesslist.target_achieved = this.newReadinessList[0].target_achieved;
      this.loadauditReadinesslist.RPOC_comments =  this.newReadinessList[0].RPOC_comments;
      if(this.loadauditReadinesslist.evidence != null || this.loadauditReadinesslist.evidence != '') {
        this.loadauditReadinesslist.evidence = this.newReadinessList[0].evidence;
      }
      console.log(this.newReadinessList);
      if(this.loadauditReadinesslist.target_achieved=="" && this.loadauditReadinesslist.RPOC_comments==""){
        this.isDisabled=true;
      }
      else{
        this.isDisabled=false;
      }
      if(this.loadauditReadinesslist.RPOC_comments == "" ) {
        this.isDisabled1 = true;
      } else {
        this.isDisabled1 = false;
      }
      this.spinnerService.hide()
    })
   
  }
  targetclick(event):void{
    let reg = /^([0-9]+)*[0-9]+$/;
    console.log(reg.test(this.loadauditReadinesslist.target_achieved));
    if (reg.test(this.loadauditReadinesslist.target_achieved) == true && Number(this.loadauditReadinesslist.target_achieved)<=100)
    {
      if(this.loadauditReadinesslist.target_achieved!="" && this.loadauditReadinesslist.RPOC_comments!=""){
        this.isDisabled=false;
      }
      else{
        this.isDisabled=true;
      }
    }
    else{
      this.isDisabled=true;
    }
   
  }

  rejectclick(value : any): void {
    if(!(value.replace(/\s/g, '').length))
    {
      this.saveauditTask.comments = '';
    }
  }

  onFileSelect1(event) {
    this.selectedFile1 = event.target.files[0];
    console.log(this.selectedFile1)
    this.loadauditReadinesslist.evidence = this.selectedFile1.name;
    // console.log(this.EvidenceFileName);
  }

  SaveUpdateReadiness(event: any) {
    this.saveauditTask.audit_id = this.loadauditReadinesslist.audit_id;
    this.saveauditTask.user_id = this.loadauditReadinesslist.user_id;
    this.saveauditTask.control_id = this.actionParam;
    this.saveauditTask.target_achieved = this.loadauditReadinesslist.target_achieved;
    this.saveauditTask.RPOC_comments = this.loadauditReadinesslist.RPOC_comments;
    this.saveauditTask.evidence = this.loadauditReadinesslist.evidence;
    if(event.target.name == 'btnSave') {
      this.saveauditTask.action = 'SAVE';
    }
      if(this.selectedFile1 == null) {
        this._managetaskServiceClient.SaveSubmitReadiness(this.saveauditTask).subscribe((data: any) => {
          if(data == 'success') {
            this.toastr.success("Audit " + this.loadauditReadinesslist.audit_id + " saved successfully", "success");
            console.log(this.saveauditTask);
          }
        })
      } else {
        let formData = new FormData();
        formData.append('file', this.selectedFile1, this.selectedFile1.name);
        this._managetaskServiceClient.ImportEvidence(formData).subscribe((data: any) => {
        //this.loadauditReadinesslist.evidence = data;
        // console.log(data);
          if(data == "Invalidfiletype") {
            this.toastr.error("File type error, Evidence allows only pdf, jpg & png files should be less than 5MB","error");
          }
          else {
            this.saveauditTask.evidence = data;
            console.log(this.saveauditTask.evidence)
            // this.UpdateReadinessTask(eve.target.name);
          }
        })
        this._managetaskServiceClient.SaveSubmitReadiness(this.saveauditTask).subscribe((data: any) => {
          if(data == 'success') {
            this.toastr.success("Audit " + this.loadauditReadinesslist.audit_id + " saved successfully", "success");
            console.log(this.saveauditTask);
          }
        })
      }
      
    // }
    
  }

  SubmitReadinessTask(event: any) {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Submit Task",
        message: "Are you sure you want to submit your Task?",
        callback: (result) => {
          if(result == 'yes') {
            this.saveauditTask.audit_id = this.loadauditReadinesslist.audit_id;
            this.saveauditTask.user_id = this.loadauditReadinesslist.user_id;
            this.saveauditTask.control_id = this.actionParam;
            this.saveauditTask.target_achieved = this.loadauditReadinesslist.target_achieved;
            this.saveauditTask.RPOC_comments = this.loadauditReadinesslist.RPOC_comments;
            this.saveauditTask.evidence = this.loadauditReadinesslist.evidence;
            if(event.target.name == 'btnSubmit') {
              this.saveauditTask.action = 'SUBMIT';
            }
            this.EmailDetails.p_audit_id = this.saveauditTask.audit_id;
            this.EmailDetails.p_control_ids = this.saveauditTask.control_id;
              if(this.selectedFile1 == null) {
                this._managetaskServiceClient.SaveSubmitReadiness(this.saveauditTask).subscribe((data: any) => {
                  if(data == 'success') {
                     // when RPOC submits, send mail to APOC /TaskCompletion/APOCMail 
                    this._managetaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
                      console.log('emailsuccess')
                     })
                    this.toastr.success("New Audit " + this.loadauditReadinesslist.audit_id + " submitted successfully", "success");
                    this._router.navigateByUrl('Mytasks');
                    console.log(this.saveauditTask);
                  }
                })
              } else {
                let formData = new FormData();
                formData.append('file', this.selectedFile1, this.selectedFile1.name);
                this._managetaskServiceClient.ImportEvidence(formData).subscribe((data: any) => {
                //this.loadauditReadinesslist.evidence = data;
                // console.log(data);
                  if(data == "Invalidfiletype") {
                    this.toastr.error("File type error, Evidence allows only pdf, jpg & png files should be less than 5MB","error");
                  }
                  else {                              
                    this.saveauditTask.evidence = data;
                    console.log(this.saveauditTask.evidence)
                    
                  }
                })
                this._managetaskServiceClient.SaveSubmitReadiness(this.saveauditTask).subscribe((data: any) => {
                  if(data == 'success') {
                      // when RPOC submits, send mail to APOC /TaskCompletion/APOCMail 
                    this._managetaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
                      console.log('emailsuccess')
                     })
                    this.toastr.success("New Audit " + this.loadauditReadinesslist.audit_id + " submitted successfully", "success");
                    this._router.navigateByUrl('Mytasks');
                    console.log(this.saveauditTask);
                  }
                })
              }
            // }
          } else if(result == 'no') {
            console.log('no');
          }
        }
      }
    })
  }
  
  BacktoReadiness() {
    this._router.navigateByUrl('/Mytasks/' + this.loadauditReadinesslist.audit_id);
  }

  CancelReadiness() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Discard Changes",
        message: "Are you sure you want to Discard your Changes?",
        callback: (result) => {
          if(result == 'yes') {
            this._router.navigateByUrl('/Mytasks/' + this.loadauditReadinesslist.audit_id);
          }
        }
      }
    })
  }

  ApproveReadinesstask() {
    jQuery("#Approvepopup").modal();
    this.loadauditReadinesslist.comments="";
  }

  RejectReadinesstask() {
    jQuery("#Rejectpopup").modal();
    this.saveauditTask.comments="";
  }

  CloseApprovePopup() {
    jQuery("#Approvepopup").modal('hide');
   
  }

  CloseRejectPopup() {
    jQuery("#Rejectpopup").modal('hide');
    
  }

  ApproveRejectPopup(action: any) {
    this.saveAuditbyAPOCData.audit_id = this.loadauditReadinesslist.audit_id;
    this.saveAuditbyAPOCData.control_id = this.actionParam;
    this.saveAuditbyAPOCData.user_id = this.loadauditReadinesslist.user_id;
    this.saveAuditbyAPOCData.role = this.loadauditReadinesslist.user_role;
    this.saveAuditbyAPOCData.comments = this.loadauditReadinesslist.comments;
    if(action.target.name == 'btnApprove') {
      this.saveAuditbyAPOCData.action = 'Approve';
    } else if(action.target.name == 'btnReject') {
      this.saveAuditbyAPOCData.action = 'Reject';
      this.saveAuditbyAPOCData.comments = this.saveauditTask.comments;
    }
    this.EmailDetails.p_audit_id = this.saveAuditbyAPOCData.audit_id;
    this.EmailDetails.p_control_ids = this.saveAuditbyAPOCData.control_id;
    this._managetaskServiceClient.ApproveAuditReadiness(this.saveAuditbyAPOCData).subscribe((data: any) => {
      if(data == 'success') {                
        if(action.target.name == 'btnApprove') {
          //send mail to MDU when APOC approves /TaskCompletion/MDURCMMail
          if(this.saveAuditbyAPOCData.role != 'MDU') {
            this._managetaskServiceClient.sendApproveMail(this.EmailDetails).subscribe((emaildata: any) => {                          
              console.log('emailsuccess')
             })  
          }
          
          jQuery("#Approvepopup").modal('hide');
          this._router.navigateByUrl('Mytasks');
          this.toastr.success("Audit readiness tasks has been approved.", "Success", { enableHtml: true });
        } else if(action.target.name == 'btnReject') {
          // when APOC rejects, send mail to RPOC TaskCompletion/RejectionMail
          // if(this.saveAuditbyAPOCData.role != 'MDU') {
            this._managetaskServiceClient.sendRejectMail(this.EmailDetails).subscribe((emaildata: any) => {                          
              console.log('emailsuccess')
             })
          //}
         
          jQuery("#Rejectpopup").modal('hide');
          this._router.navigateByUrl('Mytasks');
          this.toastr.success("Audit readiness tasks has been rejected.", "Success", { enableHtml: true });
          
        }
      }
      else{
        this.toastr.error("Action failed", 'error');
      } 
    })
  }

}
