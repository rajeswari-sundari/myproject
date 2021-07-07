import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
//import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { CustomTooltipComponent } from '../../Custom/custom-tooltip/custom-tooltip.component';
import { EditMetricsDefinationComponent } from '../../manage-controls/edit-metrics-defination/edit-metrics-defination.component';
import { KeyValuePairDTO } from 'src/app/Common/KeyValuePairDTO';
import { CustomCheckboxComponent } from 'src/app/Custom/custom-checkbox/custom-checkbox.component';
import { ManageControlsService } from 'src/app/manage-controls/manage-controls.service';
import { ManageControls, ManageControlsSearch } from 'src/app/manage-controls/manageControlsSearch';
import { ManageAuditService } from '../manage-audits.service';
import {
  AuditControl, NewAuditDetails, ManageAuditMetricsControls, CategoryDataJson, LoadAuditControlData, ManageAuditsSearch,
  SaveAuditControl, AuditControlMetrics, AddAuditControlDetails, GetCategoryData, ManageAuditControls, UpdateAuditControlMetrics
} from '../manageAuditsClasses';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
@Component({
  selector: 'app-category-controls-tab',
  templateUrl: './category-controls-tab.component.html',
  styleUrls: ['./category-controls-tab.component.css']
})
export class CategoryControlsTabComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @Input() data;

  public modalRef: BsModalRef;

  public selectCategoryData: ManageControlsSearch;
  public selectControls: ManageControls[];
  public categorydata: ManageAuditControls[];
  public categorydata1: ManageAuditControls[];
  public selectCategories: CategoryDataJson;
  public selectedData: LoadAuditControlData;
  public manageAuditsSearchData: ManageAuditsSearch;

  public saveAuditData: SaveAuditControl;
  public auditControlData: AuditControl;
  public addauditControldata: AddAuditControlDetails;
  public UpdateAuditControlMetrics: UpdateAuditControlMetrics;

  public rowData: any[];
  public tabMenu: any;
  public defaultColDef;
  public columnDefs: any[];
  public rowData1: any[];
  public defaultColDef1;
  public columnDefs1: any[];
  public gridOptions;
  public gridOptions1;
  public gridApi;
  public gridColumnApi;
  public rowSelection1;
  public selectedRows: any[];
  public newaudit: any;
  public noRowsTemplate;
  public loadingTemplate;
  public audit_id: any;
  public newauditdata: NewAuditDetails;
  public checklistrowdata: any[];
  frameworkComponents: any;
  public tooltipShowDelay;
  public metricsconActual: any;
  public metricscontrolData: ManageAuditMetricsControls;
  public metricsControlDatabind: AuditControlMetrics;
  public errorMessage: string;
  public published: any;
  public isAdmin: boolean = false;
  public actionParam:any;

  public isEditable: boolean;
  public orgData: any;

// private _matDialog: MatDialog
  constructor(private _selectCategoryControlServiceClient: ManageControlsService, private _loadAuditServiceClient: ManageAuditService,
    private router: Router, private _routeParameters: ActivatedRoute, private modalService: BsModalService, private _router: Router,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService) {
    this.selectCategories = new CategoryDataJson();
    this.selectedData = new LoadAuditControlData();
    this.selectCategoryData = new ManageControlsSearch();
    this.saveAuditData = new SaveAuditControl();
    this.auditControlData = new AuditControl();
    this.newauditdata=new NewAuditDetails();
    this.addauditControldata = new AddAuditControlDetails();
    this.manageAuditsSearchData = new ManageAuditsSearch();
    this.metricscontrolData = new ManageAuditMetricsControls();
    this.metricsControlDatabind=new AuditControlMetrics();
    this.UpdateAuditControlMetrics = new UpdateAuditControlMetrics();

    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Categories and controls are Loading....</span>`;
    this.noRowsTemplate =
      `<span class="ag-overlay-loading-center">No categories & controls added. Please select from grid above.</span>`;

    this.isEditable = this._loadAuditServiceClient.isRecordEditable();
    
    this.columnDefs = [
      { headerName: '', field: 'audit_id', hide: true },
      { headerName: 'Parent category', field: 'parent_category_name', filter: true, sortable: false, },
      { headerName: 'Category', field: 'category_name', filter: true, sortable: true, },
      { headerName: 'Control', field: 'control_name', tooltipField: 'control_name', filter: true, sortable: false, editable: false, },
      {
        headerName: '', filter: false, sortable: false, editable: false, resizable: false, maxWidth: 50,
        cellRenderer: "buttonRenderer",
        cellRendererParams: {
          onClick: (node) => !this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', node.rowData.control_name) ? this.onBtnClick2(node) : null
        }
      },
      { headerName: 'Weightage (%)', field: 'weightage', filter: false, sortable: false }
    ];

    this.columnDefs1 = [
      { headerName: '', field: 'controlchecked', width: 50, 
      cellRendererFramework: CustomCheckboxComponent,
      cellRendererParams: {
        pageRef: 'select-controls',
        isEditable: this.isEditable
      },
      },
      { headerName: 'Parent category', field: 'parent_category_name', filter: true, sortable: false },
      { headerName: 'Category', field: 'category_name', filter: true, sortable: true },
      { headerName: 'Control', field: 'control_name', filter: true, sortable: false, editable: false },
      { headerName: 'Weightage (%)', field: 'weightage', filter: false, sortable: false, width: 184 },
    ]

    this.defaultColDef = {
      editable: false, sortable: true, resizable: true, filter: true, flex: 1, tooltipComponent: 'customTooltipComponent', lockPosition: true,
    }
    this.tooltipShowDelay = 0;
    this.frameworkComponents = { customTooltipComponent: CustomTooltipComponent, buttonRenderer: EditMetricsDefinationComponent };
    this.gridOptions1 = <GridOptions>{
      editable: false, enableBrowserTooltips: true, filter: "agTextColumnFilter"
    }

    this.rowSelection1 = "multiple";
  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      this.audit_id = data['auditID'];
      this.actionParam = data['action'];
    })
   if(this.actionParam=='view'){
      this.isAdmin = this.actionParam == 'view' ? true : false;
   }
    this.manageAuditsSearchData.audit_id=this.audit_id;
    this.spinnerService.show()
    this._loadAuditServiceClient.getAudits(this.manageAuditsSearchData).subscribe((data: any) => {
      this.newauditdata = data;
      this.spinnerService.hide()
      this.published = this.newauditdata[0].published;
      // if(this.published=='Yes'){
      // this.isAdmin = this.published == 'Yes' ? true : false;
      // }
    });

    this.orgData = this._loadAuditServiceClient.getPreviewAuditData();
    
    this.GetAuditData();
  }
  GetAuditData(): void {
    this.auditControlData.p_audit_id = this.audit_id;
    this._loadAuditServiceClient.getPreviewAudits(this.auditControlData).subscribe((data: any[]) => {
      if (!this.orgData) {
        this.orgData = data;
        sessionStorage.setItem('previewAuditData', JSON.stringify(data));
      }
      this.rowData = data;
    });
  }

  GetCategoryData(selectCategoryData) {
    this._selectCategoryControlServiceClient.getControls(selectCategoryData).subscribe((data: ManageAuditControls[]) => {
      if (data != null) {
        this.categorydata = this.rowData;
        if (this.categorydata != null) {
          for (let x of data) {
            if (this.categorydata.filter(y => y.control_id == x.control_id).length == 1) {
              x.controlchecked = true;
            }
            else {
              x.controlchecked = false;
            }
          
          }

          this.rowData1 = data.filter(x=>x.control_id != "0");
        }
        else {
          this.rowData1 = data.filter(x=>x.control_id != "0");
        }
        this._loadAuditServiceClient.disableCheckbox();
      }
    })
  }
  SelectedCatagoryData() {
    this.categorydata1 = this.rowData1;
    this.addauditControldata.AuditControlDetails = this.categorydata1.filter(x => x.controlchecked == true);
    this.addauditControldata.p_audit_id = this.audit_id;
    this._loadAuditServiceClient.addAuditControl(this.addauditControldata).subscribe((data: any[]) => {
      this.rowData = data;
    })
    //this.rowData = this.selectControls;
    //})

    jQuery("#SelectCategorypopup").modal('hide');

  }

  ClearSelectedCategoryData() {
    for (let x of this.rowData1) {
      x.controlchecked = this._loadAuditServiceClient.hasExistingData(this.orgData, 'control_name', x.control_name) ? true : false;
    }
    this.gridOptions1.api.refreshCells();
  }
  Savecategorydata() {
    if(this.rowData!=null  &&  this.rowData.length!=0){
    this.saveAuditData.p_audit_id = this.audit_id;
    this._loadAuditServiceClient.saveAuditControl(this.saveAuditData).subscribe((data: any) => {
      if (data == 'success') {
        this.toastr.success('Category and Controls Data Saved Successfully', 'Success', { enableHtml: true });
      }
      else {
        this.toastr.error('Failed', 'Error');
      }
    })
  }
  else{
    this.toastr.error('Data Should not be empty', 'Error');
  }
  }

  SaveProceedData() {
    if(this.rowData!=null  &&  this.rowData.length!=0){
    this.saveAuditData.p_audit_id = this.audit_id;
    this._loadAuditServiceClient.saveAuditControl(this.saveAuditData).subscribe((data: any) => {
      this.tabactive.emit(1) 
    })
  }
  else{
    this.toastr.error('Data Should not be empty', 'Error');
  }

  }

  SelectCategory() {
    jQuery("#SelectCategorypopup").modal();
    this.GetCategoryData(this.selectCategoryData);
  }

  closeSelectCategory() {
    jQuery("#SelectCategorypopup").modal('hide');
  }
  CancelAudit(): void {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Control Items",
        message: "Are you sure you want to Discard your changes?",
        callback: (result) => {
          if(result == 'yes') {
            this._router.navigateByUrl('/Manageaudits');
          }
        }
      }
    })
  }
  // const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
  //   maxWidth: "600px",
  //   maxHeight: "200px",
  //   data: {
  //     title: "Control Items",
  //     message: "Are you sure you want to Discard your changes?"
  //   }
  // });
  // dialogRef.afterClosed().subscribe(dialogResult => {
  //   if (dialogResult) {
  //     this._router.navigateByUrl('/Manageaudits');
  //   }
  // })
  onBtnClick2(e: any) {
    this.metricsconActual = e.rowData.metrics_type;
    //this.metricscontrolData = new ManageMetricsControls();
    this.metricscontrolData = e.rowData;
    this.metricscontrolData.cliff_percentNumber = null;
    this.metricscontrolData.need_improvement_percentNumber = null;
    this.metricscontrolData.partially_ready_percentNumber = null;
    this.metricscontrolData.audit_ready_percentNumber = null;
    this.metricscontrolData.cliff_percentRange1 = null;
    this.metricscontrolData.cliff_percentRange2 = null;
    this.metricscontrolData.need_improvement_percentRange1 = null;
    this.metricscontrolData.need_improvement_percentRange2 = null;
    this.metricscontrolData.partially_ready_percentRange1 = null;
    this.metricscontrolData.partially_ready_percentRange2 = null;
    this.metricscontrolData.audit_ready_percentRange1 = null;
    this.metricscontrolData.audit_ready_percentRange2 = null;
    if (this.metricscontrolData.metrics_type == 'Number') {
      this.metricscontrolData.metrics_type = "Number";
      this.metricscontrolData.cliff_percentNumber = Number(this.metricscontrolData.cliff_percent);
      this.metricscontrolData.need_improvement_percentNumber = Number(this.metricscontrolData.need_improvement_percent);
      this.metricscontrolData.partially_ready_percentNumber = Number(this.metricscontrolData.partially_ready_percent);
      this.metricscontrolData.audit_ready_percentNumber = Number(this.metricscontrolData.audit_ready_percent);
    }
    else {
      this.metricscontrolData.metrics_type = "Range";
      var clifPer = this.metricscontrolData.cliff_percent.split('-');
      this.metricscontrolData.cliff_percentRange1 = Number(clifPer[0]);
      this.metricscontrolData.cliff_percentRange2 = Number(clifPer[1]);
      var needImporvePer = this.metricscontrolData.need_improvement_percent.split('-');
      this.metricscontrolData.need_improvement_percentRange1 = Number(needImporvePer[0]);
      this.metricscontrolData.need_improvement_percentRange2 = Number(needImporvePer[1]); //== 'NaN' ?  : Nu;
      var partiallyReadyPer = this.metricscontrolData.partially_ready_percent.split('-');
      this.metricscontrolData.partially_ready_percentRange1 = Number(partiallyReadyPer[0]);
      this.metricscontrolData.partially_ready_percentRange2 = Number(partiallyReadyPer[1]);
      var auditReadyPer = this.metricscontrolData.audit_ready_percent.split('-');
      this.metricscontrolData.audit_ready_percentRange1 = Number(auditReadyPer[0]);
      this.metricscontrolData.audit_ready_percentRange2 = Number(auditReadyPer[1]);
    }
    jQuery("#Metricspopup").modal();
  }

  numberOnly(event) {
    // var charCode = (event.which) ? event.which : event.keyCode;
    // // Only Numbers 0-9
    // if ((charCode < 48 || charCode > 57)) {
    //   event.preventDefault();
    //   return false;
    // } else {
    //   return true;
    // }
    if (/^[0-9]*$/.test(event.target.value)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  SaveMetricsDefinition() {

    if (this.MetricsDefinitionValidation()) {
      if (this.metricscontrolData.metrics_type == 'Number') {
        this.metricscontrolData.cliff_percent = this.metricscontrolData.cliff_percentNumber.toString();
        this.metricscontrolData.need_improvement_percent = this.metricscontrolData.need_improvement_percentNumber.toString();
        this.metricscontrolData.partially_ready_percent = this.metricscontrolData.partially_ready_percentNumber.toString();
        this.metricscontrolData.audit_ready_percent = this.metricscontrolData.audit_ready_percentNumber.toString();
      }
      else {
        this.metricscontrolData.cliff_percent = this.metricscontrolData.cliff_percentRange1.toString() + "-" + this.metricscontrolData.cliff_percentRange2.toString();
        this.metricscontrolData.need_improvement_percent = this.metricscontrolData.need_improvement_percentRange1.toString() + "-" + this.metricscontrolData.need_improvement_percentRange2.toString();
        this.metricscontrolData.partially_ready_percent = this.metricscontrolData.partially_ready_percentRange1.toString() + "-" + this.metricscontrolData.partially_ready_percentRange2.toString();
        this.metricscontrolData.audit_ready_percent = this.metricscontrolData.audit_ready_percentRange1.toString() + "-" + this.metricscontrolData.audit_ready_percentRange2.toString();
      }
      this.metricsControlDatabind = this.metricscontrolData;
      //this.UpdateAuditControlMetrics.AuditControlMetrics = this.metricsControlDatabind;
      this.UpdateAuditControlMetrics.p_audit_id = this.audit_id;
      this.errorMessage = "";
      this._loadAuditServiceClient.UpdateManageMetrics(this.metricsControlDatabind).subscribe((data: any) => {
        console.log(data);
       this.rowData=data;
      });
      this.closeMetrics();

    }
  }
  closeMetrics() {
    jQuery("#Metricspopup").modal('hide');
    this.metricscontrolData.metrics_type = this.metricsconActual;
  }
  Back(): void {
    if(this.isAdmin==false){
    this._router.navigateByUrl('/AddEditAudit/' + this.audit_id);
    }
    else{
      this._router.navigateByUrl('/AddEditAudit/' + this.audit_id+'/view');
    }
  }
  Next():void{
   this.tabactive.emit(1);
  }

  MetricsDefinitionValidation(): boolean {
    this.errorMessage = null;
    if (this.metricscontrolData.metrics_type == 'Number') {
      if ((this.metricscontrolData.cliff_percentNumber != null && this.metricscontrolData.cliff_percentNumber.toString() != '')
        && (this.metricscontrolData.need_improvement_percentNumber != null && this.metricscontrolData.need_improvement_percentNumber.toString() != '')
        && (this.metricscontrolData.partially_ready_percentNumber != null && this.metricscontrolData.partially_ready_percentNumber.toString() != '')
        && (this.metricscontrolData.audit_ready_percentNumber != null && this.metricscontrolData.audit_ready_percentNumber.toString() != '')
        && (Number(this.metricscontrolData.cliff_percentNumber) < Number(this.metricscontrolData.need_improvement_percentNumber))
        && (Number(this.metricscontrolData.need_improvement_percentNumber) < Number(this.metricscontrolData.partially_ready_percentNumber))
        && (Number(this.metricscontrolData.partially_ready_percentNumber) < Number(this.metricscontrolData.audit_ready_percentNumber))
        && (this.metricscontrolData.audit_ready_percentNumber <= 100)) {
        return true;
      }
      else {
        this.toastr.error("Readiness type value is invalid.", 'error', { enableHtml: true });
        //this.errorMessage = "Readiness type value is invalid."
        return false;
      }
    }
    else {
      if ((this.metricscontrolData.cliff_percentRange1 != null && this.metricscontrolData.cliff_percentRange1.toString() != '')
        && (this.metricscontrolData.cliff_percentRange2 != null && this.metricscontrolData.cliff_percentRange2.toString() != '')
        && (this.metricscontrolData.need_improvement_percentRange1 != null && this.metricscontrolData.need_improvement_percentRange1.toString() != '')
        && (this.metricscontrolData.need_improvement_percentRange2 != null && this.metricscontrolData.need_improvement_percentRange2.toString() != '')
        && (this.metricscontrolData.partially_ready_percentRange1 != null && this.metricscontrolData.partially_ready_percentRange1.toString() != '')
        && (this.metricscontrolData.partially_ready_percentRange2 != null && this.metricscontrolData.partially_ready_percentRange2.toString() != '')
        && (this.metricscontrolData.audit_ready_percentRange1 != null && this.metricscontrolData.audit_ready_percentRange1.toString() != '')
        && (this.metricscontrolData.audit_ready_percentRange2 != null && this.metricscontrolData.audit_ready_percentRange2.toString() != '')
        && (Number(this.metricscontrolData.cliff_percentRange1) < Number(this.metricscontrolData.cliff_percentRange2))
        && Number(this.metricscontrolData.cliff_percentRange2) < Number(this.metricscontrolData.need_improvement_percentRange1)
        && Number(this.metricscontrolData.need_improvement_percentRange1) < Number(this.metricscontrolData.need_improvement_percentRange2)
        && Number(this.metricscontrolData.need_improvement_percentRange2) < Number(this.metricscontrolData.partially_ready_percentRange1)
        && Number(this.metricscontrolData.partially_ready_percentRange1) < Number(this.metricscontrolData.partially_ready_percentRange2)
        && Number(this.metricscontrolData.partially_ready_percentRange2) < Number(this.metricscontrolData.audit_ready_percentRange1)
        && Number(this.metricscontrolData.audit_ready_percentRange1) < Number(this.metricscontrolData.audit_ready_percentRange2)
        && Number(this.metricscontrolData.audit_ready_percentRange2) <= 100) {
        return true;
      }
      else {
        this.toastr.error("Readiness type value is invalid.", 'error', { enableHtml: true });
        //this.errorMessage = "Readiness type value is invalid."
        return false;
      }
    }
  }



  ResetMetrics(): void {
    this.metricscontrolData.cliff_percentNumber = null;
    this.metricscontrolData.need_improvement_percentNumber = null;
    this.metricscontrolData.partially_ready_percentNumber = null;
    this.metricscontrolData.audit_ready_percentNumber = null;
    this.metricscontrolData.cliff_percentRange1 = null;
    this.metricscontrolData.cliff_percentRange2 = null;
    this.metricscontrolData.need_improvement_percentRange1 = null;
    this.metricscontrolData.need_improvement_percentRange2 = null;
    this.metricscontrolData.partially_ready_percentRange1 = null;
    this.metricscontrolData.partially_ready_percentRange2 = null;
    this.metricscontrolData.audit_ready_percentRange1 = null;
    this.metricscontrolData.audit_ready_percentRange2 = null;

    if (this.metricsconActual == 'Number') {
      this.metricscontrolData.metrics_type = "Number";
      this.metricscontrolData.cliff_percentNumber = Number(this.metricscontrolData.cliff_percent);
      this.metricscontrolData.need_improvement_percentNumber = Number(this.metricscontrolData.need_improvement_percent);
      this.metricscontrolData.partially_ready_percentNumber = Number(this.metricscontrolData.partially_ready_percent);
      this.metricscontrolData.audit_ready_percentNumber = Number(this.metricscontrolData.audit_ready_percent);
    }
    else {
      this.metricscontrolData.metrics_type = "Range";
      var clifPer = this.metricscontrolData.cliff_percent.split('-');
      this.metricscontrolData.cliff_percentRange1 = Number(clifPer[0]);
      this.metricscontrolData.cliff_percentRange2 = Number(clifPer[1]);
      var needImporvePer = this.metricscontrolData.need_improvement_percent.split('-');
      this.metricscontrolData.need_improvement_percentRange1 = Number(needImporvePer[0]);
      this.metricscontrolData.need_improvement_percentRange2 = Number(needImporvePer[1]); //== 'NaN' ?  : Nu;
      var partiallyReadyPer = this.metricscontrolData.partially_ready_percent.split('-');
      this.metricscontrolData.partially_ready_percentRange1 = Number(partiallyReadyPer[0]);
      this.metricscontrolData.partially_ready_percentRange2 = Number(partiallyReadyPer[1]);
      var auditReadyPer = this.metricscontrolData.audit_ready_percent.split('-');
      this.metricscontrolData.audit_ready_percentRange1 = Number(auditReadyPer[0]);
      this.metricscontrolData.audit_ready_percentRange2 = Number(auditReadyPer[1]);
    }


  }
}
