import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import {GridOptions} from "@ag-grid-community/all-modules";
import { ToastrService } from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router';
import {Newauditpreauditchecklistservice } from '../new-audit-pre-audit-checklist.service';
import{AuditList,AuditName,CheckListItems,CheckListItemsJson,PointOfContact} from '../newauditpreauditchecklist.Search';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-poc-checklist',
  templateUrl: './manage-poc-checklist.component.html',
  styleUrls: ['./manage-poc-checklist.component.css']
})
export class ManagePOCChecklistComponent implements OnInit {
  @Input() data;
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();

  public modalRef: BsModalRef;
  public noRowsTemplate;
  public loadingTemplate;
  public rowData : any[];
  public defaultColDef;
  public columnDefs : any[];
  public gridOptions;
  public checklistData:CheckListItems[];
  public CheckListJson:CheckListItemsJson;
  public AuditNameList : AuditList ;
  public PointOfContact:PointOfContact;
  public params:any[];
  public actionParam;
//private _matDialog: MatDialog
  constructor(private _NewPreAuditChecklistServiceClient : Newauditpreauditchecklistservice,private router:Router,
    private modalService: BsModalService,public toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private _routeParameters : ActivatedRoute) { 
      this.CheckListJson=new CheckListItemsJson();
      this.AuditNameList=new AuditList();
      this.PointOfContact=new PointOfContact();
      this._routeParameters.params.subscribe((data) =>{      
        this.actionParam = data['action'];
      });
      this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No items added.Please add one or more items</span>`;
    this.noRowsTemplate =
      `<span">No items added.Please add one or more items</span>`;
      if(this.actionParam == 'view'){
        this.columnDefs = [
          {headerName: 'Checklist items', field: 'audit_checklist',filter:true, sortable :false,editable:false,minWidth:200},
          {headerName: 'Point of contact', field: 'Point_of_contact' ,filter:true, sortable :false,minWidth:200, editable:false},
          {headerName: 'Additional POC for email', field: 'Additional_POC_for_email' ,filter:true, sortable :false,minWidth:200,editable:false}
        ]    
      }else{
        this.columnDefs = [
          {headerName: 'Checklist items', field: 'audit_checklist',filter:true, sortable :false,editable:false,minWidth:200},
          {headerName: 'Point of contact', field: 'Point_of_contact' ,filter:true, sortable :false,minWidth:200},
          {headerName: 'Additional POC for email', field: 'Additional_POC_for_email' ,filter:true, sortable :false,minWidth:200}
        ]
    
      }
      

    this.defaultColDef = {
      flex: 1,
     // minWidth: ,
      resizable: true,lockPosition:true,editable:true };
    }
  ngOnInit() {
 
    this.AuditNameList=this.data;
    this.ManagePoc();
  }
  // onCellKeyPress(event){
  //   let reg = /^([0-9]+-)*[0-9]+$/;
  //   if (reg.test(event.value) == false){
  //      event.node.setDataValue(event.column, "");
  //     this.toastr.error("Point Of Contact should allow only numbers and semi-colon(;)",'error');
  //   }
  // }
  ManagePoc(){
    this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
    this.spinnerService.show()
    this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
     this.rowData=data;
     this.spinnerService.hide()
    })
    this.gridOptions = <GridOptions>
    {
      columnDefs: this.columnDefs,

      defaultColDef: this.defaultColDef,

      rowData: this.rowData,

      singleClickEdit:true,

      onCellEditingStarted: function (event) {     
      },

      onCellEditingStopped: (event) => {
        if (event.value != undefined && event.value != null && event.value != "") {
          let reg = /^([0-9]+-)*[0-9]+$/;
          if (reg.test(event.value) == false && !event.value.includes(";")){
             event.node.setDataValue(event.column, "");
            this.toastr.error("Point Of Contact should allow only numbers and semi-colon(;)",'error');
          }
          else if(event.value.includes(";")){
            let splittedValues = event.value.split(";");
            if (reg.test(splittedValues[splittedValues.length-1]) == false){
              event.node.setDataValue(event.column, event.value);
             this.toastr.error("Point Of Contact should allow only numbers and semi-colon(;)",'error');
           }
             else if(splittedValues.length>5){
              event.node.setDataValue(event.column,event.value);
              this.toastr.error("Point Of Contact for single checklist should not exceed five",'error');
             }
             else{
              this.PointOfContact.pointofContact = event.value;
              this._NewPreAuditChecklistServiceClient.GetPointofContactDetails(this.PointOfContact).subscribe((data:any)=>{
                if(data.PointOfContact!=null && data.PointOfContact!=""){
                  event.node.setDataValue(event.column, data.PointOfContact);
                 }
                else{
                  event.node.setDataValue(event.column, "");
                  this.toastr.error("Data is Invalid,Please enter valid data",'error');
                }
              })
            }
          }
          else{
            this.PointOfContact.pointofContact = event.value;
              this._NewPreAuditChecklistServiceClient.GetPointofContactDetails(this.PointOfContact).subscribe((data:any)=>{
                if(data.PointOfContact!=null && data.PointOfContact!=""){
                  event.node.setDataValue(event.column, data.PointOfContact);
                 }
                else{
                  event.node.setDataValue(event.column, "");
                  this.toastr.error("Data is Invalid,Please enter valid data",'error');
                }
              })
          }
        }             
      },
    }

  }
  validationCheckList() : boolean {
    var result = false;
        for(let x of this.rowData) {
          if(x.Point_of_contact!=null && x.Point_of_contact!=""){
          if(!x.Point_of_contact.replace(/\s/g, '').length)
          {
            x.Point_of_contact=null;
          }
        }
        let splittedValues =  x.Point_of_contact.split(";");
        
          if(x.Point_of_contact!=null && x.Point_of_contact!="")
          {
            if (splittedValues.length>5){
              result = false; 
             this.toastr.error("Point Of Contact for single checklist should not exceed five",'error');
             return result;
           }
           else{
            result = true; 
           }        
          }
          else {
            this.toastr.error("Point Of Contact should be mandatory",'error');
            result = false;
            return result;
          }
        }
        return result; 
    }
  SaveCheckList():void{
    if(this.rowData!=null  &&  this.rowData.length!=0){
    if(this.validationCheckList()){
    this.CheckListJson.Loadchecklist=this.rowData;
    this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
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
else{
  this.toastr.error("Data Should not be empty", 'error');
}
  }
  SaveProceedCheckList():void{
    if(this.rowData!=null  &&  this.rowData.length!=0){
    if(this.validationCheckList()){
   this.CheckListJson.Loadchecklist=this.rowData;
   this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
   this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
   this.rowData=data;
  })
  this.tabactive.emit(2);
  }
}
else{
  this.toastr.error("Data Should not be empty", 'error');
}
}
  BacktoCheckList():void{
    this.tabactive.emit(0);
  }
  CancelViewAudit(){
    this.router.navigateByUrl('/Manageaudits/1');
  }
  CancelAudit():void{
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Manage Point Of Contact",
        message: "Are you sure you want to Discard your changes?",
        callback: (result) => {
          if(result == "yes") {
            this.router.navigateByUrl('/Manageaudits/1');
          } else {
            console.log("no");
          }
        }
      }
    })
  }
  /*
  const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
      maxWidth: "600px",
      maxHeight : "200px",
      data: {
          title: "Manage Point Of Contact",
          message: "Are you sure you want to Discard your changes?"}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.router.navigateByUrl('/Manageaudits/1');
      }
    })
  */
}
