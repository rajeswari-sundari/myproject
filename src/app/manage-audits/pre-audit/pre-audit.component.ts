import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent,TabDirective } from "ngx-bootstrap/tabs";
import { ManageAuditsSearch,ManageAudits, SaveAuditControl } from '.././manageAuditsClasses'
import { Router,ActivatedRoute } from '@angular/router';
import { KeyValuePairDTO } from '../../Common/KeyValuePairDTO';
import {ManageAuditService} from '../manage-audits.service';
import { CustomAGGridLinkButtonComponent } from '../../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { AgGridLinkComponent } from '.././ag-grid-link/ag-grid-link.component';
import { GridOptions } from 'ag-grid-community';
//import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.css']
})
export class PreAuditComponent implements OnInit {
  public modalRef: BsModalRef;

  public manageAuditsSearchData : ManageAuditsSearch ;
  public customers : any[];
  public status : any [];
  public auditsRow : any [];
  public auditsColumn : any [];
  public defaultAuditColDef;

  public columnDefs: any[];
  public rowData: any[];
  private defaultColDef;
  frameworkComponents: any;

  public columnDefs1: any[];
  public rowData1: any[];
  private defaultColDef1;
  frameworkComponents1: any;
  public deleteAuditControl : SaveAuditControl;
  public auditgridOptions ;
  mindate: Date;
  constructor(public datepipe: DatePipe,private router: Router, private _manageAuditsServiceClient : ManageAuditService,
    private _routeParameters : ActivatedRoute, private modalService: BsModalService, private spinnerService: NgxSpinnerService) {
     this.manageAuditsSearchData = new ManageAuditsSearch();
     this.deleteAuditControl = new SaveAuditControl();
     this.auditgridOptions = <GridOptions>{ }  
   }

  ngOnInit() {
    this.router.navigateByUrl('/Manageaudits/0')
    this.manageAuditsSearchData.parent_customer_name = null;
    this.manageAuditsSearchData.status = null;
    this.getCustomers();
    this.getStatus();
    this.getAudits(this.manageAuditsSearchData);
    this.columnDefs = [
      {headerName: '', field: 'check', width: 60,
       headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      },
      {headerName: 'Parent category', field: 'parent_category_name',filter:true, sortable :true,  width: 200 },
      {headerName: 'Category', field: 'category_name' ,filter:true, sortable :true, minWidth: 200},
      {headerName: 'Control', field:'control_name', filter:true, sortable :true, editable:false, minWidth: 200,},
      {headerName: 'Weightage (%)', field: 'weightage',filter:true, sortable :true,minWidth: 200}
    ]

    this.auditsColumn = [
      {headerName: 'Audit ID', field: 'audit_id'},
      {headerName: 'Audit name', field: 'audit_name',filter:true,  },
      {headerName: 'Parent customer', field: 'parent_customer_name' ,filter:true,},
      {headerName: 'Pre-audit date', field:'pre_audit_date', filter:true,   },
      {headerName: 'Actual audit date', field: 'actual_audit_date',filter:true, },
      {headerName: 'Status', field: 'overall_audit_status',filter:true, sortable :true,},
      {headerName: 'Audit readiness', field: 'audit_readiness',filter:true, sortable :true,},
      {headerName: 'Published', field: 'published',filter:true, sortable :true,},
      { headerName: 'Action', field: 'Action', editable: false,  filter:false, sortable :false,
        cellRendererFramework : CustomAGGridLinkButtonComponent,
        cellRendererParams: {
          linkID : 'addEdit_Pre_audit_id',
          onClick: this.deleteaudit.bind(this),
        },
        // cellRendererFramework1 : AgGridLinkComponent,
        // cellRendererParams1: {
        //   linkID : 'addEdit_Pre_audit_id'
        // },
        // cellRenderer : "buttonRenderer",
        // cellRendererParams1: {
        //   onClick: this.onBtnClick2.bind(this),
        // }
      }
    ]
    this.defaultAuditColDef = {editable: false, sortable: false,resizable: true,flex: 1,lockPosition:true,};
    
    // Remove the audit-data on load of the audits page
    if (sessionStorage.getItem('auditData')) {
      sessionStorage.removeItem('auditData');
    }

    this._manageAuditsServiceClient.removePreviewData();
  }

  onValueChange(val: Date) {
    this.mindate = val;
  }
  getCustomers() {
    
    this._manageAuditsServiceClient.getParentCustomers().subscribe((data :KeyValuePairDTO[]) => {
      this.customers = data;
      })
  }
  getStatus() {
    //var selectDef = {Key : 'Select',Value : 'Select', SortOrder : null };
    var searchflag='Y';
    this._manageAuditsServiceClient.getStatus(searchflag).subscribe((data :KeyValuePairDTO[]) => {
      this.status = data; 
      })
  }
  getAudits(manageAuditsSearchData) {
   // this.manageAuditsSearchData.status = this.manageAuditsSearchData.status == "Select" ? null : this.manageAuditsSearchData.status;
   this.manageAuditsSearchData.from_date=this.datepipe.transform(this.manageAuditsSearchData.from_date, 'dd-MMM-yyyy');
   this.manageAuditsSearchData.to_date=this.datepipe.transform(this.manageAuditsSearchData.to_date, 'dd-MMM-yyyy');
   this.spinnerService.show()
    this._manageAuditsServiceClient.getAudits(manageAuditsSearchData).subscribe((data :ManageAudits[]) => {
      this.auditsRow = data;
      this.spinnerService.hide()
      })
    }
    SearchAudits(): void {
        this.getAudits(this.manageAuditsSearchData);
    }

    ResetAuditSearch(): void {
        this.manageAuditsSearchData.parent_customer_name =null;
        this.manageAuditsSearchData.audit_name = null;
        this.manageAuditsSearchData.audit_id = null;
        this.manageAuditsSearchData.status = null;
        this.manageAuditsSearchData.from_date = null;
        this.manageAuditsSearchData.to_date = null;
        this.SearchAudits();
    }

    NewAudit(): void {
      //this.router.navigate(['/Manageaudits'],{queryParams : {preAudit : 'prenew' }})
        this.router.navigateByUrl("/AddEditAudit");
    }
  SelectCategory() {
    jQuery("#SelectCategorypopup").modal();
  }

  closeSelectCategory() {
    jQuery("#SelectCategorypopup").modal('hide');
  }

  deleteaudit(e : any) {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Delete audit",
        message: "Are you sure you want to delete the audit?",
        callback: (result) => {
          if(result == 'yes') {
            this.deleteAuditControl.p_audit_id = e.rowData.audit_id;            
            this.deleteAuditControl.p_user_id = sessionStorage.getItem('UserID'); //567059
            this._manageAuditsServiceClient.DeleteAudit(this.deleteAuditControl).subscribe((data : string) => {
              if(data == 'success'){
            //this.auditgridOptions.api.purgeServerSideCache();
           // this.auditgridOptions.api.setRowData(this.auditgridOptions.rowData)
                this.getAudits(this.manageAuditsSearchData);
              }
            });
          }
        }
      }
    })
    
  }  
  

}
