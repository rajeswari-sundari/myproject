import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreviewAuditDisplay, AuditControl, SaveAuditControl } from '../manageAuditsClasses'
import { Router, ActivatedRoute } from '@angular/router';
import { KeyValuePairDTO } from '../../Common/KeyValuePairDTO';
import { ManageAuditService } from '../manage-audits.service';
import { ToastrService } from 'ngx-toastr';
//import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
@Component({
  selector: 'app-preview-publish',
  templateUrl: './preview-publish.component.html',
  styleUrls: ['./preview-publish.component.css']
})
export class PreviewPublishComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();

  public modalRef: BsModalRef;

  public columnDefs: any[];
  public rowData: any[];
  public defaultColDef;
  public params_audit_id;
  public noRowsTemplate;
  public loadingTemplate;

  public previewAuditDisplayData: PreviewAuditDisplay;
  public getAuditControlData: AuditControl;
  public saveAuditControlData: SaveAuditControl;

  public auditsRow: any[];

  constructor(private _routeParameters: ActivatedRoute, private _manageAuditsServiceClient: ManageAuditService,
    public toastr: ToastrService, private _router: Router, private modalService: BsModalService,
    private spinnerService: NgxSpinnerService) {
    this.previewAuditDisplayData = new PreviewAuditDisplay();
    this.getAuditControlData = new AuditControl();
    this.saveAuditControlData = new SaveAuditControl();

    this.loadingTemplate =
    `<span class="ag-overlay-loading-center">controls are Loading....</span>`;
  this.noRowsTemplate =
    `<span class="ag-overlay-loading-center">No categories & controls added.</span>`;

  }
// private _matDialog: MatDialog, 
  ngOnInit() {
    this.PreviewAudit();
    this.columnDefs = [

      { headerName: 'Control ID', field: 'control_id', filter: false, sortable: false, minWidth: 150 },
      { headerName: 'Control ', field: 'control_name', filter: false, sortable: false, minWidth: 300 },
      { headerName: 'Account Point of Contact', field: 'Account_point_of_contact', filter: false, sortable: false, editable: false, minWidth: 350, },
      { headerName: 'Responsible Point of Contact', field: 'Responsible_point_of_contact', filter: false, sortable: false, minWidth: 400 }
    ]
    this.defaultColDef = {
      flex: 1,      
      resizable: true, 
    };
  }
  PreviewAudit() {
    // Get audit id from route params and pass it here
    this.spinnerService.show()
    this._routeParameters.params.subscribe((data) => {
      this.params_audit_id = data['auditID'];
    });
    this.getAuditControlData.p_audit_id = this.params_audit_id;

    this._manageAuditsServiceClient.getPreviewAudits(this.getAuditControlData).subscribe((data: PreviewAuditDisplay[]) => {
      this.rowData = data;
      this.spinnerService.hide()
    })
    
  }

  GoBacktoEmail(): void {
    this.tabactive.emit(3);
  }

  PublishAudit() {
    this._manageAuditsServiceClient.getEmailReminderDetails(this.params_audit_id).subscribe((data: any) => {  
      if ((data.email_reminder_timezone != null) && (data.email_reminder_time != null) && 
        (data.email_reminder_until != null) && (data.email_reminder_days != null)) {
          if(this.rowData!=null  &&  this.rowData.length!=0){
            for(let x of this.rowData){
              if(x.Account_point_of_contact ==null  || x.Account_point_of_contact == "" || 
                x.Responsible_point_of_contact ==null || x.Responsible_point_of_contact =="") { 
                  this.toastr.error("Please enter Manage point of contact before publishing Audit", 'error');
                  return;
                } 
            }
            this.modalRef = this.modalService.show(ConfirmDialogComponent, {
              initialState: {
                title: "Publish audit",
                message: "Are you sure you want to publish the audit?",
                callback: (result) => {
                  if(result == 'yes') {
                    this.saveAuditControlData.p_audit_id = this.params_audit_id;                    
                    this.saveAuditControlData.p_user_id = sessionStorage.getItem('UserID'); //794023
                    this._manageAuditsServiceClient.publishPreviewAudits(this.saveAuditControlData).subscribe((data: any) => {
                      if (data == 'success') {          
                        // service name - PublishEmail/EmailDeliveryDetails                                    
                        this._manageAuditsServiceClient.sendPublishmail(this.saveAuditControlData.p_audit_id).subscribe((emaildata: any) => {                          
                          if (emaildata == 'success') {
                           console.log('email success');
                          }else{
                          //  this.toastr.error("Email Notification Failed", 'error');
                          }
                        })
                        this._manageAuditsServiceClient.removePreviewData();                        
                        this.toastr.success("Audit " + this.saveAuditControlData.p_audit_id  +  " created & published successfully.", 'Success', { enableHtml: true });
                        this._router.navigateByUrl('/Manageaudits');
                      } else {
                        this.toastr.error("Audit Publish failed", 'error');
                      }
                    });
                  } else {
                   return;
                  }
                }
              }
            });
          } else {
            this.toastr.error("Data Should not be empty", 'error');
          }
        } else {
          this.toastr.error("Please enter email reminder settings before publishing Audit", 'error');
        }
    })
}
}
