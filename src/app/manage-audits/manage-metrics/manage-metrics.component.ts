import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { ManageAuditService } from '../manage-audits.service';
import { KeyValuePairDTO } from 'src/app/Common/KeyValuePairDTO';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
//import {MatDialog} from '@angular/material/dialog';
import { MetricsDefinitionService } from 'src/app/metrics-definition/metrics-definition.service';
import { ManageMetricsControls, MetricsDefinitionSearch, MetricsJonControl } from 'src/app/metrics-definition/metricsDefinitionSearch';
import {  SaveAuditControl,AddAuditControlDetails,ManageAuditControls ,AuditControl,UpdateAuditControlMetrics} from '../manageAuditsClasses';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any
@Component({
  selector: 'app-manage-metrics',
  templateUrl: './manage-metrics.component.html',
  styleUrls: ['./manage-metrics.component.css']
})
export class ManageMetricsComponent implements OnInit {
  // @ViewChild("tabset", {static: true}) tabset: TabsetComponent;
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @Input() data;

  public modalRef: BsModalRef;

  public manageMetricsSearchData: MetricsDefinitionSearch;
  public addauditControldata: AddAuditControlDetails;
  public UpdateAuditControlMetrics:UpdateAuditControlMetrics;
  public auditcontrol:AuditControl;
  public GridData:any[];
  public parentCategories: any[];
  public Categories: any[];
  public columnDefs: any[];
  public rowData: any[];
  public defaultColDef;
  public managemetricsType: string;
  public components;
  public gridOptions: GridOptions;
  public managemetricControls: ManageMetricsControls[] = [];
  public errorMessage: string;
  public managemetricsJsonControls: MetricsJonControl;
  public onCellEditingStopped: any;
  public onCellEditingStarted: any;
  public audit_id:any;
  public published:any;
  public noRowsTemplate;
  public loadingTemplate;
  public isAdmin: boolean = false;
  public actionParam:any;

  public isEditable: boolean;
  public orgData: any;
  
  //private _matDialog: MatDialog
  constructor(private managemetricsServiceClient: MetricsDefinitionService,private _routeParameters: ActivatedRoute,
    private _loadAuditServiceClient: ManageAuditService, public toastr: ToastrService,
    private modalService: BsModalService,private _router:Router, private spinnerService: NgxSpinnerService) {
    this.manageMetricsSearchData = new MetricsDefinitionSearch();
    this.managemetricsJsonControls = new MetricsJonControl();
    this.addauditControldata = new AddAuditControlDetails();
    this.auditcontrol=new AuditControl();
    this.UpdateAuditControlMetrics=new UpdateAuditControlMetrics();

    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">controls are Loading....</span>`;
    this.noRowsTemplate =
      `<span class="ag-overlay-loading-center">No categories & controls added.</span>`;

    this.isEditable = this._loadAuditServiceClient.isRecordEditable();
    this.orgData = this._loadAuditServiceClient.getPreviewAuditData();
  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      this.actionParam = data['action'];
    })
   if(this.actionParam=='view'){
      this.isAdmin = this.actionParam == 'view' ? true : false;
   }
    this.audit_id=this.data[0].audit_id;
    this.published=this.data[0].published;
    // if(this.published=='Yes'){
    // this.isAdmin = this.published == 'Yes' ? true : false;
    // }
   this.auditcontrol.p_parent_category_id = null;
   this.auditcontrol.p_category_id=null;
   this.auditcontrol.p_control_id=null;
   this.auditcontrol.p_control_name=null;
    this.auditcontrol.p_audit_id=this.audit_id;
   this.spinnerService.show()
    this._loadAuditServiceClient.getPreviewAudits(this.auditcontrol).subscribe((data: any[]) => {
      if(data!=null){
      this.rowData = data;
      this.GridData=data;
      this.spinnerService.hide()
      this.parentCategories=this.GridData.map(({ parent_category_id, parent_category_name }) => ({parent_category_id, parent_category_name}));
      this.parentCategories= this.parentCategories.filter(function (a) {
        return !this[a.parent_category_id] && (this[a.parent_category_id] = true);
    }, Object.create(null));
  }
    })
   if(this.isAdmin==false){
    this.columnDefs = [
      { headerName: 'Control ID', field: 'control_id', editable: false },
      { headerName: 'Control', field: 'control_name', editable: false },
      { headerName: 'Cliff (%)', field: 'cliff_percent', editable: (node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', node.data.control_name) ? false : true },
      { headerName: 'Need improvement(%)', field: 'need_improvement_percent', editable: (node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', node.data.control_name) ? false : true }, 
      { headerName: 'Partially ready (%)', field: 'partially_ready_percent', editable: (node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', node.data.control_name) ? false : true },
      { headerName: 'Audit ready (%)', field: 'audit_ready_percent', editable: (node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', node.data.control_name) ? false : true }
    ];
  }
  else{
    this.columnDefs = [
      { headerName: 'Control ID', field: 'control_id', editable: false },
      { headerName: 'Control', field: 'control_name', editable: false },
      { headerName: 'Cliff (%)', field: 'cliff_percent',editable: false},
      { headerName: 'Need improvement(%)', field: 'need_improvement_percent',editable: false }, 
      { headerName: 'Partially ready (%)', field: 'partially_ready_percent',editable: false },
      { headerName: 'Audit ready (%)', field: 'audit_ready_percent',editable: false }
    ];
  }

    this.defaultColDef = {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
      flex: 1,
      lockPosition:true
    }

    this.gridOptions = <GridOptions> {
      columnDefs: this.columnDefs,
      defaultColDef: this.defaultColDef,
      rowData: this.rowData,
      singleClickEdit:true,

      onCellEditingStarted: function(event) {

      },

      onCellEditingStopped: (event) => {
        if(event.value != undefined && event.value != null && event.value != "") {
          let reg = /^([0-9]+-)*[0-9]+$/;
          let val = event.value;
          if(reg.test(val) == false) {
            event.node.setDataValue(event.column, "");
          }
          else if(event.value > 100) {
            event.node.setDataValue(event.column, "");
          }
          else if(event.value.includes("-")) {
            let splittedValues = event.value.split("-");
            if(Number(splittedValues[0]) > Number(splittedValues[1]) || Number(splittedValues[0]) > 100 || Number(splittedValues[1]) > 100) 
            {
              event.node.setDataValue(event.column, "");
              this.toastr.error('First value should not be greater than Second value', 'error');
            }
          }
        }
      },

      stopEditingWhenGridLosesFocus: true
    }
  }
  validateMetrics(): any {
    let val = true;
    if(this.rowData != null)
    {
      //this.controls.every(x => {
        for(let x of  this.rowData) {
      if ((x.cliff_percent == "" || x.need_improvement_percent == "" || x.partially_ready_percent == "" || x.audit_ready_percent == "") ||
        (x.cliff_percent == "undefined" || x.need_improvement_percent == "undefined" || x.partially_ready_percent == "undefined" || x.audit_ready_percent == "undefined")) {
        this.errorMessage = "Control : " + x.control_name + " : data should not be empty ";
        this.toastr.error(this.errorMessage, 'error');
        val = false;
        return val;
        
      }
      else {
        if (x.cliff_percent.indexOf("-") > 0 && x.need_improvement_percent.indexOf("-") > 0 && x.partially_ready_percent.indexOf("-") > 0 && x.audit_ready_percent.indexOf("-") > 0 ) {
          // Check all values are range 
          x.metrics_type = "Range";

          let cliffArr = x.cliff_percent.split("-");
          let needImpArr = x.need_improvement_percent.split("-");
          let partReadyArr = x.partially_ready_percent.split("-");
          let auditReadyArr = x.audit_ready_percent.split("-");

          if(Number(cliffArr[1]) >= Number(needImpArr[0]) || Number(needImpArr[1]) >= Number(partReadyArr[0])  ||
          Number(partReadyArr[1]) >= Number(auditReadyArr[0]))
          {
            // Check A>B>C>D
            this.errorMessage = "Control : " + x.control_name + " :  has invalid range value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }

        }
        else if (x.cliff_percent.indexOf("-") <= 0 && x.need_improvement_percent.indexOf("-") <= 0 && x.partially_ready_percent.indexOf("-") <= 0 && x.audit_ready_percent.indexOf("-") <= 0) {
          // Check all values are Numbers
          x.metrics_type = "Number";

          if(Number(x.cliff_percent) > Number(x.need_improvement_percent) || Number(x.need_improvement_percent) > Number(x.partially_ready_percent)  ||
          Number(x.partially_ready_percent) > Number(x.audit_ready_percent))
          {
            // Check A>B>C>D
            
            this.errorMessage = "Control : " + x.control_name + " :  has invalid number value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }
        }
        else {
          this.errorMessage = "Control : " + x.control_name + " : should have range/number value";
          this.toastr.error(this.errorMessage, 'error');
          val = false;
          return val;
        }

        if ( // Invalid value check like 10-10-10
          (x.cliff_percent.indexOf("-") != x.cliff_percent.lastIndexOf("-")) || (x.need_improvement_percent.indexOf("-") != x.need_improvement_percent.lastIndexOf("-")) ||
          (x.partially_ready_percent.indexOf("-") != x.partially_ready_percent.lastIndexOf("-")) || (x.audit_ready_percent.indexOf("-") != x.audit_ready_percent.lastIndexOf("-"))
        ) {
          this.errorMessage = "Control : " + x.control_name + " :  has invalid value";
          this.toastr.error(this.errorMessage, 'error');
          val = false;
          return val;
        }
      }
    }
    }
    else
    {
      val = false;
    }
    return val;
  }
  SearchManagemetricControls() {
    this._loadAuditServiceClient.getPreviewAudits(this.auditcontrol).subscribe((data: any[]) => {
      if(data.length > 0) { 
        this.rowData = data;
      }
      else {
        this.rowData = null;
      }
    });
  }

  ResetManagemetricControls() {
    this.Categories=null;
    this.auditcontrol.p_parent_category_id = null;
    this.auditcontrol.p_category_id=null;
    this.auditcontrol.p_control_id=null;
    this.auditcontrol.p_control_name=null;
    this.auditcontrol.p_audit_id=this.audit_id;
    this.SearchManagemetricControls();
  }

  LoadManagemetricCategory() {
    this.Categories = null;
    this.Categories=this.GridData.filter(d=>d.parent_category_id==this.auditcontrol.p_parent_category_id);
    this.Categories=this.Categories.map(({ category_id, category_name }) => ({category_id, category_name}));
      this.Categories= this.Categories.filter(function (a) {
        return !this[a.category_id] && (this[a.category_id] = true);
    }, Object.create(null));
  
  
  }
  SavemanageMetrics(): void {
    if(this.rowData!=null  &&  this.rowData.length!=0){
   this.UpdateAuditControlMetrics.AuditControlMetrics= this.rowData;
   this.UpdateAuditControlMetrics.p_audit_id=this.audit_id;  
    if (this.validateMetrics()) {
      this.errorMessage = "";
      this._loadAuditServiceClient.UpdateMetrics(this.UpdateAuditControlMetrics).subscribe((data: any) => {
         if (data == "failure") {
          this.toastr.error("Failed", 'error');
        } else {
          this.toastr.success("Metrics defined successfully" ,'Success', { enableHtml: true });
        }
       });
     }
    }
    else{
      this.toastr.error("Data Should not be empty", 'error');
    }
  }
  SaveProceed() {
    if(this.rowData!=null  &&  this.rowData.length!=0){
    this.UpdateAuditControlMetrics.AuditControlMetrics= this.rowData;
    this.UpdateAuditControlMetrics.p_audit_id=this.audit_id;  
     if (this.validateMetrics()) {
       this.errorMessage = "";
       this._loadAuditServiceClient.UpdateMetrics(this.UpdateAuditControlMetrics).subscribe((data: any) => {
        this.tabactive.emit(2) 
        });
      }
    }
    else{
      this.toastr.error("Data Should not be empty", 'error');
    }
  }
  CancelAudit():void{
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Control Items",
        message: "Are you sure you want to Discard your changes?",
        callback: (result) => {
          if(result == "yes") {
            this._router.navigateByUrl('/Manageaudits');
          } else {
            console.log("no");
          }
        }
      }
    })
  }
  Next():void{
    this.tabactive.emit(2);
  }
  GotoPrevious() {
    this.tabactive.emit(0);
  }
  
  /*
  const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
      maxWidth: "600px",
      maxHeight : "200px",
      data: {
          title: "Control Items",
          message: "Are you sure you want to Discard your changes?"}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this._router.navigateByUrl('/Manageaudits/');
      }
    })
  */
}

