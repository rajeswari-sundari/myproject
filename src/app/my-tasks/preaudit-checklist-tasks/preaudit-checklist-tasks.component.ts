import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CustomCheckboxComponent } from 'src/app/Custom/custom-checkbox/custom-checkbox.component';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { CustomAGGridLinkButtonComponent } from '../../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { LoadPreAuditChecklistTasks, SavePreAuditbyRPOC } from '../my-tasks';
import { MyTasksService } from '../my-tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';


declare var jQuery: any;
@Component({
  selector: 'app-preaudit-checklist-tasks',
  templateUrl: './preaudit-checklist-tasks.component.html',
  styleUrls: ['./preaudit-checklist-tasks.component.css']
})

export class PreauditChecklistTasksComponent implements OnInit {

  public PreAuditTasksRow: any[];
  public PreAuditTasksColumn: any[];
  public defaultPreAuditTasksColDef;
  public preaudittasksloadingTemplate;
  public noPreAuditTasksRowsTemplate;

  public loadpreauditchecklistTasksData: LoadPreAuditChecklistTasks;
  public SavePreAuditbyRPOCData : SavePreAuditbyRPOC;
  
  public gridOptions;
  public rowSelection;
  public onlyRPOC;
  public isAPOC;
  public isRPOC;
  public GridArray;
  public modalRef;
  public isAdmin;
  public flagvalidate;

  public isRpocApocMdu: boolean = false;

  constructor(private _router: Router, private _routeParameters: ActivatedRoute,  private modalService: BsModalService, private _matDialog: MatDialog, 
    private toastr: ToastrService,private _managetaskServiceClient: MyTasksService, private spinnerService: NgxSpinnerService) { 
    this.loadpreauditchecklistTasksData = new LoadPreAuditChecklistTasks();
    this.gridOptions = <GridOptions>{}
    this.SavePreAuditbyRPOCData = new SavePreAuditbyRPOC();

  }

  ngOnInit() {
      this._routeParameters.params.subscribe((data) => {
        this.loadpreauditchecklistTasksData.audit_id = data['auditID'];
     });
     if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }
     this.loadpreauditchecklistTasksData.user_id = sessionStorage.getItem('UserID'); //762252 
    // this._managetaskServiceClient.LoadPreAuditReadiness(this.loadpreauditchecklistTasksData).subscribe((data: any) => { // replace below with this
      this.spinnerService.show()
      this._managetaskServiceClient.LoadPreAuditReadiness(this.loadpreauditchecklistTasksData).subscribe((data: any) => {
        this.PreAuditTasksRow = data;      
        for (let x of this.PreAuditTasksRow) {
          if (x.user_role == 'POC'){   
            this.isRPOC = true
          }else{
            this.isAdmin = true
          }
        }   
        this.spinnerService.hide();
      })
   
    this.PreAuditTasksColumn = [
      { headerName: '', field:'',   checkboxSelection: true,  
             headerCheckboxSelection : true,  headerCheckboxSelectionFilteredOnly :true
        },
        { headerName: 'Category', field: 'audit_category_name' },
        { headerName: 'Checklist', field: 'audit_checklist' },        
        { headerName: 'Target achieved', field: 'target_achieved'  },
        // { headerName: 'Comments', field: 'comments'  },             
        { headerName: 'Action', field: '', editable: false,  filter:false, sortable :false,
        cellRendererFramework : CustomAGGridLinkButtonComponent,
          cellRendererParams: {
            linkID : 'preaudit_readiness_checklist'
        }}
    ]
    this.preaudittasksloadingTemplate =
    `<span class="ag-overlay-loading-center">No Pre-audit checklist tasks are added.</span>`;

    this.noPreAuditTasksRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Pre-audit checklist tasks are added.</span>`;

    this.defaultPreAuditTasksColDef = {
      editable: false, sortable: false, resizable: true, flex: 1
    }
    this.rowSelection = "multiple";
  }

  SubmitPreAuditTask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if(this.GridArray.length !=0){
      for (let x of this.GridArray){
        if(x.target_achieved == ''){
            this.flagvalidate = true;
        }        
      }
     if(this.flagvalidate == true){
      this.toastr.error("Target Achieved should not be empty  ", 'error');
     }else{
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Submit task completion",
          message: "Are you sure you want to submit your completed task?",
          callback: (result) => {
            if(result == 'yes') {
                          
            var weekdayVal = '';
            if(this.GridArray.length > 1){
              for (let x of this.GridArray) {
                var newval = x.audit_checklist_id;        
                if (weekdayVal == '') {
                  weekdayVal = newval;
                } else {
                  weekdayVal = weekdayVal + "," + newval; // to store in this format in DB
                }                     
              } 
              this.SavePreAuditbyRPOCData.p_audit_checklist_id = weekdayVal;   
            }else if(this.GridArray.length == 1){
              this.SavePreAuditbyRPOCData.p_audit_checklist_id = this.GridArray[0].audit_checklist_id;
              this.SavePreAuditbyRPOCData.p_target_achieved=this.GridArray[0].target_achieved;
            }
            this.SavePreAuditbyRPOCData.p_action = 'SUBMIT';                     
            // this.SavePreAuditbyRPOCData.p_audit_id = '1' ; 
            this._routeParameters.params.subscribe((data) => {
              this.SavePreAuditbyRPOCData.p_audit_id = data['auditID'];
           });
            this.SavePreAuditbyRPOCData.p_preaudit_checklist_id = this.GridArray[0].preaudit_checklist_id;             
            this.SavePreAuditbyRPOCData.p_user_id = sessionStorage.getItem('UserID'); //762252 
            this.SavePreAuditbyRPOCData.p_role = 'POC';       
              this._managetaskServiceClient.SubmitPreAuditbyRPOC(this.SavePreAuditbyRPOCData).subscribe((data: any) => {
                if (data == 'success') {             
               // giri testing - get the POC and check this
                  // send email service once RPOC submits checklist // TaskCompletion/PreAuditMDURCMMail   
                  this._managetaskServiceClient.sendPreAuditRPOCSubmitmail(this.SavePreAuditbyRPOCData).subscribe((emaildata: any) => {                          
                    console.log('preaudit checklist submit email by RPOC')
                  })
                  this._router.navigateByUrl('/Mytasks');
                  this.toastr.success("Pre Audit Checklist  tasks has been submitted.", "Success", { enableHtml: true });
                } else {
                  this.toastr.error("Action Failed", 'error');
                }
              });
              
            }else {
              console.log('no');
            }
          }
        }
      })
     }


    }else{
      this.toastr.error("Please select atleast one Checklist  ", 'error');
    }


    
  }

  ApprovePreAuditTask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if(this.GridArray.length !=0){
      this.flagvalidate = false;
              for (let x of this.GridArray){
                if(x.target_achieved == ''){
                    this.flagvalidate = true;
                }        
              }
            if(this.flagvalidate == true){
              this.gridOptions.api.refreshCells();
              this.flagvalidate = false;
              this.toastr.error("Target Achieved should not be empty  ", 'error');
            }else{   
                  jQuery("#Approvepopup1").modal();
                  this.SavePreAuditbyRPOCData.p_comments="";
            }   
    }else{
      this.toastr.error("Please select atleast one checklist  ", 'error');
    }
    
  }
  RejectPreAuditTask() {
    this.GridArray = this.gridOptions.api.getSelectedRows();
     if(this.GridArray.length !=0){
      this.flagvalidate = false;
      for (let x of this.GridArray){
        if(x.target_achieved == ''){
            this.flagvalidate = true;
        }        
      }
      if(this.flagvalidate == true){
        this.gridOptions.api.refreshCells();
        
        this.toastr.error("Target Achieved should not be empty  ", 'error');
      }else{   
        jQuery("#Rejectpopup1").modal();
        this.SavePreAuditbyRPOCData.p_comments="";
      }  
     
      }else{
        this.toastr.error("Please select atleast one checklist  ", 'error');
      }
  }

  SuccessChecklistPopup(eve: any) {
    this.GridArray = this.gridOptions.api.getSelectedRows();
    if(this.GridArray.length !=0){
      var weekdayVal = '';
      if(this.GridArray.length > 1){
        for (let x of this.GridArray) {
          var newval = x.audit_checklist_id;        
          if (weekdayVal == '') {
            weekdayVal = newval;
          } else {
            weekdayVal = weekdayVal + "," + newval; // to store in this format in DB
  
          }                     
        } 
        this.SavePreAuditbyRPOCData.p_audit_checklist_id = weekdayVal;   
      }else if(this.GridArray.length == 1){
         this.SavePreAuditbyRPOCData.p_audit_checklist_id = this.GridArray[0].audit_checklist_id;
      }
      if(eve.target.name == 'btnApprove') {
        this.SavePreAuditbyRPOCData.p_action = 'Approve';
      } else if(eve.target.name == 'btnReject') {
        this.SavePreAuditbyRPOCData.p_action = 'Reject';
      }
       // this.SavePreAuditbyRPOCData.p_audit_id = '111' ;
      this._routeParameters.params.subscribe((data) => {
        this.SavePreAuditbyRPOCData.p_audit_id = data['auditID'];
     });
      
      this.SavePreAuditbyRPOCData.p_user_id = sessionStorage.getItem('UserID'); //762252 
      this.SavePreAuditbyRPOCData.p_role = 'MDU';      
      this.SavePreAuditbyRPOCData.p_preaudit_checklist_id = this.GridArray[0].preaudit_checklist_id;
      //  this.SavePreAuditbyRPOCData.p_comments = 'test commments';      

      
      this._managetaskServiceClient.SubmitPreAuditbyRPOC(this.SavePreAuditbyRPOCData).subscribe((data: any) => {
        if(data == "success") {           
          
          // jQuery("#Rejectpopup1").modal('hide');
          this.gridOptions.api.refreshCells();
          this._router.navigateByUrl('/Mytasks');
          if(eve.target.name == 'btnApprove') {
            //MDU case.  no need of email service for success
            jQuery("#Approvepopup1").modal('hide');
            this._router.navigateByUrl('/Mytasks');
            this.toastr.success("Pre Audit checklist tasks has been approved.", "Success", { enableHtml: true });
          } else if(eve.target.name == 'btnReject') {
            // MDU case. send reject email. need email service // TaskCompletion/PreAuditRejectionMail
            this._managetaskServiceClient.sendPreAuditRejectionmail(this.SavePreAuditbyRPOCData).subscribe((emaildata: any) => {                          
              console.log('preaudit rejection email')
            })
            jQuery("#Rejectpopup1").modal('hide');
            this._router.navigateByUrl('/Mytasks');
            this.toastr.success("Pre Audit checklist tasks has been rejected.", "Success", { enableHtml: true });
          }
          
        }else{
          this.toastr.error("Action failed", 'error');
        }     
      })      
    }
    else{
      this.toastr.error("Please select atleast one Component  ", 'error');
    }


  }


  CloseApprovePopup1() {
    jQuery("#Approvepopup1").modal('hide');
  }

  CloseRejectPopup1() {
    jQuery("#Rejectpopup1").modal('hide');
  }

  ClearSelections() {
  
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.refreshCells();
  }

  commentsclick(value){
    if(!(value.replace(/\s/g, '').length))
    {
      this.SavePreAuditbyRPOCData.p_comments = '';
    }
  }

}
