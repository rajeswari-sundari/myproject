import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomAggridLinkButtonMyTasksComponent } from '../Custom/custom-aggrid-link-button-my-tasks/custom-aggrid-link-button-my-tasks.component';
import { OngoingAuditDetails, OngoingAuditList, PreAuditCheckList, ProgressList, SearchProgress, SearchTasks, Tasks } from './my-tasks';
import { MyTasksService } from './my-tasks.service';
//import { MyTaskService } from './my-tasks.service';

declare var jQuery:any;
@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  public userID : string;
  public role : string;
  public auditReadinessRow: any[];
  public auditReadinessColumn: any[];
  public defaultAuditReadinessColDef;
  public readinessloadingTemplate;
  public noReadinessRowsTemplate;

  public ProgressstatusRow: any[];
  public ProgressstatusColumn: any[];
  public defaultProgressstatusColDef;
  public ProgressstatusloadingTemplate;
  public noProgressstatusRowsTemplate;

  public preAuditChecklistRow: any[];
  public preAuditChecklistColumn: any[];
  public defaultpreAuditChecklistColDef;
  public preauidtchecklistloadingTemplate;
  public nopreauidtChecklistRowsTemplate;
  
  public postAuditRow: any[];
  public postAuditColumn: any[];
  public defaultpostAuditColDef;
  public postauditloadingTemplate;
  public nopostAuditRowsTemplate;

  public ongoingAuditRow: any[];
  public ongoingAuditColumn: any[];
  public defaultongoingAuditColDef;
  public ongoingauditloadingTemplate;
  public noongoingAuditRowsTemplate;

  public ongoingDetails: OngoingAuditDetails;

  public searchTask : SearchTasks;
  public searchProgress  : SearchProgress;
  public overallprogressbarvalue: string;
  public auditName : string;
  public parentCustomerName : string;
  public totalCount : string;
  public updatedCount : string;
  public isRpocApocMdu: boolean = false;
  // public isMdu: boolean = false;

  constructor(private _serviceClient : MyTasksService, private spinnerService: NgxSpinnerService) {
   this.searchTask = new SearchTasks();
   this.searchProgress = new SearchProgress();
    this.ongoingDetails = new OngoingAuditDetails();
  }

  ngOnInit() {
    this.readinessloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Audit readiness tasks are assigned.</span>`;

    this.noReadinessRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Audit readiness tasks are assigned.</span>`;

    this.ProgressstatusloadingTemplate = 
    `<span class="ag-overlay-loading-center">Progress status controls are not updated.</span>`;

    this.noProgressstatusRowsTemplate = 
    `<span class="ag-overlay-loading-center">Progress status controls are not updated.</span>`;

    this.preauidtchecklistloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Pre-audit checklist tasks are assigned.</span>`;

    this.nopreauidtChecklistRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Pre-audit checklist tasks are assigned.</span>`;

    this.postauditloadingTemplate =
    `<span class="ag-overlay-loading-center">You do not have tasks assigned.</span>`;

    this.nopostAuditRowsTemplate =
    `<span class="ag-overlay-loading-center">You do not have tasks assigned.</span>`;

    this.ongoingauditloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Ongoing audits are assigned.</span>`;

    this.noongoingAuditRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Ongoing audits are assigned.</span>`;
    this.userID =  sessionStorage.getItem('UserID');
    this.role = sessionStorage.getItem('UserRole');
    this.searchTask.user_id = this.userID; //762252
    this.getAuditReadinessTasks(this.searchTask);
    this.getPreAuditChecklistTasks(this.searchTask);
    if (this.role == 'MDU')  {
      this.getOnGoingAudits();
    }
    if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
      this.isRpocApocMdu = true;
    } else if(sessionStorage.getItem('UserRole')=='MDU') {
      this.isRpocApocMdu = true;
    } else {
      this.isRpocApocMdu = false;
    }

    this.auditReadinessColumn = [
      { headerName: 'Audit ID', field : 'audit_id' },
      { headerName: 'Audit name', field : 'audit_name',sortable: true,filter:true,},
      { headerName: 'Customer', field : 'parent_customer_name',sortable: true,filter:true, },
      { headerName: 'Task due date', field : 'task_due_date' },
      { headerName: 'Overall compliance status (%)', field : 'overall_compliance_status',sortable: true },
      { headerName: 'Overall progress status (%)', field : 'overall_progress_status',sortable: true,
        cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
        cellRendererParams: {
          linkID : 'progress_status',
          onClick: this.ShowProgress.bind(this),
        },
      },
      { headerName: 'Number of tasks', field : 'number_of_tasks' ,sortable: true, },
      { headerName: 'Task status', field : 'task_status',sortable: true, },
      { headerName: 'Action',
        cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
        cellRendererParams: {
          linkID : 'myTask_audit_id'
        },
      },
    ]

    this.defaultAuditReadinessColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }

    this.ProgressstatusColumn = [
      { headerName: 'Control name' , field : 'control_name' },
      { headerName: 'Updated (Yes/No)', field : 'Updated' },
    ]

    this.defaultProgressstatusColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }

    this.preAuditChecklistColumn = [
      { headerName: 'Audit ID' , field : 'audit_id' },
      { headerName: 'Audit name', field : 'audit_name',sortable: true,filter:true, },
      { headerName: 'Customer', field : 'parent_customer_name',sortable: true,filter:true, },
      { headerName: 'Task due date', field : 'task_due_date' },
      { headerName: 'Progress status (%)', field : 'progress_status', sortable: true, },
      { headerName: 'Number of tasks', field : 'number_of_tasks', sortable: true, },
      { headerName: 'Task status', field : 'task_status', sortable: true, },
      { headerName: 'Action',
      cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
        cellRendererParams: {
          linkID : 'myTask_preAuditCheckList_id'
        }, },
    ]

    this.defaultpreAuditChecklistColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }

    this.postAuditColumn = [
      { headerName: 'Audit ID', },
      { headerName: 'Audit name',sortable: true,filter:true, },
      { headerName: 'Customer',sortable: true,filter:true, },
      { headerName: 'Task due date' },
      { headerName: 'Progress status (%)', sortable: true, },
      { headerName: 'Number of tasks', sortable: true, },
      { headerName: 'Task status', sortable: true, },
      { headerName: 'Action' },
    ]

    this.defaultpostAuditColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }

    this.ongoingAuditColumn = [
      { headerName: 'Audit ID' , field : 'audit_id'},
      { headerName: 'Audit name' , field : 'audit_name', sortable: true,filter: true},
      { headerName: 'Parent customer', field : 'parent_customer_name', sortable: true,filter: true },
      { headerName: 'Pre-audit date' , field : 'pre_audit_date'},
      { headerName: 'Actual audit date' , field : 'actual_audit_date'},
      { headerName: 'Audit type', field: 'audit_type', sortable: true,},
      { headerName: 'Status', field : 'audit_status', sortable: true,},
      { headerName: 'Audit readiness', field : 'audit_readiness', sortable: true, },
      { headerName: 'Published', field : 'published', sortable: true, },
      { headerName: 'Action' ,
         cellRendererFramework : CustomAggridLinkButtonMyTasksComponent,
         cellRendererParams: {
          linkID : 'myTask_ongoingAudit_id'
        },
      },
    ]

    this.defaultongoingAuditColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }
  }

  getAuditReadinessTasks(data: SearchTasks) : void {
    this.spinnerService.show();
    this._serviceClient.getAuditReadinessTasks(data).subscribe((data :Tasks[]) => {
      this.auditReadinessRow = data;
      this.spinnerService.hide();
      });
  }

  getPreAuditChecklistTasks(p:SearchTasks) :void {
     this._serviceClient.getPreAuditChecklistTasks(p).subscribe((data : PreAuditCheckList[]) => {
       this.preAuditChecklistRow = data;
       });
  }
  getProgressStatus(p : SearchProgress) :void {
    this._serviceClient.getProgressStatus(p).subscribe((data : ProgressList[]) => {
      this.ProgressstatusRow = data;
      this.auditName = data[0].audit_name;
      this.parentCustomerName = data[0].parent_customer_name;
      this.totalCount = data[0].Total_count;
      this.updatedCount = data[0].Updated_count;
    });
  }

  ShowProgress(e: any) {
    this.searchProgress.audit_id = e.rowData.audit_id;
    this.overallprogressbarvalue = e.rowData.overall_progress_status;
    this.getProgressStatus(this.searchProgress);
    jQuery('#Progresspopup').modal();
  }

  CloseProgress() {
    jQuery('#Progresspopup').modal('hide');
  }

  getOnGoingAudits() : void {
    this.ongoingDetails.user_id = sessionStorage.getItem('UserID');
    this._serviceClient.getOngoingAudits(this.ongoingDetails).subscribe((data : OngoingAuditList[]) => {
      this.ongoingAuditRow = data;
    });
  }

}
