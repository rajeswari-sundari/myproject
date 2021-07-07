import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import {​​​​​​​​ Router }​​​​​​​​ from'@angular/router'
import { stat } from 'fs';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-custom-aggrid-link-button',
  templateUrl: './custom-aggrid-link-button.component.html',
  styleUrls: ['./custom-aggrid-link-button.component.css']
})
export class CustomAGGridLinkButtonComponent implements ICellRendererAngularComp, OnInit,AfterViewInit   {
  params: any ;
  public parent_category_id : number;
  public category_id:number;
  public audit_id : number;
  public preaudit_checklist_id : number; 
  public checklistpublished : string;
  public auditStatus : string;
  public isPDF;
  public editauditlinkId;
  public pdfname;
  public viewlink;
  public myTask_audit_id : number;

  
  public userAction = {
                        edit: false,
                        delete: false,
                        view: false
                      };

  constructor(private _router: Router ) {
   }
  ngAfterViewInit(): void {
    return;
  }
  ngOnInit() {
  }

  refresh(params: any): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    
    this.params = params;       
      if(this.params["linkID"] == 'OpenPDF'){
       
          this.isPDF = this.params["linkID"];
          this.pdfname = this.params.value;
          if(this.pdfname == '')
          {
            this.viewlink = '';
          }else{
            this.viewlink = 'View';
          }
        
      }
    this.editauditlinkId = this.params['linkID']    
    this.category_id=this.params.data.category_id;
    this.audit_id = this.params.data.audit_id;
  
    this.checklistpublished = this.params.data.published;
    this.auditStatus = this.params.data.status;
    if(this.auditStatus=='Completed' || this.auditStatus=='Cancelled'){
      this.auditStatus='Yes';
      this.checklistpublished='Yes';
    }
    if(this.auditStatus=='In-Progress' && this.checklistpublished=='No'){
      this.checklistpublished='None';
    }

    if (this.editauditlinkId === 'addEdit_Pre_audit_id') {

      const published = this.params.data.published;
      const status = this.params.data.overall_audit_status;

      if (published === 'Yes' && status && status.toLowerCase() === 'completed') {
        this.userAction.view = true;
      } else if (published === 'Yes' && status &&  ['planned', 'not started', 'in progress'].includes(status.toLowerCase())) {
        this.userAction.edit = true;
      } else if ((published === 'Yes' && status && status.toLowerCase() === 'cancelled') ||
        (published === 'No' && status && status.toLowerCase() !== 'completed')) {
        this.userAction.edit = true;
        this.userAction.delete = true;
      }
    }

    this.preaudit_checklist_id = this.params.data.preaudit_checklist_id;
    return;
  }

  onClick() {

    if (this.params.data != undefined) {
      let pptyName = this.params["linkID"];
      let pptyValue= this.params.data[this.params["linkID"]]; ;
      
      if(pptyName == 'audit_category_id') {
        this._router.navigateByUrl("/AddEditCheckList/" + pptyValue );
      }
      else if(pptyName == 'parent_category_id') {
        this._router.navigateByUrl("/AddEditControl/" + pptyValue );
      }
      else if(pptyName=='audit_id'){
        this._router.navigateByUrl("/Newpreauditchecklist/" + pptyValue );
      }
      else if(pptyName == 'addEdit_Pre_audit_id') {
        sessionStorage.setItem('auditData', JSON.stringify(this.params.data));
        this._router.navigateByUrl("/AddEditAudit/" + this.audit_id);
      }
    }
  }
onClick1($event) {
  if (this.params.onClick instanceof Function) {
    // put anything into params u want pass into parents component
    const params = {
      event: $event,
      rowData: this.params.node.data
      // ...something
    }
    this.params.onClick(params);

  }
}


onClickView() {
  let auditValue= this.params.data[this.params["linkID"]];    
  let controlID= this.params.data["control_id"];    
  let audit_checklist_id = this.params.data["audit_checklist_id"];    
  
 
      if(this.params["linkID"] == "addEdit_Pre_audit_id")
      {
        this._router.navigateByUrl("/AddEditAudit/" + this.audit_id + "/view" );

      }else if(this.params["linkID"] == "audit_readiness_control"){
        this._router.navigateByUrl("/Mytasks/AuditReadiness/UpdateReadiness/"+ controlID + "/"+ this.audit_id);

      }else if(this.params["linkID"] == "preaudit_readiness_checklist"){
          this._router.navigateByUrl("/Mytasks/Preaudittasks/PreauditUpdateTasksComponent/Checklist/"+ this.audit_id + "/"+ audit_checklist_id);
      } else{
        this._router.navigateByUrl("/Newpreauditchecklist/"+ auditValue +"/view" );  
      }    
    }
    
  }

