import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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

declare var jQuery: any;
@Component({
  selector: 'app-category-controls',
  templateUrl: './category-controls.component.html',
  styleUrls: ['./category-controls.component.css']
})
export class CategoryControlsComponent implements OnInit {
  @Input() data;
  @ViewChild("tabset", { static: true }) tabset: TabsetComponent;

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
  public metricsControlDatabind: AuditControlMetrics[] = [];
  public errorMessage: string;
  public published: any;
  public isAdmin: boolean = false;
  public actionParam:any;


  public tabID: Number;
  public tabsets: any[] = [
    { title: 'Category & controls', ID: 1 },
    { title: 'Manage metrics', ID: 2 },
    { title: 'Manage Point of contact', ID: 3 },
    { title: 'Email remainders', ID: 4 },
    { title: 'Preview & publish', ID: 5 }
  ];

  public isEditable: boolean;

  constructor(private _selectCategoryControlServiceClient: ManageControlsService, private _loadAuditServiceClient: ManageAuditService,
    private router: Router, private _routeParameters: ActivatedRoute, private _matDialog: MatDialog, private _router: Router,
    private toastr: ToastrService) {
    this.selectCategories = new CategoryDataJson();
    this.selectedData = new LoadAuditControlData();
    this.selectCategoryData = new ManageControlsSearch();
    this.saveAuditData = new SaveAuditControl();
    this.auditControlData = new AuditControl();
    this.newauditdata=new NewAuditDetails();
    this.addauditControldata = new AddAuditControlDetails();
    this.manageAuditsSearchData = new ManageAuditsSearch();
    this.metricscontrolData = new ManageAuditMetricsControls();
    this.UpdateAuditControlMetrics = new UpdateAuditControlMetrics();
    
    this.isEditable = this._loadAuditServiceClient.isRecordEditable();
  }

  ngOnInit() {
    this.tabsets[0].active = true;
    this.checklistrowdata = null;
    this.newauditdata=null;
    this._routeParameters.params.subscribe((data) => {
      this.audit_id = data['auditID'];
      this.actionParam = data['action'];
      if(this.actionParam=='view'){
        this.isAdmin = this.actionParam == 'view' ? true : false;
     }
      this.manageAuditsSearchData.audit_id = this.audit_id;
      this._loadAuditServiceClient.getAudits(this.manageAuditsSearchData).subscribe((data: any) => {
        this.newauditdata = data;
        this.published = this.newauditdata[0].published;
        // if(this.published=='Yes'){
        //   this.isAdmin = this.published == 'Yes' ? true : false;
        //   }
        if(this.isAdmin==true){
       this.tabsets= [
          { title: 'Category & controls', ID: 1 },
          { title: 'Manage metrics', ID: 2 },
          { title: 'Manage Point of contact', ID: 3 },
          { title: 'Email remainders', ID: 4 }
        ]
      }
      this.tabsets[0].active = true;
      })
    });
   
  }
 

  SelectTab(tab: TabDirective) {
    tab.active = true;
  }

  tabactive(tabID): void {
    if (tabID == 5) {
      this.tabMenu = null;
      this.newaudit = "true";
    }
    else {
      this.tabsets[tabID].active = true;
    }
  }


}

