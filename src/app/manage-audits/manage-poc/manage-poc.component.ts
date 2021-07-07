import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
//import {MatDialog} from '@angular/material/dialog';
import * as fs from 'fs';
import * as path from 'path';
import { ManageAuditService } from '../manage-audits.service';
import {Newauditpreauditchecklistservice } from '../../new-audit-pre-audit-checklist/new-audit-pre-audit-checklist.service';
import {  SaveAuditControl,AddAuditControlDetails,ManageAuditControls,AuditControl,PointOfContact,UpdateAuditControlPOC } from '../manageAuditsClasses';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
@Component({
  selector: 'app-manage-poc',
  templateUrl: './manage-poc.component.html',
  styleUrls: ['./manage-poc.component.css']
})
export class ManagePocComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @Input() data;

  public modalRef: BsModalRef

  public addauditControldata: AddAuditControlDetails;
  public auditcontrol:AuditControl;
  public PointOfContact:PointOfContact;
  public UpdateAuditControlPOC:UpdateAuditControlPOC;
  public columnDefs : any [];
  public rowData : any[];
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;
  public audit_id:any;
  public gridOptions:GridOptions;
  public GridData:any[];
  public parentCategories: any[];
  public Categories: any[];
  public selectedFile:File;
  public POCFileName:any;
  public message:number;
  public errorlist:any;
  public published:any;
  public isAdmin: boolean = false;
  public actionParam:any;

  public pocValue = {};
  public isEditable: boolean;
  public orgData: any;
//private _matDialog: MatDialog
  constructor(private _loadAuditServiceClient: ManageAuditService,private _routeParameters: ActivatedRoute,private _NewPreAuditChecklistServiceClient : Newauditpreauditchecklistservice, public toastr: ToastrService,
    private modalService: BsModalService,private _router:Router, private spinnerService: NgxSpinnerService) { 
    this.auditcontrol=new AuditControl();
    this.PointOfContact=new PointOfContact();
    this.UpdateAuditControlPOC=new UpdateAuditControlPOC();

    this.loadingTemplate =
        `<span class="ag-overlay-loading-center">Contacts are loading...</span>`;
      this.noRowsTemplate =
        `<span class="ag-overlay-loading-center">No contacts are added. Please import from grid above.</span>`;

    this.isEditable = this._loadAuditServiceClient.isRecordEditable();
    this.orgData = this._loadAuditServiceClient.getPreviewAuditData();
  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      this.actionParam = data['action'];
    })
   if(this.actionParam=='view'){
      this.isAdmin = this.actionParam == 'view' ? true : false;
   }
    this.audit_id=this.data[0].audit_id;
    this.published=this.data[0].published;
    // if(this.published=='Yes'){
    // this.isAdmin = this.published == 'Yes' ? true : false;
    // }
    this.auditcontrol.p_parent_category_id = null;
    this.auditcontrol.p_category_id=null;
    this.auditcontrol.p_control_id=null;
    this.auditcontrol.p_control_name=null;
    this.auditcontrol.p_audit_id=this.audit_id;
    this.managepointofContact();
    if(this.isAdmin==false){
    this.columnDefs = [
      { headerName: 'Control ID', field: 'control_id',filter:true, sortable :false, },
      { headerName: 'Control', field: 'control_name',filter:true, sortable :false,width: 256 },
      { headerName: 'Accountable Point of contact', field: 'Account_point_of_contact',filter:true,editable:(node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'Account_point_of_contact', node.data.Account_point_of_contact) ? false : true, sortable :false, width: 275 },
      { headerName: 'Responsible Point of contact', field: 'Responsible_point_of_contact',filter:true,editable:(node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'Responsible_point_of_contact', node.data.Responsible_point_of_contact) ? false : true, sortable :false, width: 275 },
      { headerName: 'Additional POC for email', field: 'Additional_POC_for_email',filter:true,editable:(node) => this._loadAuditServiceClient.hasExistingData(this.orgData, 'Additional_POC_for_email', node.data.Additional_POC_for_email) ? false : true, sortable :false, width: 250},
    ]
  }
  else{
    this.columnDefs = [
      { headerName: 'Control ID', field: 'control_id',filter:true, sortable :false,editable:false },
      { headerName: 'Control', field: 'control_name',filter:true, sortable :false,editable:false, width: 256 },
      { headerName: 'Account Point of contact', field: 'Account_point_of_contact',filter:true,editable:false, sortable :false, width: 275 },
      { headerName: 'Responsible Point of contact', field: 'Responsible_point_of_contact',filter:true,editable:false, sortable :false, width: 275 },
      { headerName: 'Additional POC for email', field: 'Additional_POC_for_email',filter:true,editable:false, sortable :false, width: 250},
    ]
  }
}
managepointofContact(){
  this.spinnerService.show()
  this._loadAuditServiceClient.getPreviewAudits(this.auditcontrol).subscribe((data: any[]) => {
    this.rowData = data;
    this.GridData=data;
    this.spinnerService.hide()
    this.parentCategories=this.GridData.map(({ parent_category_id, parent_category_name }) => ({parent_category_id, parent_category_name}));
    this.parentCategories= this.parentCategories.filter(function (a) {
      return !this[a.parent_category_id] && (this[a.parent_category_id] = true);
  }, Object.create(null));
  })

const that = this;

this.gridOptions = <GridOptions>
{
  columnDefs: this.columnDefs,

  defaultColDef: this.defaultColDef,

  rowData: this.rowData,

  singleClickEdit:true,
  
  onCellEditingStarted: function (event) {
    that.pocValue[event.colDef.field] = event.value || '';
  },

  onCellEditingStopped: (event) => {
    if (event.value != undefined && event.value != null && event.value != "") {
      let reg = /^([0-9]+-)*[0-9]+$/;
      if (reg.test(event.value) == false && !event.value.includes(";")){
         event.node.setDataValue(event.column, "");
        this.toastr.error("Point Of Contact should allow only numbers and semi-colon(;)",'error');
      } 
      // else if (!this.isEditable && !!that.pocValue[event.colDef.field] && !(event.value).includes(that.pocValue[event.colDef.field])) {
      //   event.node.setDataValue(event.column, that.pocValue[event.colDef.field]);
      //   this.toastr.error("Published data cannot be modified!",'error');
      // } 
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

LoadManagemetricCategory() {
  this.Categories = null;
  this.Categories=this.GridData.filter(d=>d.parent_category_id==this.auditcontrol.p_parent_category_id);
  this.Categories=this.Categories.map(({ category_id, category_name }) => ({category_id, category_name}));
    this.Categories= this.Categories.filter(function (a) {
      return !this[a.category_id] && (this[a.category_id] = true);
  }, Object.create(null));
}
SearchManageControls() {
  this._loadAuditServiceClient.getPreviewAudits(this.auditcontrol).subscribe((data: any[]) => {
    if(data.length > 0) { 
      this.rowData = data;
    }
    else {
      this.rowData = null;
    }
  });
}

ResetManageControls() {
  this.Categories=null;
  this.auditcontrol.p_parent_category_id = null;
  this.auditcontrol.p_category_id=null;
  this.auditcontrol.p_control_id=null;
  this.auditcontrol.p_control_name=null;
  this.auditcontrol.p_audit_id=this.audit_id;
  this.SearchManageControls();
}
validationPOC() : boolean {
  var result = false;
      for(let x of this.rowData) {
        if(x.Account_point_of_contact!=null && x.Account_point_of_contact!="" && x.Responsible_point_of_contact!=null && x.Responsible_point_of_contact!=""){
        if(!(x.Account_point_of_contact.replace(/\s/g, '').length && x.Responsible_point_of_contact.replace(/\s/g, '').length))
        {
          x.Account_point_of_contact=null;
          x.Responsible_point_of_contact=null;
        }
       
      }
      else
      {
        this.toastr.error("APOC & RPOC should be mandatory",'error');
        result = false;
        return result;
      }
        if(x.Account_point_of_contact!=null && x.Account_point_of_contact!=""&& x.Responsible_point_of_contact!=null && x.Responsible_point_of_contact)
        {
          let splittedValues =  x.Account_point_of_contact.split(";");
          let splittedValues1=x.Responsible_point_of_contact.split(";");
          if (splittedValues.length>5 ||splittedValues1.length>5 ){
            result = false; 
           this.toastr.error("Point Of Contact for single control should not exceed five",'error');
           return result;
         }
         else{
          result = true; 
         }        
        }
        else {
          this.toastr.error("APOC & RPOC should be mandatory",'error');
          result = false;
          return result;
        }

        // if ((!!this.pocValue['Account_point_of_contact'] && !x.Account_point_of_contact.includes(this.pocValue['Account_point_of_contact'])) ||
        // (!!this.pocValue['Responsible_point_of_contact'] && !x.Responsible_point_of_contact.includes(this.pocValue['Responsible_point_of_contact']))) {
        //   this.toastr.error("Published data cannot be modified!",'error');
        //   result = false;
        // } else {
        //   result = true;  
        // }
      }
     
      return result; 
  }
  SavePOC():void{
    if(this.rowData!=null  &&  this.rowData.length!=0){
    if(this.validationPOC()){
      this.UpdateAuditControlPOC.AuditControlPOCs=this.rowData;
      this.UpdateAuditControlPOC.p_audit_id=this.audit_id;
      this._loadAuditServiceClient.SavePointOfContact(this.UpdateAuditControlPOC).subscribe((data: any) => {
        if (data == "failure") {
          this.toastr.error("Failed", 'error');
        } else {
          this.toastr.success("Contacts Saved Successfully" ,'Success', { enableHtml: true });
        }
      });
    }
  }
else{
  this.toastr.error("Data Should not be empty", 'error');
}
  }
  SaveProceed() {
    if(this.rowData!=null  &&  this.rowData.length!=0){
    if(this.validationPOC()){
      this.UpdateAuditControlPOC.AuditControlPOCs=this.rowData;
      this.UpdateAuditControlPOC.p_audit_id=this.audit_id;
      this._loadAuditServiceClient.SavePointOfContact(this.UpdateAuditControlPOC).subscribe((data: any) => {
        this.tabactive.emit(3);
      });
    }
  }
  else{
    this.toastr.error("Data Should not be empty", 'error');
  }
  }
  Next():void{
    this.tabactive.emit(3);
  }
  GoToPrevious() {
    this.tabactive.emit(1);
  }

  ImportContact() {
    this.message=4;
    this.POCFileName=null;
    jQuery('#ImportContactPopup').modal();
  }
  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    this.POCFileName=this.selectedFile.name;
  }
  UploadFile(){
   let formData=new FormData();
   formData.append('file',this.selectedFile,this.selectedFile.name);
   this._loadAuditServiceClient.ImportPOC(formData).subscribe(data => {
     this.message=0;
    if(data=="success"){
     this._loadAuditServiceClient.ImportPointOfContact(this.audit_id,this.POCFileName).subscribe(data => {  
       this.errorlist=data;
       if(this.errorlist.includes(',')){
      var splitvalue= this.errorlist.split(',');
      if(splitvalue[0]=="success"){
        this.message=1;
        this.errorlist=splitvalue[1];
        this.managepointofContact();
      }
    }
      else
      {      
        if(this.errorlist=="failure"){
         this.message=3;
        }
        else{
          this.message=2;
          this.errorlist=data;
        }
      }
     })
   }
   else if(data=='Invalidfiletype'){
     this.message=5;
   }
   else{
    this.message=3;
   }
  
  })
  
  }

  closeImportContact() {
    jQuery('#ImportContactPopup').modal('hide');
  }
  CancelAudit():void{
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Control Items",
        message: "Are you sure you want to Discard your changes?",
        callback: (result) => {
          if(result == "yes") {
            this._router.navigateByUrl('/Manageaudits');
          } else {
            console.log("no");
          }
        }
      }
    })
  }

  ExportGrid():void{
    var params = {
      columnGroups: true,
      allColumns: true,
      fileName: 'ManageAudit_POC',
      columnWidth:800,
       }
    this.gridOptions.api.exportDataAsCsv(params);
  }

  /*
  const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
      maxWidth: "600px",
      maxHeight : "200px",
      data: {
          title: "Control Items",
          message: "Are you sure you want to Discard your changes?"}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this._router.navigateByUrl('/Manageaudits/');
      }
    })
  */
}
