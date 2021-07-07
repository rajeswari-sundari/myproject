import { Component, OnInit } from '@angular/core';
import { PreAuditChecklistService } from './pre-audit-checklist.service';
import {GridOptions} from "@ag-grid-community/all-modules";
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router';
import { CustomAGGridLinkButtonComponent } from '../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component'
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { getTreeControlMissingError } from '@angular/cdk/tree';
import { CustomTooltipComponent } from '../Custom/custom-tooltip/custom-tooltip.component';
import { PreAuditChecklist,CheckListGridData} from './preauditchecklistSearch'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery:any;
@Component({
  selector: 'app-pre-audit-checklist',
  templateUrl: './pre-audit-checklist.component.html',
  styleUrls: ['./pre-audit-checklist.component.css']
})
export class PreAuditChecklistComponent implements OnInit {
  
  public parentCustomer : any[];
  public preauditchecklistData : PreAuditChecklist ;
  public columnDefs : any [];
  public rowData : any[];
  public defaultColDef;


  constructor(private _PreAuditChecklistServiceClient : PreAuditChecklistService,private router:Router,
            public toastr: ToastrService, private spinnerService: NgxSpinnerService,
            private _routeParameters : ActivatedRoute) {
              
         this.preauditchecklistData=new PreAuditChecklist();
         this.defaultColDef = {
          flex: 1,
          minWidth: 100,
          resizable:true,lockPosition:true };
  }
  

  ngOnInit() {
    this.router.navigateByUrl('/Manageaudits/1');
    this._PreAuditChecklistServiceClient.GetParentCustomer().subscribe((data : any[]) => {
      this.parentCustomer = data; 
    }); 
    this.GetCheckListData(this.preauditchecklistData);
    this.columnDefs = [
      {headerName: 'Pre-audit checklist ID', field: 'preaudit_checklist_id',filter:true, sortable :false },
      {headerName: 'Audit Name', field: 'audit_name' ,filter:true, sortable :false},
      {headerName: 'Parent  customer ', field:'parent_customer', filter:true, sortable :false, editable:false},
      {headerName: 'Pre-audit date ', field: 'pre_audit_date' ,filter:true, sortable :false},
      {headerName: 'Actual audit date', field: 'actual_audit_date' ,filter:true, sortable :false},
      {headerName:'Pre-audit checklist readiness',field:'preaudit_checklist_readiness',filter:true,sortable:true},
      { headerName: 'Action', field: 'Action', editable: false,  filter:false, sortable :false,
      cellRendererFramework : CustomAGGridLinkButtonComponent,
        cellRendererParams: {
          linkID : 'audit_id',   
                 
      },
    },
  //   { headerName: 'View', field: 'published', editable: false,  filter:false, sortable :false,
  //   cellRendererFramework : CustomAGGridLinkButtonComponent,
  //     cellRendererParams: {
  //       action : 'view', 
  //       paramID : 'audit_id',         
  //   },
 
  // }
    
    
    ]
  }
GetCheckListData(preauditchecklistData):void{
  this.spinnerService.show()
  this._PreAuditChecklistServiceClient.GetPreAuditChecklistDetails(preauditchecklistData).subscribe((data: CheckListGridData[]) => {
    this.rowData = data;
    this.spinnerService.hide()
});
}

  ResetControls():void{
    this.preauditchecklistData.parent_customer_name='Select Customer';
    this.preauditchecklistData.preaudit_checklist_id=null;
    this.GetCheckListData(this.preauditchecklistData);
  }
  Searchaudits():void{
    this.GetCheckListData(this.preauditchecklistData);
  }
  NewAuditChecklist():void{
    this.router.navigateByUrl('/Newpreauditchecklist')
  }
}
