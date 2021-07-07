import { Component, OnInit, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageAuditService } from '../manage-audits.service';
import {GridOptions} from "@ag-grid-community/core";
import { KeyValuePairDTO } from 'src/app/Common/KeyValuePairDTO';
import { Customers, ParentCustomersSearch,AuditDetails, UpdateAuditDetailsRequest, SaveCustomerDetails, CustomerDetails, Locations, LocationDetail, SaveLocationDetails, CustomerProject, CustomerProjectDetails, SaveProjectDetails, ProjectDetail, SearchCustomerData } from '../manageAuditsClasses';
import { CustomCheckboxComponent } from '../../Custom/custom-checkbox/custom-checkbox.component'
import { parse } from 'querystring';
import { DatePipe } from '@angular/common'
import { AgGridLinkComponent } from '../ag-grid-link/ag-grid-link.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery:any;

@Component({
  selector: 'app-new-audit',
  templateUrl: './new-audit.component.html',
  styleUrls: ['./new-audit.component.css']
})
export class NewAuditComponent implements OnInit {
  @Input() PCustomer: string;
  public auditID : string;
  public gridApi;
  public gridColumnApi;
  public gridLocApi;
  public gridLocColumnApi;
  public gridProApi;
  public gridProColumnApi;
  //public selectedCustomerRow : any [];
  public selectedCustomerColumn : any [];
  public defaultselectedCustomerColDef;
  public noRowsTemplateCustomer;
  public loadingTemplateCustomer;
  //public selectedLocationRow : any [];
  public selectedLocationColumn : any [];
  public defaultselectedLocationColDef;
  public noRowsTemplateLocation;
  public loadingTemplateLocation;
  //public customerModaldisplay = "none";
  //public locationModaldisplay = "none";
  public customerRow : any [];
  public customerColumn : any [];
  public defaultCustomerColDef;
  public locationRow : any [];
  public locationColumn : any [];
  public defaultLocationColDef;
  public status : any [];
  public cusgridOptions ;
  public cusrowSelection;
  public locgridOptions ;
  public selectedLocgridOptions ;
  public locrowSelection;
  //public selectedCus : any [];
  public auditDetail : AuditDetails;
  public updateAuditDetail : UpdateAuditDetailsRequest;
  public saveCustomerDetail : SaveCustomerDetails;
  public customerDetails : Array<CustomerDetails> = [];
  public customerDetail : CustomerDetails;
  public saveLocationDetail : SaveLocationDetails;
  public locationDetails : Array<LocationDetail> = [];
  public locationDetail : LocationDetail;
  public frameworkComponents : any;
  public projectRow : any [];
  public projectColumn : any [];
  public projectrowSelection ;
  public defaultProjectColDef;
  public customerProject : CustomerProject;
  public saveProjectDetail : SaveProjectDetails;
  public projectDetails : Array<ProjectDetail> = [];
  public projectDetail : ProjectDetail;
  public searchCustomerData : SearchCustomerData;
  public projectgridOptions;
  public isView: boolean = false;
  public actionParam;

  mindate: Date;
  mindate1: Date;
  maxdate: Date;
  maxdate2: Date;
  public currentDate : Date;

  public isEditable: boolean;
  public orgData: any;

  constructor(private _router: Router,
              private _manageAuditsServiceClient : ManageAuditService,
              private _routeParameters : ActivatedRoute ,
              public datepipe: DatePipe, private _toastr: ToastrService, 
              private spinnerService: NgxSpinnerService) { 

    this.isEditable = this._manageAuditsServiceClient.isRecordEditable();
    
    this.auditDetail = new AuditDetails();
    this.cusgridOptions = <GridOptions>{
      onGridReady  : function(event){
          this.gridApi = event.api;
          this.gridColumnApi = event.columnApi;
          event.api.forEachNode(function(node){
         if(node.data.IsSelected == true) {
        node.setSelected(true);
      }
    });
      }
    }
    this.cusrowSelection = "multiple";
    this.locgridOptions = <GridOptions>{ 
      onGridReady : function(event) {
        this.gridLocApi = event.api;
        this.gridLocColumnApi = event.columnApi;
        event.api.forEachNode(function(node){
          if(node.data.IsSelected == true) {
            node.setSelected(true);
          }
        });
        }
    }
    this.locrowSelection = "multiple";
    this.projectrowSelection ="multiple";
    this.projectgridOptions = <GridOptions>{
        onGridReady : function(event) {
        this.gridProApi = event.api;
        this.gridProColumnApi = event.columnApi;
        event.api.forEachNode(function(node){
          if(node.data.IsSelected == true) {
            node.setSelected(true);
          }
        });
        }
    }
    this.updateAuditDetail = new UpdateAuditDetailsRequest();
    //this.customerDetails = <CustomerDetails>{};
    this.saveCustomerDetail = new SaveCustomerDetails();
    this.saveLocationDetail = new SaveLocationDetails();
    this.customerProject = new CustomerProject();
    this.saveProjectDetail = new SaveProjectDetails();
    this.searchCustomerData = new SearchCustomerData();
    this.frameworkComponents = {
      linkRenderer: AgGridLinkComponent
    }

    this.noRowsTemplateCustomer =
    `<span class="ag-overlay-loading-center">No customers selected. You can select one or more customers</span>`;
  this.loadingTemplateCustomer =
    `<span class="ag-overlay-loading-center">No customers selected. You can select one or more customers.</span>`;

    this.noRowsTemplateLocation =
    `<span class="ag-overlay-loading-center">No locations selected. You can select one or more locations.</span>`;
  this.loadingTemplateLocation =
    `<span class="ag-overlay-loading-center">No locations selected. You can select one or more locations.</span>`;
  }
  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.forEachNode(function(node){
  //     if(node.data.IsSelected == true) {
  //       node.setSelected(true);
  //     }
  //   });
  //   }
//     onFirstDataRendered(params) {
// console.log(params);
// console.log('bha')
//     }
    // onGridReadyLocation(params) {
    //   this.gridLocApi = params.api;
    //   this.gridLocColumnApi = params.columnApi;
    //   params.api.forEachNode(function(node){
    //     if(node.data.IsSelected == true) {
    //       node.setSelected(true);
    //     }
    //   });
    //   }

      
  
  ngOnInit() {
    this._routeParameters.params.subscribe((data) =>{
      this.auditID = data['auditID'];
      this.actionParam = data['action'];
      this.isView = this.actionParam == 'view' ? true : false;
    });
    this.currentDate = new Date();
    this.getStatus();
    this.getAuditDetails(this.auditID);
    this.selectedCustomerColumn =[
       {headerName: 'CustomerID', field: 'Customer_ID',filter:true,  minWidth: 200 },
       {headerName: 'Customer name', field: 'Customer_Name' ,filter:true, minWidth: 450},
       {headerName: 'Number of projects', field:'NoOfProjects', filter:true, sortable :true, minWidth: 300 },
       {headerName: 'Action', field: '',filter:true,  minWidth: 290,
          cellRenderer : "linkRenderer",
          cellRendererParams: {
          onClick: this.AddProjects.bind(this),
          }
        },
      ];
      this.defaultselectedCustomerColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];
     
      this.selectedLocationColumn =[
        {headerName: 'City', field: 'city',filter:true, minWidth: 400 },
        {headerName: 'Locations', field: 'Location' ,filter:true,minWidth: 840 },
        
       ];
       this.defaultselectedLocationColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];
       this.frameworkComponents = { linkRenderer: AgGridLinkComponent  };

  }
 //actual audit start data onchange event
  onValueChange(val: Date) {
    this.mindate = val;
    if(this.mindate  >  new Date(this.auditDetail.actual_audit_end_date)) 
      this.auditDetail.actual_audit_end_date = "";
  }
// pre-audit start date Onchange event
  onValueChange1(val1: Date) {
    this.mindate1 = val1; 
    if(this.mindate1  >  new Date(this.auditDetail.pre_audit_end_date)) 
      this.auditDetail.pre_audit_end_date = "";
  }
// pre-audit end date Onchange event
  onValueChange2(val2: Date) {
    this.maxdate = val2; 
    if(this.maxdate  >  new Date(this.auditDetail.actual_audit_start_date)) 
      this.auditDetail.actual_audit_start_date = "";
  }
 //actual audit End data onchange event
  // onValueChange3(val3: Date) {
  //   this.maxdate2 = val3;
  // }

    getAuditDetails(pAuditID: string) {
    //this.auditDetail = new AuditDetails();
    this.spinnerService.show()
    this._manageAuditsServiceClient.getAuditDetails(pAuditID).subscribe((data : AuditDetails) => {

      this.orgData = !this.orgData ? data : this.orgData;
      this.spinnerService.hide()
      if(data.audit_name!=null && data.audit_name!=""){
      this.auditDetail.audit_name = data.audit_name; 
      }
      this.auditDetail.parent_customer_name = data.parent_customer_name;
      this.auditDetail.parent_customer_id = data.parent_customer_id;
      if(data.pre_audit_start_date!=null &&data.pre_audit_start_date!="" && data.pre_audit_end_date!=null && data.pre_audit_end_date!="" && data.actual_audit_start_date!=null &&
       data.actual_audit_start_date!="" &&data.actual_audit_end_date!=null && data.actual_audit_end_date!=""){
      this.auditDetail.pre_audit_start_date = this.datepipe.transform(data.pre_audit_start_date, 'dd-MMM-yyyy');
      this.auditDetail.pre_audit_end_date = this.datepipe.transform(data.pre_audit_end_date, 'dd-MMM-yyyy');
      this.auditDetail.actual_audit_start_date = this.datepipe.transform(data.actual_audit_start_date, 'dd-MMM-yyyy');
      this.auditDetail.actual_audit_end_date = this.datepipe.transform(data.actual_audit_end_date, 'dd-MMM-yyyy');
      
      }
      if(data.audit_status!=null && data.audit_status!="") {
       this.auditDetail.audit_status = data.audit_status;
      }
      if(this.auditDetail.audit_status==null){
        this.auditDetail.audit_status=null;
      }
      this.auditDetail.audit_id = data.audit_id;
      //this.selectedCustomerRow = data.CustomerDetails;
      this.auditDetail.LocationDetails = data.LocationDetails;
      this.auditDetail.CustomerDetails = data.CustomerDetails;
      if(data.programme!=null && data.programme!=""){
      this.auditDetail.programme = data.programme;
      }
      });
  }

  getStatus() {
    //var selectDef = {Key : 'Select',Value : 'Select', SortOrder : null };
    this.status=null;
    var searchflag='N';
    this._manageAuditsServiceClient.getStatus(searchflag).subscribe((data :KeyValuePairDTO[]) => {
      this.status = data; 
      })
  }

  SelectCustomers() : void {
    this.customerColumn =[
      // {headerName: '', field: 'customerchecked', width: 58,editable:false,  headerCellRenderer: this.headerCellRendererSelectAll,
      // cellRendererFramework: CustomCheckboxComponent,},
      // { headerName: "", field: 'IsSelected',width: 58,editable:false, suppressSorting: true, headerCheckboxSelectionFilteredOnly :false, 
      //   headerComponentFramework: CustomHeaderCheckboxComponent ,  headerComponentParams: {
      //     onClick: this.headerCellRendererFunc.bind(this),
      //     },
      // cellRendererFramework: CustomCheckboxComponent },
      { headerName: "", field: 'IsSelected',width: 53,editable:false, suppressSorting: true, headerCheckboxSelection: true,headerCheckboxSelectionFilteredOnly :true,
        checkboxSelection : true,
        cellClass: (node) => (!this.isEditable && this._manageAuditsServiceClient.hasExistingData(this.orgData.CustomerDetails, 'Customer_ID', node.data.Customer_ID)) ? 'art-disable' : ''
      } ,
      {headerName: 'CustomerID', field: 'Customer_ID',filter:true, minWidth: 100 },
      {headerName: 'Customer name', field: 'Customer_Name' ,filter:true,minWidth: 245 },
      {headerName: 'Region', field: 'region',filter:true, minWidth: 240},
      {headerName: 'Delivery partner', field: 'delivery_partner',filter:true, minWidth: 80},
      
     ];
     this.defaultCustomerColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];

    this.searchCustomerData.parentCustomerName = this.auditDetail.parent_customer_name;
    this.searchCustomerData.p_audit_id = this.auditDetail.audit_id;
    this._manageAuditsServiceClient.getCustomers(this.searchCustomerData).subscribe((data : Customers[]) => {
      if(this.auditDetail.CustomerDetails != null) {
       // for(let x of data) {
        //data.forEach(x =>  {
          // if(this.auditDetail.CustomerDetails.filter(y=>y.Customer_ID == x.Customer_ID).length == 1 ){
          //   x.IsSelected = true;
          // }
          // else {
          //   x.IsSelected = false;
          // }
     //   }
        this.customerRow = data;
      }
      else {
        this.customerRow = data;
      }
      jQuery('#SelectCustomerpopup').modal();
      this._manageAuditsServiceClient.disableCheckbox();
      });
  }

  SaveSelectedCustomers() : void {
    this.auditDetail.CustomerDetails = this.cusgridOptions.api.getSelectedRows();
    this.customerDetails = [];
    for(let x of this.auditDetail.CustomerDetails) {
      this.customerDetail = new CustomerDetails();
      this.customerDetail.audit_id = this.auditID;
      this.customerDetail.customer_id = x.Customer_ID;
      this.customerDetail.customer_name = x.Customer_Name;
      this.customerDetail.region = x.region;
      this.customerDetail.delivery_partner = x.delivery_partner;
      this.customerDetail.parent_customer_name = this.auditDetail.parent_customer_name;
      this.customerDetail.parent_customer_id = this.auditDetail.parent_customer_id;
      this.customerDetails.push(this.customerDetail);
    }
    this.saveCustomerDetail.CustomerDetails = this.customerDetails;
    this.saveCustomerDetail.UserId ="567059";
    this.saveCustomerDetail.audit_id=this.auditID;
    this._manageAuditsServiceClient.saveCustomerDetails(this.saveCustomerDetail).subscribe((data : string) => {
      if(data == "success") 
      {
        jQuery('#SelectCustomerpopup').modal('hide');
        this.customerRow = null;
        this.getAuditDetails(this.auditID);
      }
    });
  }

  ClearSelectedCustomers() : void {
    this.cusgridOptions.api.forEachNode(function(node){
      if(node.data.IsSelected == true) {
        node.setSelected(true);
      }
      else {
        node.setSelected(false);
      }
    });
   
  }

  closeSelectCustomer() : void {
    this.customerRow = null;
    jQuery('#SelectCustomerpopup').modal('hide');
  }

  SelectLocations() : void {
    this.locationColumn =[
      // {headerName: '', field: 'IsSelected', width: 50,
      //    cellRendererFramework: CustomCheckboxComponent,
      // },
      { headerName: "", field: 'IsSelected',width: 53,editable:false, suppressSorting: true, headerCheckboxSelection: true,headerCheckboxSelectionFilteredOnly :true,
        checkboxSelection : true,
        cellClass: (node) => (!this.isEditable && this._manageAuditsServiceClient.hasExistingData(this.orgData.LocationDetails, 'Location', node.data.Location)) ? 'art-disable' : ''
      } ,
      {headerName: 'City', field: 'city',filter:true, minWidth: 205 , sortable:true},
      {headerName: 'Location', field: 'Location' ,filter:true,minWidth: 438,sortable:true },
     ];
    this.defaultLocationColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];
    this.searchCustomerData.parentCustomerName = this.auditDetail.parent_customer_name;
    this.searchCustomerData.p_audit_id = this.auditDetail.audit_id;
    this._manageAuditsServiceClient.getLocations(this.searchCustomerData).subscribe((data : Locations[]) => {
      if(this.auditDetail.LocationDetails.length > 0) {
        var loc = [];
        for(let l of this.auditDetail.LocationDetails) {
          if(l.Location.includes(';')) {
            for(let m of l.Location.split(';')) {
              loc.push(m);
            }
          }
          else {
              loc.push(l.Location);
          }
        }
        for(let x of data) {
          if(this.auditDetail.LocationDetails.filter(y=>y.city == x.city ).length == 1){
            if(loc.filter(l=>l == x.Location).length == 1 ) {
              x.IsSelected = true;
            }
            else {
              x.IsSelected = false;
            }
          }
        }
        this.locationRow = data;
      }
      else {
        this.locationRow = data;
      }
      this._manageAuditsServiceClient.disableCheckbox();
      jQuery('#SelectLocationpopup').modal();
      });
  }

  SaveSelectedLocations() : void {
    this.auditDetail.LocationDetails = this.locgridOptions.api.getSelectedRows();//this.locationRow.filter(x=>x.IsSelected == true);
    this.locationDetails = [];
    for(let x of this.auditDetail.LocationDetails) {
      this.locationDetail = new LocationDetail();
      this.locationDetail.audit_id = this.auditID;
      this.locationDetail.location = x.Location;
      this.locationDetail.city = x.city;
      this.locationDetail.parent_customer_name = this.auditDetail.parent_customer_name;
      this.locationDetail.parent_customer_id = this.auditDetail.parent_customer_id;
      this.locationDetails.push(this.locationDetail);
    }
    this.saveLocationDetail.LocationDetails = this.locationDetails;
    this.saveLocationDetail.UserId ="567059";
    this.saveLocationDetail.audit_id=this.auditID;
    this._manageAuditsServiceClient.saveLocationDetails(this.saveLocationDetail).subscribe((data : string) => {
      if(data == "success") 
      {
       //this.selectedLocgridOptions.api.refreshCells();
        jQuery('#SelectLocationpopup').modal('hide');
        this.locationRow = null;
        this.getAuditDetails(this.auditID);
      }
    });
   // this.selectedCustomerRow = this.selectedCus;
  }

  closeSelectLocation() : void {
    this.locationRow = null;
    jQuery('#SelectLocationpopup').modal('hide');
  }
  
  ClearSelectedLocations() : void {
    this.locgridOptions.api.forEachNode(function(node){
      if(node.data.IsSelected == true) {
        node.setSelected(true);
      }
      else {
        node.setSelected(false);
      }
    });
  }

  CancelNewAudit() : void {
    this._router.navigateByUrl('/Manageaudits');
  }

  NextNewAudit() : void {
    this.updateAuditDetail.p_audit_id = this.auditDetail.audit_id;
    this._router.navigateByUrl("/NewAudit/"+this.updateAuditDetail.p_audit_id+"/"+this.actionParam);
  }




  SaveAudits(eve : any) : void {
    this.updateAuditDetail.p_audit_id = this.auditDetail.audit_id;
    this.updateAuditDetail.p_audit_name = this.auditDetail.audit_name;
    this.updateAuditDetail.p_pre_audit_start_date = this.datepipe.transform(this.auditDetail.pre_audit_start_date, 'dd-MMM-yyyy');
    this.updateAuditDetail.p_pre_audit_end_date = this.datepipe.transform(this.auditDetail.pre_audit_end_date, 'dd-MMM-yyyy');
    this.updateAuditDetail.p_actual_audit_start_date= this.datepipe.transform(this.auditDetail.actual_audit_start_date, 'dd-MMM-yyyy');
    this.updateAuditDetail.p_actual_audit_end_date = this.datepipe.transform(this.auditDetail.actual_audit_end_date, 'dd-MMM-yyyy');
    this.updateAuditDetail.p_audit_status = this.auditDetail.audit_status;
    this.updateAuditDetail.p_programme = this.auditDetail.programme;    
    this.updateAuditDetail.p_user_id = sessionStorage.getItem('UserID'); //567059

    this._manageAuditsServiceClient.UpdateAudit(this.updateAuditDetail).subscribe((data : string) => {
      if(data == "success") 
      {
        if(eve.target.name == "btnSave"){
          this._toastr.success("New audit saved successfully", "success");
        } 
        if(eve.target.name == "btnSaveAndProceed"){
          if(this.auditDetail.audit_status=='Cancelled' || this.auditDetail.audit_status=='Completed'){
            this.actionParam='view';
            this._router.navigateByUrl("/NewAudit/"+this.updateAuditDetail.p_audit_id+"/"+this.actionParam)
          }
          else{
          this._router.navigateByUrl("/NewAudit/"+this.updateAuditDetail.p_audit_id);
          }
        } 
      }
      else {
        this._toastr.error("New audit not saved successfully", "error");
      }
    });
  }

  AddProjects(data: any) : void {
    const filterData = this.orgData.CustomerDetails.find((customer) => customer.Customer_ID === data.rowData.Customer_ID) || [];
    this.projectColumn =[
      // {headerName: '', field: 'IsSelected', width: 50,editable:false,
      // cellRendererFramework: CustomCheckboxComponent,},
      { headerName: "", field: 'IsSelected',width: 53,editable:false, suppressSorting: true, headerCheckboxSelection: true,headerCheckboxSelectionFilteredOnly :true,
      checkboxSelection : true,
      cellClass: (node) => (!this.isEditable && this._manageAuditsServiceClient.hasExistingData(filterData && filterData.customerProjectDetails, 'Project_Id', node.data.Project_Id)) ? 'art-disable' : ''
      } ,
      {headerName: 'Project ID', field: 'Project_Id',filter:true, minWidth: 105 },
      {headerName: 'Project name', field: 'Project_Name' ,filter:true,minWidth: 268 },
     ];
     this.defaultProjectColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];
    this.customerProject.p_parent_customer_name = this.auditDetail.parent_customer_name;
    this.customerProject.p_customer_id = data.rowData.Customer_ID;
    this.customerProject.p_customer_name = data.rowData.Customer_Name;
    this.customerProject.p_audit_id = this.auditDetail.audit_id;
    this._manageAuditsServiceClient.getProjects(this.customerProject).subscribe((data : CustomerProjectDetails[]) => {
      this.projectRow = data;
      this._manageAuditsServiceClient.disableCheckbox();
    });
    jQuery('#AddProjectspopup').modal();
  }

  ClearSelectedProjects() : void {
    // this.projectRow.filter(x=>x.IsSelected == true).map(y =>{
    //   y.IsSelected = false;
    // });
    // this.projectgridOptions.api.refreshCells();
    this.projectRow = null;
     jQuery('#AddProjectspopup').modal('hide');
     
  }

  SaveSelectedProjects() : void {
    //this.projectRow.filter(x=>x.locationChecked == true);
    this.projectDetails =[];
    for(let x of this.projectgridOptions.api.getSelectedRows()) {
      this.projectDetail = new ProjectDetail();
      this.projectDetail.audit_id = this.auditID;
      this.projectDetail.parent_customer_name = this.auditDetail.parent_customer_name;
      this.projectDetail.parent_customer_id = this.auditDetail.parent_customer_id;
      this.projectDetail.customer_id = this.customerProject.p_customer_id;
      this.projectDetail.customer_name = this.customerProject.p_customer_name;
      this.projectDetail.project_id = x.Project_Id;
      this.projectDetail.project_name = x.Project_Name;
      this.projectDetails.push(this.projectDetail);
    }
    this.saveProjectDetail.ProjectDetails = this.projectDetails;
    this.saveProjectDetail.UserId =sessionStorage.getItem('UserID')
    this.saveProjectDetail.audit_id=this.auditID;
    this.saveProjectDetail.p_customer_id = this.customerProject.p_customer_id;
    this._manageAuditsServiceClient.saveProjectDetails(this.saveProjectDetail).subscribe((data : string) => {
      if(data == "success") 
      {
       //this.selectedLocgridOptions.api.refreshCells();
        jQuery('#AddProjectspopup').modal('hide');
        this.projectRow = null;
        this.getAuditDetails(this.auditID);
      }
    });
  }
  CloseProjectPopup() {
    this.projectRow = null;
    jQuery('#AddProjectspopup').modal('hide');
  }

  NoOfProjectsCountCheck() : Boolean {
    if(this.auditDetail.CustomerDetails != null) {
      var count =0;
      for(let x of this.auditDetail.CustomerDetails) {
        if(x.NoOfProjects <= 0) {
          count = count + 1;
        }
      }
      if(count > 0) {
        return true;
      }
      else {
        return false;
      }
    }
    
  }

}
