import { Component, OnInit } from '@angular/core';
import { OngoingAuditDetails,OngoingPreAuditChecklistDetails,EmailDetails } from '../my-tasks';
import { PreAuditRequest } from '../../manage-audits/manageAuditsClasses';

import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CustomAGGridLinkButtonComponent } from '../../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { CustomAggridLinkButtonMyTasksComponent } from '../../Custom/custom-aggrid-link-button-my-tasks/custom-aggrid-link-button-my-tasks.component';
import { ManageAuditService } from '../../manage-audits/manage-audits.service';
import { MyTasksService } from '../my-tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jQuery: any;
@Component({
  selector: 'app-ongoing-audits-tasks',
  templateUrl: './ongoing-audits-tasks.component.html',
  styleUrls: ['./ongoing-audits-tasks.component.css']
})
export class OngoingAuditsTasksComponent implements OnInit {

  public ongoingAuditsRow: any[];
  public ongoingAuditsColumn: any[];
  public defaultOngoingAuditsColDef;
  public ongoingauditsloadingTemplate;
  public noOngoingAuditsRowsTemplate;
  public OngoingAuditDetailsData: OngoingAuditDetails;
  public OngoingPreAuditChecklistDetailsData: OngoingPreAuditChecklistDetails;
  public gridOptions;
  public EmailDetails : EmailDetails;
  public PreAuditRequest : PreAuditRequest ;
  public p_audit_id: string;
  public audit_type: string;
  public isRpocApocMdu: boolean = false;

  constructor(private _router: Router, private _routeParameters: ActivatedRoute,private toastr: ToastrService,private _manageAuditsServiceClient: ManageAuditService, 
    private _managetaskServiceClient: MyTasksService, private spinnerService: NgxSpinnerService) { 
    this.OngoingAuditDetailsData = new OngoingAuditDetails();
    this.OngoingPreAuditChecklistDetailsData = new OngoingPreAuditChecklistDetails();
    this.EmailDetails = new EmailDetails();
    this.PreAuditRequest = new PreAuditRequest();
    this.gridOptions = <GridOptions>{}

  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      this.audit_type = data['audittype'];
      if(this.audit_type == 'PREAUDIT'){
        this.OngoingPreAuditChecklistDetailsData.audit_id = data['auditID'];
      }
      if(this.audit_type == 'AUDIT'){
        this.OngoingAuditDetailsData.p_audit_id = data['auditID'];
      }              
   });

   if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
    this.isRpocApocMdu = true;
  } else if(sessionStorage.getItem('UserRole')=='MDU') {
    this.isRpocApocMdu = true;
  } else {
    this.isRpocApocMdu = false;
  }
  
   if(this.audit_type == 'PREAUDIT'){

    this.OngoingPreAuditChecklistDetailsData.user_id = sessionStorage.getItem('UserID'); //762252
    this.spinnerService.show();
    this._managetaskServiceClient.ListOngoingPreAuditChecklist(this.OngoingPreAuditChecklistDetailsData).subscribe((data: any) => {
          this.ongoingAuditsRow = data;  
          this.spinnerService.hide();
          // console.log(this.ongoingAuditsRow)         
        });
        
    this.ongoingAuditsColumn = [
      { headerName: 'Category', field: 'audit_category_name' },
      { headerName: 'Checklist', field: 'audit_checklist' },      
      { headerName: 'Target Achieved', field: 'target_achieved' },    
      { headerName: 'Point of contact', field: 'point_of_contact' },
      { headerName: 'Pending with', field: 'pending_with' },
      { headerName: 'Task status' , field: 'task_status'},
      { headerName: 'Action' ,minWidth: 500 , 
      cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
      cellRendererParams: {
       linkID : 'ongoing_preaudit_action',
       onClick: this.sendremindermail.bind(this),
     },
   }
    ]

   }else{
     this.spinnerService.show();
    this._managetaskServiceClient.ListOngoingAudits(this.OngoingAuditDetailsData).subscribe((data: any) => {
      this.ongoingAuditsRow = data;
      this.spinnerService.hide();           
    });
    this.ongoingAuditsColumn = [
      { headerName: 'Control ID', field: 'control_id' },
      { headerName: 'Control', field: 'control_name' },
      { headerName: 'Account Point of contact', field: 'account_point_of_contact' },
      { headerName: 'Responsible point of contact', field: 'responsible_point_of_contact' },
      { headerName: 'Pending with', field: 'pending_with' },
      { headerName: 'Task status' , field: 'task_status'},
      { headerName: 'Action' ,minWidth: 300 , 
      cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
      cellRendererParams: {
       linkID : 'ongoing_audit_action',
       onClick: this.sendremindermail.bind(this),
     },
   },
    ]

   }

   // this.OngoingAuditDetailsData.p_audit_id = '1';
  
    this.ongoingauditsloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Ongoing audit tasks are added.</span>`;

    this.noOngoingAuditsRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Ongoing audit tasks are added.</span>`;   

    this.defaultOngoingAuditsColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }
  }

  // ViewContactDetails() {
  //   jQuery("#ViewContactpopup").modal();
  // }

  // CloseContactPopup() {
  //   jQuery("#ViewContactpopup").modal('hide');
  // }

  sendremindermail(e : any) {
    console.log(e);
    this.EmailDetails.p_audit_id = e.rowData.audit_id;
    this.EmailDetails.p_control_ids = e.rowData.control_id;    

    this.PreAuditRequest.p_preaudit_checklist_id = e.rowData.preaudit_checklist_id;
    this.PreAuditRequest.p_audit_id = e.rowData.audit_id;
    this.PreAuditRequest.p_audit_checklist_id = e.rowData.audit_checklist_id;
    
    if(e.rowData.pending_with == 'RPOC'){
      if(this.audit_type == 'AUDIT'){
            // send mail to RPOC - service name - PublishEmail/EmailDeliveryDetails    
            this._manageAuditsServiceClient.sendRPOCmail(this.EmailDetails.p_audit_id,this.EmailDetails.p_control_ids).subscribe((emaildata: any) => {                          
              console.log('PublishEmail/EmailDeliveryDetails emailsuccess')
            })
        }else if (this.audit_type == 'PREAUDIT'){
          // send mail to RPOC - service name - PublishEmail/EmailPreAuditCheckListDeliveryDetails             
            this._manageAuditsServiceClient.sendReminderOngoingPreaudit(this.PreAuditRequest).subscribe((emaildata: any) => {                          
            console.log('PublishEmail/EmailPreAuditCheckListDeliveryDetails emailsuccess')
          })
      }    
    }else if(e.rowData.pending_with == 'APOC'){
       //send email to APOC - service name TaskCompletion/APOCMail      
       this._managetaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
        console.log(' TaskCompletion/APOCMail  emailsuccess')      
       })
    }

    
    this.toastr.success("Reminder Mail sent successfully", "Success", { enableHtml: true });
    console.log('mail');
  }
}
