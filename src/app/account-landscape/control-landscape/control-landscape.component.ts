import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControlLandscapeService } from './control-landscape.service';
import { GridOptions } from "@ag-grid-community/all-modules";
import { ManageControlsSearch, ManageControls, ManageCategories, ManageParentCategory, GetAuditChecklist } from './controlLandscapeClass';
import { KeyValuePairDTO } from '../../Common/KeyValuePairDTO';
import { CustomAGGridLinkButtonComponent } from '../../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component'
import { ControlEditComponent } from './control-edit-category/control-edit-category.component';
import { ActivatedRoute, Router } from '@angular/router'
import { from } from 'rxjs';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { getTreeControlMissingError } from '@angular/cdk/tree';
import { CustomTooltipComponent } from '../../Custom/custom-tooltip/custom-tooltip.component'
// import { EditMetricsDefinationComponent } from './edit-metrics-defination/edit-metrics-defination.component';
import { ManageMetricsControls, MetricsJonControl } from '../../metrics-definition/metricsDefinitionSearch';
import { ToastrService } from 'ngx-toastr';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jQuery: any;

@Component({
  selector: 'app-control-landscape',
  templateUrl: './control-landscape.component.html',
  styleUrls: ['./control-landscape.component.css']
})
export class ControlLandscapeComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  // @ViewChild("tabset", { static: true }) tabset: TabsetComponent;

  public manageCategories: ManageCategories;
  public ManageParentCategory: ManageParentCategory;
  public manageControlsSearchData: ManageControlsSearch;
  public parentCategories: any[];
  public manageparentCategories: any[];
  public Categories: any[];
  public controls: ManageControls[];

  public Controlcolumn: any[];
  public columnDefs: any[];
  public rowData: any[];
  public defaultColDef;
  public columnDefs1: any[];
  public rowData1: any[];
  public defaultColDef1;
  public columnDefsD: any[];
  public rowDataD: any[];
  public defaultColDefD;
  frameworkComponents: any;
  public gridOptions1;
  public gridOptions2;
  public tooltipShowDelay;
  public metricscontrolData: ManageMetricsControls;
  public metricsControlDatabind: ManageMetricsControls[] = [];
  public upateMetricsdata: MetricsJonControl;
  public errorMessage: string;
  public totalvalue: number;
  public tab: any;
  public overallweightage: string;
  public metricsconActual: any;

  constructor(private _manageControlsServiceClient: ControlLandscapeService, private _router: Router,
    public toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private _routeParameters: ActivatedRoute,) {
    this.manageControlsSearchData = new ManageControlsSearch();
    this.manageCategories = new ManageCategories();
    this.metricscontrolData = new ManageMetricsControls();
    this.upateMetricsdata = new MetricsJonControl();
    /*
    this.frameworkComponents = {
    buttonRenderer: EditMetricsDefinationComponent
    }
    */
    this.gridOptions1 = <GridOptions>{
      enableFilter: true, enableSorting: true, editable: false, enableBrowserTooltips: true, filter: "agTextColumnFilter", context: {
        componentParent: this
      }
    };
  }

  ngOnInit() {
    this._router.navigateByUrl('/Accountlandscape/1');
    jQuery("#Categorypopup").modal('hide');
    jQuery("#Metricspopup").modal('hide');
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    }
        this.Controlcolumn = [
          {headerName: 'Parent category', field: 'parent_category_name',minWidth: 270, },
          {headerName: 'Category', field: 'category_name' , sortable :true, comparator: customComparator,  minWidth: 275,},
          {headerName: 'Control', field:'control_name',  minWidth: 300, },        
          {headerName: 'Weightage (%)', field: 'weightage', minWidth:100},      
          { headerName: 'Action', field: 'Action', filter : false,
          cellRendererFramework : ControlEditComponent,
            cellRendererParams: {
              linkID : 'parent_category_id'
          },
        }
      ];    
   
    this.defaultColDef ={
      editable: false, sortable: false,resizable: true,filter: true, flex: 1,lockPosition:true,}
      // this.frameworkComponents = { customTooltipComponent: CustomTooltipComponent,buttonRenderer: EditMetricsDefinationComponent  };

    this.columnDefs1 = [

      { headerName: 'Parent category', field: 'parent_category_name', lockPosition: true },
      { headerName: 'Category', field: 'category_name', lockPosition: true },
      { headerName: 'Short name', field: 'category_short_name', lockPosition: true },
      { headerName: 'Key Indicator(%)', field: 'key_indicator_percent', lockPosition: true },
      { headerName: 'Compliance Indicator (%)', field: 'compliance_indicator_percent', lockPosition: true },
      {
        headerName: 'Action', field: 'Action', editable: false, lockPosition: true, filter: false, sortable: false,
        cellRendererFramework: ControlEditComponent,
        cellRendererParams: {
          linkID: 'edit_category'
        },
      }];


    this.defaultColDefD = {
      editable: true, sortable: true, resizable: true, filter: true, flex: 1, lockPosition: true,
    }

    this.defaultColDef1 = {
      editable: false, sortable: false, resizable: true, filter: true, flex: 1, lockPosition: true,
    }


    this.manageControlsSearchData.ParentCategoryID = 0;
    this.manageControlsSearchData.CategoryID = 0;

    this._manageControlsServiceClient.getParentCategory().subscribe((data: KeyValuePairDTO[]) => {
      this.parentCategories = data;
    });
    this.GetManageControls(this.manageControlsSearchData);
  }

  LoadCategory() {
    this.Categories = null;
    this.manageControlsSearchData.CategoryID = 0;
    if (this.manageControlsSearchData.ParentCategoryID > 0) {
      this._manageControlsServiceClient.getCategory(this.manageControlsSearchData).subscribe((data: KeyValuePairDTO[]) => {
        this.Categories = data;
        console.log(this.Categories);
      });
    }
  }

  GetManageControls(manageControlsSearchData) {
    this.spinnerService.show()
    this._manageControlsServiceClient.getControls(manageControlsSearchData).subscribe((data: ManageControls[]) => {
      this.controls = data;
      this.rowData = data;
      this.spinnerService.hide()
      // this.overallweightage = this.controls[0].overallweightage;
    });
  }

  SearchControls(): void {
    this.GetManageControls(this.manageControlsSearchData);

  }
  ResetControls(): void {
    this.Categories = null;
    this.parentCategories = null;
    this.manageControlsSearchData.ParentCategoryID = 0;
    this.manageControlsSearchData.CategoryID = 0;
    this.manageControlsSearchData.Control = '';
    // this.manageControlsSearchData.Weightage = null;
    this.GetManageControls(this.manageControlsSearchData);
    this._manageControlsServiceClient.getParentCategory().subscribe((data: KeyValuePairDTO[]) => {
      this.parentCategories = data;
    });
  }



  //////////// Manage Categories starts here ///////

  ManageCategory() {
    jQuery("#Categorypopup").modal();
    this.manageparentCategories = null;
    this.manageCategories.Hasparent = "Yes";
    jQuery("#ParentID").show();
    jQuery("#complianceindicator").show();
    jQuery("#keyindicator").show();
    jQuery("#sname").show();
    this.manageCategories.key_indicator_percent = null;
    this.manageCategories.compliance_indicator_percent = null;
    this.manageCategories.parent_category_id = null;
    this.manageCategories.category_short_name = null;
    this._manageControlsServiceClient.getManageParentCategory().subscribe((data: ManageParentCategory[]) => {
      this.manageparentCategories = data;
    })
    this._manageControlsServiceClient.getmanagecategoryList().subscribe((data: ManageCategories[]) => {
      this.rowData1 = data;
      for (let x of this.rowData1) {
        if (x.category_id == 0) {
          x.key_indicator_percent = 'NA'
          x.compliance_indicator_percent = 'NA'
          x.category_short_name = 'NA'
          x.category_name = 'NA'

        }

      }
    })
  }

  radioParent() {
    if (this.manageCategories.Hasparent == "No") {
      jQuery("#ParentID").hide();
      jQuery("#complianceindicator").hide();
      jQuery("#keyindicator").hide();
      jQuery("#sname").hide();
  
    }
    else {  
      jQuery("#ParentID").show();      
      jQuery("#complianceindicator").show();
      jQuery("#keyindicator").show();
      jQuery("#sname").show(); 
      // this.manageCategories.category_name = null;
      // this.ManageCategory()

    }

  }

  validateIndicator() {

    this.totalvalue = 0;
    this.totalvalue = Number(this.manageCategories.key_indicator_percent) + Number(this.manageCategories.compliance_indicator_percent);
    if (this.totalvalue == 100 || this.manageCategories.Hasparent == 'No') {
      return true;
    } else {
      this.toastr.error("Sum of Compliance and Key Indicator should be equal to 100", 'error');
    }
  }



  SaveCategory() {
    this.manageCategories.category_name = jQuery("#category").val();

    if (!this.manageCategories.category_name.replace(/\s/g, '').length) {
      this.manageCategories.category_name = null;

    }
    if (this.manageCategories.category_name == "" || this.manageCategories.category_name == null || this.manageCategories.parent_category_id == null && this.manageCategories.Hasparent == 'Yes') {
      if (this.manageCategories.category_name == "" && this.manageCategories.parent_category_id == null) {
        jQuery("#laberrcat").text("Category is required");
        jQuery("#category").css('border-color', 'red');
        jQuery("#laberrpar").text("ParentCategory is required");
        jQuery("#parent_category_id").css('border-color', 'red');
      }
      else if (this.manageCategories.parent_category_id == null && this.manageCategories.Hasparent == 'Yes' && this.manageCategories.category_name == null) {
        jQuery("#laberrcat").text("Category is required");
        jQuery("#category").css('border-color', 'red');
        jQuery("#laberrpar").text("ParentCategory is required");
        jQuery("#parent_category_id").css('border-color', 'red');
      }
      else if (this.manageCategories.parent_category_id == null && this.manageCategories.Hasparent == 'Yes') {
        jQuery("#laberrcat").text("");
        jQuery("#category").css('border-color', '');
        jQuery("#parent_category_id").css('border-color', 'red');
        jQuery("#laberrpar").text("ParentCategory is required");
      }
      else if (this.manageCategories.Hasparent == 'No' && this.manageCategories.category_name == null) {
        jQuery("#category").css('border-color', 'red');
        jQuery("#laberrcat").text("Category is required");
        jQuery("#parent_category_id").css('border-color', 'red');
        jQuery("#laberrpar").text("");
      }
      else {
        jQuery("#laberrcat").text("Category is required");
        jQuery("#category").css('border-color', 'red');
        jQuery("#parent_category_id").css('border-color', '');
        jQuery("#laberrpar").text("");
      }
    }
    else {
      // if all validation is success enter here
     
      if (this.manageCategories.Hasparent == "No") {
        if (this.manageCategories.parent_category_id != 0) {
          this.manageCategories.parent_category_id;
          this.manageCategories.parent_category_name = null;
        }
        else {
          this.manageCategories.parent_category_id = null;
          this.manageCategories.parent_category_name = null;
        }
      }
      else {
        this.manageCategories.category_name;
        this.manageCategories.parent_category_id;
        this.manageCategories.parent_category_name = jQuery('#ParentID option:selected').text();
      }
      this.manageCategories.userId = sessionStorage.getItem('UserID');
      if (this.validateIndicator()) {
        this._manageControlsServiceClient.saveManageCategory(this.manageCategories).subscribe((data: any) => {
          if (data == "failure") {
            var msg = false;
            var msgc = true;
            if (this.manageCategories.category_name != null && this.manageCategories.parent_category_name == null) {
              msg = this.rowData1.some(d => d['parent_category_name'].toLowerCase().includes(this.manageCategories.category_name.trim().toLowerCase()));
            }
            else if (this.manageCategories.parent_category_name != null && this.manageCategories.category_name != null) {
              msg = this.rowData1.some(d => d['parent_category_name'].toLowerCase().includes(this.manageCategories.parent_category_name.trim().toLowerCase()));
              msgc = this.rowData1.some(d => d['category_name'].toLowerCase().includes(this.manageCategories.category_name.trim().toLowerCase()));
            }
            console.log(msg);
            if (msg == true && msgc == true) {
              this.toastr.error("Category already Exists", 'error');
            }
            else {
              this.toastr.error("Invalid data,Unable to Update", 'error');
            }
          } else if (data == "success") {
            this.toastr.success("Category Saved Successfully", 'Success', { enableHtml: true });
            this._manageControlsServiceClient.getmanagecategoryList().subscribe((data: ManageCategories[]) => {
              this.rowData1 = data;
              this.gridOptions1.api.refreshCells();
              for (let x of this.rowData1) {
                if (x.category_id == 0) {
                  x.key_indicator_percent = 'NA'
                  x.compliance_indicator_percent = 'NA'
                  x.category_short_name = 'NA'
                  x.category_name = 'NA'

                }

              }

            })
          }
          else {
            this.toastr.error("Data Issue,Unable to Update", 'error');
          }
          jQuery('#catpop')[0].reset();
          jQuery("#parentyes").prop("checked", true);
          this.ManageCategory()
        })

      }
      // toster validation endsher

    }

  }


  EditCategory(data, index) {    
    if (data.category_id != null || data.category_id != "") {    
      if (data.category_id != 0) {  // category use case
        jQuery("#ParentID").show();
        jQuery("#keyindicator").show();
        jQuery("#complianceindicator").show();
        jQuery("#sname").show();


        this.manageCategories.Hasparent = "Yes";
        this.manageCategories.category_name = data.category_name;
        this.manageCategories.category_id = data.category_id;
        this.manageCategories.parent_category_id = data.parent_category_id;
        this.manageCategories.parent_category_name = data.parent_category_name;
        this.manageCategories.compliance_indicator_percent = data.compliance_indicator_percent;
        this.manageCategories.key_indicator_percent = data.key_indicator_percent;
        this.manageCategories.category_short_name = data.category_short_name;
        this.manageCategories.userId = sessionStorage.getItem('UserID');

      }
      else {  //  parent category use case
        this.manageCategories.Hasparent = "No";
        // jQuery("#category").val(data.parent_category_name);
        this.manageCategories.category_name = data.parent_category_name;
        this.manageCategories.parent_category_id = data.parent_category_id;
         this.manageCategories.category_id = data.category_id;         
         this.manageCategories.parent_category_name = data.parent_category_name;
         this.manageCategories.compliance_indicator_percent = null;
         this.manageCategories.key_indicator_percent = null;
         this.manageCategories.category_short_name = null;
         this.manageCategories.userId = sessionStorage.getItem('UserID');
        jQuery("#ParentID").hide();
        jQuery("#complianceindicator").hide();
        jQuery("#keyindicator").hide();
        jQuery("#sname").hide();
      }
    }
    else { // parent category use case
      this.manageCategories.Hasparent = "No";
      jQuery("#category").val(data.parent_category_name);
       this.manageCategories.parent_category_id = data.parent_category_id;
      // this.manageCategories.category_name = data.parent_category_name;
      jQuery("#ParentID").hide();
      jQuery("#complianceindicator").hide();
      jQuery("#keyindicator").hide();
      jQuery("#sname").hide();

    }
  }

  ResetCategory() {
    jQuery('#catpop')[0].reset();
    jQuery("#parentyes").prop("checked", true);      
    this.ManageCategory();
    /* - QA change
    if (this.manageCategories.Hasparent == "Yes") {      
      jQuery('#catpop')[0].reset();
      jQuery("#parentyes").prop("checked", true);      
      this.ManageCategory();
    }
    else {
      this.manageCategories.category_name = null;
    }
    */
  }

  mandatecategoryfield() {
    //if (!(value.replace(/\s/g, '').length)) {
      if(this.manageCategories.category_name.trim().length == 0){   
        return true     
      }    
      else{
        return false;
      }  
    }
    mandatefields() {
      //if (!(value.replace(/\s/g, '').length)) {
        if(this.manageCategories.category_name.trim().length == 0 
        || this.manageCategories.category_short_name.trim().length == 0){   
          return true     
        }    
        else{
          return false;
        }  
      }
  

  closeCategory() {
    jQuery("#Categorypopup").modal('hide');
    jQuery('#catpop')[0].reset();
    this.ResetControls();

  }

  MetricsDefinition() {
    this._router.navigateByUrl('Definitionlandscape');
  }
}
