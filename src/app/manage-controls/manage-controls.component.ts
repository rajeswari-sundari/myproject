import { Component, OnInit } from '@angular/core';
import { ManageControlsService } from './manage-controls.service';
import {GridOptions} from "@ag-grid-community/all-modules";
import { ManageControlsSearch,ManageControls,ManageCategories,ManageParentCategory,GetAuditChecklist} from './manageControlsSearch';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { CustomAGGridLinkButtonComponent } from '../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component'
import {EditCategoryControlComponent} from '../manage-controls/edit-category-control/edit-category-control.component';
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router'
import { from } from 'rxjs';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { getTreeControlMissingError } from '@angular/cdk/tree';
import { CustomTooltipComponent } from '../Custom/custom-tooltip/custom-tooltip.component'
import { EditMetricsDefinationComponent } from './edit-metrics-defination/edit-metrics-defination.component';
import { ManageMetricsControls,MetricsJonControl } from '../metrics-definition/metricsDefinitionSearch';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery:any;
@Component({
  selector: 'app-manage-controls',
  templateUrl: './manage-controls.component.html',
  styleUrls: ['./manage-controls.component.css']
})
export class ManageControlsComponent implements OnInit {
  // ParentCategory = 0;
  // Category =0;
  // ControlID : number;
  // Control : string;
  // Weightage : number;
  public manageCategories : ManageCategories;
  public ManageParentCategory:ManageParentCategory;
  public manageControlsSearchData : ManageControlsSearch ;
  public parentCategories : any[];
  public manageparentCategories:any[];
  public Categories : any[];
  public controls  : ManageControls [];
  

  public columnDefs : any [];
  public rowData : any[];
  public defaultColDef;
  public columnDefs1 : any[];
  public rowData1 : any [];
  public defaultColDef1;
  public columnDefsD : any[];
  public rowDataD : any [];
  public defaultColDefD;
  frameworkComponents: any;
  public gridOptions1;
  public tooltipShowDelay;
  public metricscontrolData : ManageMetricsControls  ;
  public metricsControlDatabind : ManageMetricsControls [] =[];
  public upateMetricsdata : MetricsJonControl;
  public  errorMessage : string;
  public tab:any;
  public overallweightage : string;
  public metricsconActual : any;

  constructor(private _manageControlsServiceClient : ManageControlsService,private router:Router,
            public toastr: ToastrService, private spinnerService: NgxSpinnerService,
            private _routeParameters : ActivatedRoute, ) {
    this.manageControlsSearchData = new ManageControlsSearch();
    this.manageCategories=new ManageCategories();
    this.metricscontrolData = new ManageMetricsControls();
    this.upateMetricsdata = new MetricsJonControl();
    this.frameworkComponents = {
      buttonRenderer: EditMetricsDefinationComponent
    }
    this.gridOptions1 = <GridOptions>{
      enableFilter: true, enableSorting: true, editable: false, enableBrowserTooltips: true, filter: "agTextColumnFilter", context: {
        componentParent: this
      }
    };
  }

  ngOnInit() {
    jQuery("#Categorypopup").modal('hide');
    jQuery("#Metricspopup").modal('hide');
    this._routeParameters.params.subscribe((data) =>{
      this.tab=data['tab'];
    });
    if(this.tab=='D'){
   this.DuringAudit();
    }
    else{
     this.PreAudit();
    }
   
    this.columnDefs = [
      {headerName: 'Parent category', field: 'parent_category_name',filter:true, sortable :false, minWidth: 225 },
      {headerName: 'Category', field: 'category_name' ,filter:true, sortable :true, minWidth: 225},
      //{headerName: 'Control ID', field: 'ControlID'},
      {headerName: 'Control', field:'control_name', filter:true, sortable :false, editable:false,  tooltipField: 'control_name', minWidth: 350,
        // cellRenderer: function(params) {
        //   // return  '<div><span>' + params.data.control_name + '</span> <button type="button" (click)="EditMetricsDefinition($event)">click</button> </div>'

        //   return  "buttonRenderer"
        // },
       // cellRenderer : 'functionopenimage'
        

       // cellRendererFramework: EditCategoryControlComponent
      },
      {headerName:'',filter:false, sortable :false, editable:false,resizable :false, maxWidth:50,
          cellRenderer : "buttonRenderer",
          cellRendererParams: {
          onClick: this.onBtnClick2.bind(this),
      }
    },
      {headerName: 'Weightage (%)', field: 'weightage',filter:false, sortable :false, minWidth:120},
      {headerName: 'Restrict Weightage Calculation' , field:'restrict_weightage_calc',filter:false, sortable :false, minWidth:150 },
      { headerName: 'Action', field: 'Action', editable: false,  filter:false, sortable :false,
      cellRendererFramework : CustomAGGridLinkButtonComponent,
        cellRendererParams: {
          linkID : 'parent_category_id'
      },

     // cellRenderer: function(params) {
        //console.log(params.data.ControlID);
        //return '<span ><a style="padding-top:10px;" [routerLink]="[\'/AddEditControl\', params.data.parent_category_id ]"  ><img src="/assets/noun-edit.png"></span>'
     //   return `<span ><a style="padding-top:10px;" [routerLink]="['/AddEditControl/', ${​​​​params.data.parent_category_id}​​​​]" ><img src="/assets/noun-edit.png"></span>`
    // },
      //cellRenderer: 'actionRenderer',
      //function(params) {  [routerLink]="/AddEditControl/'+ params.data.parent_category_id +' " 
           //return '<span><i class="material-icons">edit</i></span>'
         // return '<span><a href=\'www.google.com\' blank>edit</span>'

      //}  ,
      //cellRendererParams : function() {
      //  return '<span><i class="fa fa-edit" data-action-type="edit" (onclick)="AddorEditControl()" ></i></span>'
     // }
    }
      ];

    
   
    this.defaultColDef ={
      editable: true, sortable: true,resizable: true,filter: true, flex: 1,tooltipComponent: 'customTooltipComponent',lockPosition:true,}
      this.tooltipShowDelay = 0; 
      this.frameworkComponents = { customTooltipComponent: CustomTooltipComponent,buttonRenderer: EditMetricsDefinationComponent  };

  this.columnDefs1 = [ 
    {headerName: 'CategoryID', field: 'category_id',lockPosition: true },
    {headerName: 'Parent category', field: 'parent_category_name',lockPosition: true },
    {headerName: 'Category', field: 'category_name',lockPosition: true },
    { headerName: 'Action', field: 'Action', editable: false, lockPosition: true, filter:false, sortable :false,
    cellRendererFramework: EditCategoryControlComponent
  }];

  
  this.defaultColDefD ={
    editable: true,sortable: true, resizable: true, filter: true, flex: 1,lockPosition:true, }

  this.defaultColDef1 ={
    editable: false,sortable: false,resizable: true, filter: true,flex: 1,lockPosition:true,}

  }

  GetManageControls(manageControlsSearchData){
    this.spinnerService.show()
 this._manageControlsServiceClient.getControls(manageControlsSearchData).subscribe((data: ManageControls[]) => {
      this.controls = data;
      this.rowData = data;
      this.spinnerService.hide()
      this.overallweightage = this.controls[0].overallweightage;
      
  });
  }

  numberOnly(event)  {
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

  onBtnClick2(e : any) {
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
    this.metricscontrolData.need_improvement_percentRange2  = null;
    this.metricscontrolData.partially_ready_percentRange1 = null;
    this.metricscontrolData.partially_ready_percentRange2= null;
    this.metricscontrolData.audit_ready_percentRange1 = null;
    this.metricscontrolData.audit_ready_percentRange2 = null;
    if(this.metricscontrolData.metrics_type == 'Number')
    {
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
 
  SaveMetricsDefinition() {

    if(this.MetricsDefinitionValidation()) {
      if(this.metricscontrolData.metrics_type == 'Number'){
        this.metricscontrolData.cliff_percent = this.metricscontrolData.cliff_percentNumber.toString();
        this.metricscontrolData.need_improvement_percent = this.metricscontrolData.need_improvement_percentNumber.toString();
        this.metricscontrolData.partially_ready_percent = this.metricscontrolData.partially_ready_percentNumber.toString();
        this.metricscontrolData.audit_ready_percent = this.metricscontrolData.audit_ready_percentNumber.toString();
      }
      else {
        this.metricscontrolData.cliff_percent = this.metricscontrolData.cliff_percentRange1.toString() + "-" + this.metricscontrolData.cliff_percentRange2.toString();
        this.metricscontrolData.need_improvement_percent = this.metricscontrolData.need_improvement_percentRange1.toString() + "-" + this.metricscontrolData.need_improvement_percentRange2.toString() ;
        this.metricscontrolData.partially_ready_percent = this.metricscontrolData.partially_ready_percentRange1.toString() + "-" + this.metricscontrolData.partially_ready_percentRange2.toString();
        this.metricscontrolData.audit_ready_percent = this.metricscontrolData.audit_ready_percentRange1.toString() + "-" + this.metricscontrolData.audit_ready_percentRange2.toString();
      }

      this.metricsControlDatabind[0] = this.metricscontrolData;
      this.upateMetricsdata = new MetricsJonControl();
      this.upateMetricsdata.updatemetric= this.metricsControlDatabind;
      console.log(this.upateMetricsdata);
      this._manageControlsServiceClient.UpdateManageMetrics(this.upateMetricsdata).subscribe((data) => {
        if (data == "failure") {
          this.toastr.error("Metrics defined failed for the " + this.metricscontrolData.control_name);
          return;
        } else {
          this.toastr.success("Metrics defined successfully for the " + this.metricscontrolData.control_name,'Success', { enableHtml: true });
          this.closeMetrics();
          this.GetManageControls(this.manageControlsSearchData);
        }
      });
    }
    // else {
    //   this.toastr.error("Readiness type value is invalid", 'error');
    //   return;
    // }

  }
  closeMatrics(){
    jQuery("#Metricspopup").modal('hide');
  }

  MetricsDefinitionValidation() : boolean {
    this.errorMessage = null;
    if(this.metricscontrolData.metrics_type == 'Number'){
      if((this.metricscontrolData.cliff_percentNumber != null && this.metricscontrolData.cliff_percentNumber.toString() != '') 
        && (this.metricscontrolData.need_improvement_percentNumber != null && this.metricscontrolData.need_improvement_percentNumber.toString() != '')
        && (this.metricscontrolData.partially_ready_percentNumber != null &&  this.metricscontrolData.partially_ready_percentNumber.toString() != '' )
         && (this.metricscontrolData.audit_ready_percentNumber != null  && this.metricscontrolData.audit_ready_percentNumber.toString() != '' )
         &&(Number(this.metricscontrolData.cliff_percentNumber) < Number(this.metricscontrolData.need_improvement_percentNumber))
        && ( Number(this.metricscontrolData.need_improvement_percentNumber) < Number(this.metricscontrolData.partially_ready_percentNumber) )
        && ( Number(this.metricscontrolData.partially_ready_percentNumber) < Number(this.metricscontrolData.audit_ready_percentNumber) )
        && (this.metricscontrolData.audit_ready_percentNumber <= 100))
          {
              return true;
          }
          else {
            this.toastr.error("Readiness type value is invalid.",'error', { enableHtml: true });
            //this.errorMessage = "Readiness type value is invalid."
              return false;
          }
    }
    else {
      if( (this.metricscontrolData.cliff_percentRange1 != null && this.metricscontrolData.cliff_percentRange1.toString() != '') 
        && (this.metricscontrolData.cliff_percentRange2 != null && this.metricscontrolData.cliff_percentRange2.toString() != '')
        && (this.metricscontrolData.need_improvement_percentRange1 != null && this.metricscontrolData.need_improvement_percentRange1.toString() != '')
        && (this.metricscontrolData.need_improvement_percentRange2 != null && this.metricscontrolData.need_improvement_percentRange2.toString() != '')
        && (this.metricscontrolData.partially_ready_percentRange1 != null &&  this.metricscontrolData.partially_ready_percentRange1.toString() != '')
        && (this.metricscontrolData.partially_ready_percentRange2 != null && this.metricscontrolData.partially_ready_percentRange2.toString() != '')
        && (this.metricscontrolData.audit_ready_percentRange1 != null && this.metricscontrolData.audit_ready_percentRange1.toString() != '' )
        && (this.metricscontrolData.audit_ready_percentRange2 != null && this.metricscontrolData.audit_ready_percentRange2.toString() != '' )
        && (Number(this.metricscontrolData.cliff_percentRange1) < Number(this.metricscontrolData.cliff_percentRange2))
          && Number(this.metricscontrolData.cliff_percentRange2) < Number(this.metricscontrolData.need_improvement_percentRange1)
          && Number(this.metricscontrolData.need_improvement_percentRange1) < Number(this.metricscontrolData.need_improvement_percentRange2)
          && Number(this.metricscontrolData.need_improvement_percentRange2) < Number(this.metricscontrolData.partially_ready_percentRange1)
          && Number(this.metricscontrolData.partially_ready_percentRange1)  < Number(this.metricscontrolData.partially_ready_percentRange2)
          && Number(this.metricscontrolData.partially_ready_percentRange2)  < Number(this.metricscontrolData.audit_ready_percentRange1)
          && Number(this.metricscontrolData.audit_ready_percentRange1) < Number(this.metricscontrolData.audit_ready_percentRange2)
          && Number(this.metricscontrolData.audit_ready_percentRange2) <= 100)
      {
         return true;
      }
      else {
        this.toastr.error("Readiness type value is invalid.", 'error', { enableHtml: true });
        //this.errorMessage = "Readiness type value is invalid."
        return false;
      }
    }
  }



  ResetMetrics() : void {
    this.metricscontrolData.cliff_percentNumber = null;
    this.metricscontrolData.need_improvement_percentNumber = null;
    this.metricscontrolData.partially_ready_percentNumber = null;
    this.metricscontrolData.audit_ready_percentNumber = null;
    this.metricscontrolData.cliff_percentRange1 = null;
    this.metricscontrolData.cliff_percentRange2 = null;
    this.metricscontrolData.need_improvement_percentRange1 = null;
    this.metricscontrolData.need_improvement_percentRange2  = null;
    this.metricscontrolData.partially_ready_percentRange1 = null;
    this.metricscontrolData.partially_ready_percentRange2= null;
    this.metricscontrolData.audit_ready_percentRange1 = null;
    this.metricscontrolData.audit_ready_percentRange2 = null;

    if(this.metricsconActual == 'Number'){
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



  LoadCategory()
  {
    this.Categories=null;
    this.manageControlsSearchData.CategoryID=0;
    if(this.manageControlsSearchData.ParentCategoryID>0){    
    this._manageControlsServiceClient.getCategory(this.manageControlsSearchData).subscribe((data : KeyValuePairDTO[]) => {
    this.Categories =data;
    console.log(this.Categories);
    });
  }
  }

  SearchControls() : void {
    //console.log('nn');
    // this._manageControlsServiceClient.getControls(this.manageControlsSearchData).subscribe((data: any[]) => {
    //     this.rowData = data;
    //    console.log(data);
    // });
    this.GetManageControls(this.manageControlsSearchData);
    //'<span><a href=\'AddEditControl\' >edit</span>'

  }

  ResetControls() :void {
    this.Categories=null;
    this.parentCategories=null;
    this.manageControlsSearchData.ParentCategoryID = 0;
    this.manageControlsSearchData.CategoryID =0;
    this.manageControlsSearchData.Control = '';
    this.manageControlsSearchData.Weightage = null;
    this.GetManageControls(this.manageControlsSearchData);
    this._manageControlsServiceClient.getParentCategory().subscribe((data : KeyValuePairDTO[]) => {
      this.parentCategories = data; 
    }); 
  }


  ManageCategory(){
    jQuery("#Categorypopup").modal();
    this.manageparentCategories=null;
    this.manageCategories.Hasparent="Yes";
    jQuery("#ParentID").show(); 
    this.manageCategories.parent_category_id=null;
    this._manageControlsServiceClient.getManageParentCategory().subscribe((data :ManageParentCategory[]) => {
    this.manageparentCategories = data; 
    })
    this._manageControlsServiceClient.getmanagecategoryList().subscribe((data:ManageCategories[])=>{
    this.rowData1=data;
    })
    }
    manageparent(){
    if(this.manageparentCategories!=null){
    jQuery("#laberrpar").text("");
    jQuery("#Parent").css('border-color', '');
    }
    }
    changecategory(value){
      this.manageCategories.category_name=value;
      if(this.manageCategories.category_name!=null || this.manageCategories.category_name!='')
      {
        jQuery("#laberrcat").text("");
        jQuery("#category").css('border-color', '');
      }
    }
    radioParent(){    
    if(this.manageCategories.Hasparent=="No"){
    jQuery("#ParentID").hide(); }
    else   {
    jQuery("#ParentID").show();
    jQuery("#laberrpar").text("");  }
    }
    SaveCategory()
    {
    this.manageCategories.category_name=jQuery("#category").val();
   
    if(!this.manageCategories.category_name.replace(/\s/g, '').length)
    {
      this.manageCategories.category_name=null;
      
    }
    if(this.manageCategories.category_name=="" || this.manageCategories.category_name==null || this.manageCategories.parent_category_id==null && this.manageCategories.Hasparent=='Yes') 
    {
    if(this.manageCategories.category_name=="" && this.manageCategories.parent_category_id==null){
    jQuery("#laberrcat").text("Category is required");
    jQuery("#category").css('border-color', 'red');
    jQuery("#laberrpar").text("ParentCategory is required");
    jQuery("#Parent").css('border-color', 'red');}
    else if(this.manageCategories.parent_category_id==null && this.manageCategories.Hasparent=='Yes' && this.manageCategories.category_name==null){
      jQuery("#laberrcat").text("Category is required");
      jQuery("#category").css('border-color', 'red');
      jQuery("#laberrpar").text("ParentCategory is required");
      jQuery("#Parent").css('border-color', 'red');
    }
    else if(this.manageCategories.parent_category_id==null && this.manageCategories.Hasparent=='Yes'){
    jQuery("#laberrcat").text("");
    jQuery("#category").css('border-color', '');
    jQuery("#Parent").css('border-color', 'red');
    jQuery("#laberrpar").text("ParentCategory is required");}
    else if(this.manageCategories.Hasparent=='No' && this.manageCategories.category_name==null ){
      jQuery("#category").css('border-color', 'red');
      jQuery("#laberrcat").text("Category is required");
      jQuery("#Parent").css('border-color', 'red');
      jQuery("#laberrpar").text("");
    }
     else{
    jQuery("#laberrcat").text("Category is required");
    jQuery("#category").css('border-color', 'red');
    jQuery("#Parent").css('border-color', '');
    jQuery("#laberrpar").text("");}
    }
    else{
    jQuery("#laberrcat").text("");
    jQuery("#laberrpar").text("");
    jQuery("#category").css('border-color', '');
    jQuery("#Parent").css('border-color', '');
    if(this.manageCategories.Hasparent=="No"){
    if(this.manageCategories.parent_category_id!=0)
    {
        this.manageCategories.parent_category_id;
        this.manageCategories.parent_category_name=null;
    }
    else{
    this.manageCategories.parent_category_id=null;
    this.manageCategories.parent_category_name=null;
    }
    }
    else
    {
    this.manageCategories.category_name;
    this.manageCategories.parent_category_id;
    this.manageCategories.parent_category_name=jQuery('#ParentID option:selected').text();
    }
    this._manageControlsServiceClient.saveManageCategory(this.manageCategories).subscribe((data : any) => {
    if (data == "failure") {
      var msg=false;
      var msgc=true;
      if(this.manageCategories.category_name!=null && this.manageCategories.parent_category_name==null){
      msg= this.rowData1.some(d=>d['parent_category_name'].toLowerCase().includes(this.manageCategories.category_name.trim().toLowerCase()));
      }
      else if(this.manageCategories.parent_category_name!=null && this.manageCategories.category_name!=null){   
      msg=this.rowData1.some(d=>d['parent_category_name'].toLowerCase().includes(this.manageCategories.parent_category_name.trim().toLowerCase()));
      msgc=this.rowData1.some(d=>d['category_name'].toLowerCase().includes(this.manageCategories.category_name.trim().toLowerCase()));
      }
      console.log(msg);
     if(msg==true && msgc==true)
     {
      this.toastr.error("Category already Exists", 'error');
     }
     else{
      this.toastr.error("Invalid data,Unable to Update", 'error'); 
     }
    } else if(data == "success") {
    this.toastr.success("Category Saved Successfully" ,'Success', { enableHtml: true });
    this._manageControlsServiceClient.getmanagecategoryList().subscribe((data:ManageCategories[])=>{
      this.rowData1=data;
    })
    }
    else{
      this.toastr.error("Data Issue,Unable to Update", 'error'); 
    }
    jQuery("#category").val('');
    this.manageCategories.parent_category_id=null;
    this.manageCategories.category_id=null;
    })
    }
   
    }
    
    
    
    EditCategory(data,index)
    {
    jQuery("#laberrcat").text("");
    jQuery("#laberrpar").text("");
    if(data.category_id!=null || data.category_id!="")
    {
    if(data.category_id!=0){
    jQuery("#ParentID").show();
    this.manageCategories.Hasparent="Yes";
    jQuery("#category").val(data.category_name);
    this.manageCategories.category_name=data.category_name;
    this.manageCategories.category_id=data.category_id;
    this.manageCategories.parent_category_id=data.parent_category_id;
    }
    else{ 
    this.manageCategories.Hasparent="No";
    jQuery("#category").val(data.parent_category_name);
    this.manageCategories.parent_category_id=data.parent_category_id;
    jQuery("#ParentID").hide();
    }
    }
    else{
    this.manageCategories.Hasparent="No";
    jQuery("#category").val(data.parent_category_name);
    this.manageCategories.parent_category_id=data.parent_category_id;
    jQuery("#ParentID").hide();
    }
    }
    ResetCategory(){
    if(this.manageCategories.Hasparent=="No"){
    jQuery("#ParentID").hide();}
    else{
    jQuery("#ParentID").show();
    }
    jQuery("#category").val('');
    this.manageCategories.parent_category_id=null;
    jQuery("#laberrcat").text("");
    jQuery("#laberrpar").text("");
    jQuery("#category").css('border-color', '');
    jQuery("#Parent").css('border-color', '');
    }
    closeCategory(){
    jQuery("#Categorypopup").modal('hide');
    this.manageCategories.parent_category_id=null;
    jQuery("#category").val('');
    jQuery("#laberrcat").text("");
    jQuery("#laberrpar").text("");
    jQuery("#category").css('border-color', '');
    jQuery("#Parent").css('border-color', '');
    this.ResetControls();
    }

  AddMetricsDefinition() : void {
    this.router.navigateByUrl('/MetricsDefinition');
  }

  closeMetrics() {
    jQuery("#Metricspopup").modal('hide');
    this.metricscontrolData.metrics_type = this.metricsconActual;
  }

  PreAudit()
  {
    jQuery("#tab-1").show();
    jQuery("#tab-2").hide();
    jQuery("#preaudit").addClass('active');
    jQuery("#duringaudit").removeClass('active');
    this.manageControlsSearchData.ParentCategoryID=0;
    this.manageControlsSearchData.CategoryID=0;
    this._manageControlsServiceClient.getParentCategory().subscribe((data : KeyValuePairDTO[]) => {
      this.parentCategories = data; 
    }); 
    this.GetManageControls(this.manageControlsSearchData);
  }
  DuringAudit()
  {
   jQuery("#preaudit").removeClass('active');
   jQuery("#duringaudit").addClass('active');
   jQuery("#tab-1").hide();
   jQuery("#tab-2").show();
   this.columnDefsD = [ 
    {headerName: 'Category', field: 'audit_category_name',maxWidth: 250 ,editable: false,  filter:true, sortable :false },
    {headerName:'CheckList Items',field:'audit_checklist',minWidth: 150,editable: false,  filter:true, sortable :false},
    { headerName: 'Action', field: 'Action',maxWidth: 100, editable: false,  filter:false, sortable :false,
  //   cellRenderer: function(params) {
  //     return '<span><a href="AddEditCheckList/'+ params.data.audit_category_id + '" ><img src="/assets/noun-edit.png"></span>'
  //  },
  cellRendererFramework : CustomAGGridLinkButtonComponent,
  cellRendererParams: {
    linkID : 'audit_category_id'
  },
  }];
  this.spinnerService.show()
   this._manageControlsServiceClient.getDuringAuditCheckList().subscribe((data: GetAuditChecklist[]) => {
    this.rowDataD = data;
    this.spinnerService.hide()
    })
  }
}
