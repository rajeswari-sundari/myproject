import { Component, OnInit ,ViewChild,Input,Output,EventEmitter} from '@angular/core';
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router';
import {Newauditpreauditchecklistservice } from '../new-audit-pre-audit-checklist.service';
import{AuditList,AuditName,CheckListItems,CheckListItemsJson,CheckListItemsforcheckbox} from '../newauditpreauditchecklist.Search';
import {GridOptions} from "@ag-grid-community/all-modules";
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CustomCheckboxComponent } from '../../Custom/custom-checkbox/custom-checkbox.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery:any;

@Component({
  selector: 'app-check-list-items',
  templateUrl: './check-list-items.component.html',
  styleUrls: ['./check-list-items.component.css']
})
export class CheckListItemsComponent implements OnInit {
  //@ViewChild('agselectChecklist',{static:false,read:AgGridAngular}) agselectChecklist:AgGridAngular; 
  @Input() data;
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();

  public modalRef: BsModalRef;

  public noRowsTemplate;
  public loadingTemplate;
  public checklistData:CheckListItems[];
  public checklistrowdata:any[];
  public checklistRow:CheckListItemsforcheckbox[];
  public checklistRow1:CheckListItemsforcheckbox[];
  public CheckListJson:CheckListItemsJson;
  public AuditNameList : AuditList ;
  public rowData : any[];
  public defaultColDef;
  public columnDefs : any[];
  public rowData1 : any[];
  public defaultColDef1;
  public columnDefs1 : any[];
  public gridOptions;
  public gridOptions1;
  public gridApi;
  public gridColumnApi;
  public rowSelection1;
  public params:any[];
  public actionParam;

// private _matDialog: MatDialog
  constructor(private _NewPreAuditChecklistServiceClient : Newauditpreauditchecklistservice,private _router:Router,
    public toastr: ToastrService,private modalService: BsModalService, private spinnerService: NgxSpinnerService,
    private _routeParameters : ActivatedRoute) {
    this.CheckListJson=new CheckListItemsJson();
    this.AuditNameList=new AuditList();
    this.loadingTemplate =
    `<span class="ag-overlay-loading-center">No items added.Please add one or more items</span>`;
  this.noRowsTemplate =
    `<span">No items added.Please add one or more items</span>`;
    
    this.columnDefs = [
      {headerName:'',field:'audit_checklist_id',hide:true},
      {headerName: 'Category', field: 'audit_category_name',filter:true, sortable :false},
      {headerName: 'CheckList', field: 'audit_checklist' ,filter:true, sortable :false}
    ]
    this.columnDefs1 = [
      {headerName:'',field:'checklistchecked',minWidth:80,cellRendererFramework: CustomCheckboxComponent},
      {headerName: 'Category', field: 'audit_category_name',filter:true, sortable :false,minWidth:300 },
      {headerName: 'CheckList', field: 'audit_checklist' ,filter:true, sortable :false,minWidth:480},
    ]
    
    this.defaultColDef = {
      flex: 1,
      minWidth: 120,
      resizable:true,lockPosition:true };

    this.gridOptions1 = <GridOptions>{
       editable: false, enableBrowserTooltips: true, filter: "agTextColumnFilter" }

       this.defaultColDef1 = {
        flex: 1,
        minWidth: 100,
        resizable: true,
        lockPosition:true};
      this.rowSelection1 = "multiple";
   }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) =>{      
      this.actionParam = data['action'];
    });
    jQuery("#CheckListPopup").modal('hide');
    this.AuditNameList=this.data;
    this.checklistrowdata=null;
    this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
    this.spinnerService.show()
    this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
     this.rowData=data;
     this.checklistrowdata=data;
     this.spinnerService.hide()
    })
  }
  ShowCheckListItems():void{
    jQuery("#CheckListPopup").modal();
    this._NewPreAuditChecklistServiceClient.GetCheckListItems().subscribe((data:any[])=>{
      if(data!=null){
        this.checklistRow=this.rowData;
        if(this.checklistRow != null) {
          for(let x of data) {
            if(this.checklistRow.filter(y=>y.audit_checklist_id == x.audit_checklist_id).length == 1 ){
              x.checklistchecked = true;
            }
            else {
              x.checklistchecked = false;
            }
          }
          console.log(data);
          this.rowData1 = data;
        }
        else {
          this.rowData1 = data;
        } 
      this.checklistRow1=this.rowData1; 
      }
  })
  }
  // multicheckboxselection():void{
  //   if(this.checklistRow1!=null){
  //   let exists=this.checklistRow1.forEach(element => {
  //     let exists = this.checklistRow.findIndex(x=> x.audit_checklist_id==element.audit_checklist_id);
  //     if(exists > -1){
  //      this.gridOptions1.api.getRowNode(exists ).setSelected(true);
  //      //this.gridOptions1.api.selectAll();
  //    }
  //  })
  // }
  // }
  SelectCheckList():void{
    //this.checklistData=this.gridOptions1.api.getSelectedRows();
    this.checklistData = this.checklistRow1.filter(x=>x.checklistchecked == true);
    this.rowData=this.checklistData;
    jQuery("#CheckListPopup").modal('hide');
  }
  clearselection():void{
   // this.gridOptions1.api.deselectAll();
   for(let x of this.checklistRow1) {
      x.checklistchecked = false;
    }
    this.gridOptions1.api.refreshCells();
  }
  closeCheckList():void{
    jQuery("#CheckListPopup").modal('hide');
  }
  CommonSavemethod():void{
    if(this.rowData!=null &&  this.rowData.length!=0){
    if(this.checklistrowdata!=null){
      this.checklistrowdata = this.checklistrowdata.filter(x => this.rowData.map(y => y.audit_checklist_id).includes(x.audit_checklist_id));
    this.rowData.forEach(element => {
      var some=this.checklistrowdata.some(d=>d['audit_checklist_id']==element.audit_checklist_id);
        if(some==false){
          this.checklistrowdata.push(element);
        }
    });
    console.log(this.checklistrowdata);
    this.CheckListJson.Loadchecklist=this.checklistrowdata;
  }
  else{
    this.CheckListJson.Loadchecklist=this.rowData;
  }
  this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
}
else{
  this.toastr.error("Data Should not be empty", 'error');
}
  }
  SaveCheckList():void{
    this.CommonSavemethod();
    if(this.rowData!=null  && this.rowData.length!=0){
    this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
      if(this.data!=null)
      {
        this.toastr.success("CheckList Data Saved Successfully",'Success', { enableHtml: true });
        this.rowData=data;
      }
      else{
        this.toastr.error("Failed", 'error');
      }
    })
  }
  }
  SaveProceedCheckList():void{
    this.CommonSavemethod();
    if(this.rowData!=null  &&  this.rowData.length!=0){
    this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
      this.rowData=data;
    })
    this.tabactive.emit(1);
  }
}

  BacktoNewAudit():void{
    this.tabactive.emit(4);
  }
  NexttoNewAudit():void{
    this.tabactive.emit(1);
  }
  CancelAudit():void{
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "CheckList Items",
        message: "Are you sure you want to Discard your changes?",
        callback: (result) => {
          if(result == 'yes') {
            this._router.navigateByUrl('/Manageaudits/1');
          }
        }
      }
    })
  }
  // const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
  //   maxWidth: "600px",
  //   maxHeight : "200px",
  //   data: {
  //       title: "CheckList Items",
  //       message: "Are you sure you want to Discard your changes?"}
  // });
  // dialogRef.afterClosed().subscribe(dialogResult => {
  //   if(dialogResult){
  //     this._router.navigateByUrl('/Manageaudits/1');
  //   }
  // })
}
