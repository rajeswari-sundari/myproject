import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CustomCheckboxComponent } from 'src/app/Custom/custom-checkbox/custom-checkbox.component';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { ManageAudits, ManageAuditsSearch, AuditControl } from 'src/app/manage-audits/manageAuditsClasses';
import { CustomAGGridLinkButtonComponent } from '../../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { ManageAuditService } from 'src/app/manage-audits/manage-audits.service';
import { environment } from '../../../environments/environment';

import { LoadAuditReadiness, SaveAuditbyAPOC, SaveAuditbyRPOC,EmailDetails } from '../my-tasks';
import { MyTasksService } from '../my-tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
@Component({
  selector: 'app-audit-readiness-tasks',
  templateUrl: './audit-readiness-tasks.component.html',
  styleUrls: ['./audit-readiness-tasks.component.css']
})
export class AuditReadinessTasksComponent implements OnInit {

  public editAuditReadinessRow: any[];
  public editAuditReadinessColumn: any[];
  public defaultEditAuditReadinessColDef;
  public editreadinessloadingTemplate;
  public noEditReadinessRowsTemplate;
  public rowSelection;

  public ManageAuditsClass: ManageAudits;
  public manageAuditsSearchData: ManageAuditsSearch;
  public getAuditControlData: AuditControl;
  public newauditdata;
  public audit_id;
  public p_audit_id;
  public target;
  public isRPOC;
  public isAPOC;
  public gridOptions;
  public GridArray;
  public loadauditReadinessData: LoadAuditReadiness;
  public SaveAuditbyAPOCData: SaveAuditbyAPOC;
  public SaveAuditbyRPOCData: SaveAuditbyRPOC;
  public EmailDetails : EmailDetails;
  public modalRef: BsModalRef;
  public onlyRPOC;
  public notRPOC;
  public flagvalidate;
  public isRpocApocMdu: boolean = false;
  
  constructor(private _router: Router, private _routeParameters: ActivatedRoute, private modalService: BsModalService, private _ManageAuditServiceClient: ManageAuditService, private _matDialog: MatDialog, private toastr: ToastrService, 
    private http: HttpClient, private _managetaskServiceClient: MyTasksService, private spinnerService: NgxSpinnerService) {
    this.ManageAuditsClass = new ManageAudits();
    this.manageAuditsSearchData = new ManageAuditsSearch();
    this.getAuditControlData = new AuditControl();
    this.gridOptions = <GridOptions>{}
    this.loadauditReadinessData = new LoadAuditReadiness();
    this.SaveAuditbyRPOCData = new SaveAuditbyRPOC();
    this.SaveAuditbyAPOCData = new SaveAuditbyAPOC();
    this.EmailDetails = new EmailDetails();
  }

  ngOnInit() {

    this._routeParameters.params.subscribe((data) => {
      this.loadauditReadinessData.audit_id = data['auditID'];
    });
    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }
this.loadauditReadinessData.user_id = sessionStorage.getItem('UserID'); //762252
this.spinnerService.show();
this._managetaskServiceClient.LoadAuditReadiness(this.loadauditReadinessData).subscribe((data: any) => {
  this.editAuditReadinessRow = data;  
  this.spinnerService.hide()
  console.log(data);
  this.onlyRPOC = data.filter(d => d['user_role'] == 'RPOC');  
  if(this.onlyRPOC.length == data.length) {
    console.log ('onlyRPOC'); // all records are rpoc ..enable submit button and hide other buttons
    this.isRPOC = true;
  }else{
    this.isAPOC = true;
  }

    })

    setTimeout(() => {
      if (this.isRPOC == true) {
        this.editAuditReadinessColumn = [
          { headerName: '', field: '', headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true },
          { headerName: 'Parent category', field: 'parent_category_name' },
          { headerName: 'Category', field: 'category_name' },
          { headerName: 'Component', field: 'control_name' },
          { headerName: 'Target achieved', field: 'target_achieved' },
          { headerName: 'Comments', field: 'comments' },
          {
            headerName: 'Evidence', field: 'evidence', editable: false, filter: false, sortable: false,
            cellRendererFramework: CustomAGGridLinkButtonComponent,
            cellRendererParams: {
              linkID: 'OpenPDF'
            }

          },
          { headerName: 'Updated by', field: 'task_status_updated_by' },
          {
            headerName: 'Action', field: '', editable: false, filter: false, sortable: false,
            cellRendererFramework: CustomAGGridLinkButtonComponent,
            cellRendererParams: {
              linkID: 'audit_readiness_control'
            }
          }
        ]
      }
      else {
        this.editAuditReadinessColumn = [
          // { headerName: '', field:'',  checkboxSelection: true},
          {
            headerName: '', field: '', checkboxSelection: function (params) {
              if ((params.data.user_role == 'APOC') || (params.data.user_role == 'MDU')) {
                return true
              } else {
                return false
              }
            },
            headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
          },
          { headerName: 'Parent category', field: 'parent_category_name' },
          { headerName: 'Category', field: 'category_name' },
          { headerName: 'Component', field: 'control_name' },
          { headerName: 'Target achieved', field: 'target_achieved' },
          { headerName: 'Comments', field: 'comments' },
          {
            headerName: 'Evidence', field: 'evidence', editable: false, filter: false, sortable: false,
            cellRendererFramework: CustomAGGridLinkButtonComponent,
            cellRendererParams: {
              linkID: 'OpenPDF'
              
            }

          },

          { headerName: 'Updated by', field: 'task_status_updated_by' },
          {
            headerName: 'Action', field: '', editable: false, filter: false, sortable: false,
            cellRendererFramework: CustomAGGridLinkButtonComponent,
            cellRendererParams: {
              linkID: 'audit_readiness_control'
            }
          }
        ]
      }

    }, 2500);



    this.editreadinessloadingTemplate =
      `<span class="ag-overlay-loading-center">No Audit readiness tasks are added.</span>`;

    this.noEditReadinessRowsTemplate =
      `<span class="ag-overlay-loading-center">No Audit readiness tasks are added.</span>`;

    this.defaultEditAuditReadinessColDef = {
      editable: false, sortable: false, resizable: true, flex: 1
    }

    this.rowSelection = "multiple";
  }
  private downloadFile(url: string): any {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }
  SubmitReadinessTask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if (this.GridArray.length != 0) {
      for (let x of this.GridArray) {
        if (x.RPOC_comments == "" || (x.target_achieved == '')) {
          this.flagvalidate = true;
        }
      }
      if (this.flagvalidate == true) {
        this.toastr.error("Target Achieved and Comments should not be empty  ", 'error');
      } else {
        this.modalRef = this.modalService.show(ConfirmDialogComponent, {
          initialState: {
            title: "Submit task completion",
            message: "Are you sure you want to submit your completed task?",
            callback: (result) => {
              if (result == 'yes') {
                this._routeParameters.params.subscribe((data) => {
                  this.SaveAuditbyRPOCData.audit_id = data['auditID'];
                });
                this.SaveAuditbyRPOCData.user_id = sessionStorage.getItem('UserID'); //762252

                var weekdayVal = '';
                if (this.GridArray.length > 1) {
                  for (let x of this.GridArray) {
                    var newval = x.control_id;
                    if (weekdayVal == '') {
                      weekdayVal = newval;
                    } else {
                      weekdayVal = weekdayVal + "," + newval;

                    }
                  }
                  this.SaveAuditbyRPOCData.control_id = weekdayVal;
                } else if (this.GridArray.length == 1) {
                  this.SaveAuditbyRPOCData.control_id = this.GridArray[0].control_id;
                }
                this._managetaskServiceClient.SubmitAuditbyRPOC(this.SaveAuditbyRPOCData).subscribe((data: any) => {
                  if (data == 'success') {
                    this.EmailDetails.p_audit_id = this.SaveAuditbyRPOCData.audit_id;
                    this.EmailDetails.p_control_ids = this.SaveAuditbyRPOCData.control_id;
                    this._managetaskServiceClient.sendmailtoAPOC(this.EmailDetails).subscribe((emaildata: any) => {                          
                     console.log('emailsuccess')
                    })
                    this._router.navigateByUrl('/Mytasks');
                    this.toastr.success("Audit readiness tasks has been submitted.", "Success", { enableHtml: true });
                  } else {
                    this.toastr.error("Action Failed", 'error');
                  }
                });

              } else {
                console.log('no');
              }
            }
          }
        })
      }

    } else {
      this.toastr.error("Please select atleast one Component  ", 'error');
    }

  }

  ApproveReadinesstask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if (this.GridArray.length != 0) {
      jQuery("#Approvepopup").modal();
      this.SaveAuditbyAPOCData.comments = "";
    } else {
      this.toastr.error("Please select atleast one Component  ", 'error');
    }
  }
  RejectReadinesstask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if (this.GridArray.length != 0) {
      jQuery("#Rejectpopup").modal();
      this.SaveAuditbyAPOCData.comments = "";
    } else {
      this.toastr.error("Please select atleast one Component  ", 'error');
    }
  }
  CloseApprovePopup() {
    jQuery("#Approvepopup").modal('hide');
  }

  CloseRejectPopup() {
    jQuery("#Rejectpopup").modal('hide');
  }

  commentsclick(value) {
    if (!(value.replace(/\s/g, '').length)) {
      this.SaveAuditbyAPOCData.comments = '';
    }
  }
  ApproveRejectPopup(eve: any) {    
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if (this.GridArray.length != 0) {
      var weekdayVal = '';
      if (this.GridArray.length > 1) {
        for (let x of this.GridArray) {
          var newval = x.control_id;
          var user_role = x.user_role;
          if (weekdayVal == '') {
            weekdayVal = newval;
          } else {
            weekdayVal = weekdayVal + "," + newval; // to store in this format in DB

          }
        }
        this.SaveAuditbyAPOCData.control_id = weekdayVal;
        this.SaveAuditbyAPOCData.role = user_role;
      } else if (this.GridArray.length == 1) {
        this.SaveAuditbyAPOCData.control_id = this.GridArray[0].control_id;
        this.SaveAuditbyAPOCData.role = this.GridArray[0].user_role;
      }
      if (eve.target.name == 'btnApprove') {
        this.SaveAuditbyAPOCData.action = 'Approve';
      } else if (eve.target.name == 'btnReject') {
        this.SaveAuditbyAPOCData.action = 'Reject';
      }      
      this._routeParameters.params.subscribe((data) => {
        this.SaveAuditbyAPOCData.audit_id = data['auditID'];
      });
      this.SaveAuditbyAPOCData.user_id = sessionStorage.getItem('UserID'); //762252               
      this._managetaskServiceClient.ApproveAuditReadiness(this.SaveAuditbyAPOCData).subscribe((data: any) => {
        if (data == "success") {

          this.gridOptions.api.refreshCells();
          this.EmailDetails.p_audit_id = this.SaveAuditbyAPOCData.audit_id;
          this.EmailDetails.p_control_ids = this.SaveAuditbyAPOCData.control_id;
          if (eve.target.name == 'btnApprove')  {
            // send mail  MDURCMMail   
            if(this.SaveAuditbyAPOCData.role != 'MDU') {
              this._managetaskServiceClient.sendApproveMail(this.EmailDetails).subscribe((emaildata: any) => {                          
                console.log('emailsuccess')
               }) 
            }              
            jQuery("#Approvepopup").modal('hide');            
            this.toastr.success("Audit readiness tasks has been approved.", "Success", { enableHtml: true });
            this._router.navigateByUrl('Mytasks');
          } else if (eve.target.name == 'btnReject') {            
            // send rejectionmail RejectionMail    
            //if(this.SaveAuditbyAPOCData.role != 'MDU') {
              this._managetaskServiceClient.sendRejectMail(this.EmailDetails).subscribe((emaildata: any) => {                          
                console.log('emailsuccess')
               })
            //}                 
            jQuery("#Rejectpopup").modal('hide');
            this.toastr.success("Audit readiness tasks has been rejected.", "Success", { enableHtml: true });
            this._router.navigateByUrl('Mytasks');
          }

        } else {
          this.toastr.error("Action failed", 'error');
        }
      })
    }
    else {
      this.toastr.error("Please select atleast one Component  ", 'error');
    }

  }



  ClearSelections() {
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.refreshCells();
  }


}
