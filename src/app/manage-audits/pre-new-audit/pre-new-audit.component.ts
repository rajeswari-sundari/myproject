import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {ManageAuditService} from '../manage-audits.service';
import { KeyValuePairDTO } from '../../common/KeyValuePairDTO';
import { ParentCustomersSearch,ParentCustomers, AddNewAudit, SavedAudit} from '../manageAuditsClasses';
import {GridOptions} from "@ag-grid-community/all-modules";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pre-new-audit',
  templateUrl: './pre-new-audit.component.html',
  styleUrls: ['./pre-new-audit.component.css']
})
export class PreNewAuditComponent implements OnInit {
  //@Output() PCustomer=new EventEmitter(); 
  public departments : any[];
  public parentCustomerRow : any [];
  public parentCustomerColumn : any [];
  public defaultParentCustomerColDef;
  public parentCustomersSearchData : ParentCustomersSearch;
  public showParentCustomergird : boolean = false;
  public showProceed: boolean = false;
  public gridOptions ;
  public rowSelection;
  public checkParentCustomerData : any;
  public PCustomer : string;
  public addNewAudit : AddNewAudit;
  public auditID : number;
  //public ParentCustomer : string;

  constructor(private _manageAuditsServiceClient : ManageAuditService, private router : Router,
    private spinnerService: NgxSpinnerService) { 
    this.parentCustomersSearchData = new ParentCustomersSearch();
    this.addNewAudit = new  AddNewAudit();
    this.gridOptions = <GridOptions>{ }
    this.rowSelection = "single";
    this._manageAuditsServiceClient.removePreviewData();
  }

  ngOnInit() {
    this.parentCustomersSearchData.p_classification = 'Vertical';
    this.loadDepartments();
    //this.PCustomer = 'bharath';
    //this.loadDepartments();
    //console.log(this.classification);
  }

  loadDepartments( ) {
    this.parentCustomersSearchData.p_department_group = null;
    this.parentCustomersSearchData.p_parent_customer_name = null;
    this.showParentCustomergird = false;
    this.showProceed = false;
   
    console.log(this.parentCustomersSearchData.p_classification);
    this.spinnerService.show()
    this._manageAuditsServiceClient.getDepartments(this.parentCustomersSearchData.p_classification).subscribe((data :any[]) => {
      this.departments = data;
      this.spinnerService.hide()
    });
      console.log(this.departments);
  }

  getParentCustomer() {
    this.showParentCustomergird = true;
    this.showProceed = true;
    this.parentCustomerColumn =[
    {headerName: '', field: 'check', width: 50,
     
      checkboxSelection: false,
      cellRenderer: function cellTitle(params) {
        let cellValue = '<div class="ngSelectionCell"><input name="selected" type="radio"></div>';
        return cellValue;
      },
     },
     {headerName: 'Parent customer ID', field: 'parent_customer_id',filter:true, minWidth: 300 },
     {headerName: 'Customer name', field: 'parent_customer_name' ,filter:true,minWidth: 300 },
     {headerName: 'Region', field:'region', filter:true, sortable :true, minWidth: 300},
     {headerName: 'Delivery partner', field: 'delivery_partner',filter:true, minWidth: 290}
    ];
    this.defaultParentCustomerColDef =[{editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,}];
    this.spinnerService.show()
    this._manageAuditsServiceClient.getParentCustomerDetails(this.parentCustomersSearchData).subscribe((data :ParentCustomers[]) => {
      this.parentCustomerRow = data;
      this.spinnerService.hide()
      let a =1;
      this.parentCustomerRow.forEach(x=>{
          x.parent_customer_id = a;
          a++;
      });
    });
  }

  SaveAudits() : void {
    console.log(this.gridOptions.api.getSelectedRows());
    this.checkParentCustomerData=this.gridOptions.api.getSelectedRows();
    console.log(this.checkParentCustomerData);
    //this.PCustomer = 'Bharath1222'
    //this.PCustomer.emit('bharath');
    console.log(this.PCustomer);
    this.addNewAudit.p_department_group = this.parentCustomersSearchData.p_department_group;
    this.addNewAudit.p_parent_customer_id = this.checkParentCustomerData[0].parent_customer_id;
    this.addNewAudit.p_parent_customer_name = this.checkParentCustomerData[0].parent_customer_name;
    this.addNewAudit.p_region = this.checkParentCustomerData[0].region;
    this.addNewAudit.p_delivery_partner = this.checkParentCustomerData[0].delivery_partner;    
    this.addNewAudit.p_user_id = sessionStorage.getItem('UserID'); //567059

    this._manageAuditsServiceClient.addNewAudit(this.addNewAudit).subscribe((data :SavedAudit) => {
      if(data.message === "success"){
        this.router.navigateByUrl("/AddEditAudit/" + data.auditId);
      }
    });
    //this.router.navigateByUrl("/Manageaudits/audit=new");Manageaudits/:?audit=new
    //this.router.navigateByUrl("/AddEditAudit/" + this.auditID);
  }

  ResetAuditSearch() : void {
    this.router.navigateByUrl("/Manageaudits")
  }
}
