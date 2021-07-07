import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-aggrid-link-button-my-tasks',
  templateUrl: './custom-aggrid-link-button-my-tasks.component.html',
  styleUrls: ['./custom-aggrid-link-button-my-tasks.component.css']
})
export class CustomAggridLinkButtonMyTasksComponent implements ICellRendererAngularComp, OnInit,AfterViewInit {
  params: any ;
  public audit_id : number;
  public myTask_audit_id : number;
  public myTask_preAuditCheckList_id : number;
  public myTask_ongoingAuditList_id : number;
  public progress_status : string;
  public editauditlinkId: string;
  // public task_status_action: string;
  public pending_with_action: string;
  public auditType : string;
  constructor(private _router: Router) { }

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
    this.audit_id = this.params.data.audit_id;
    
    this.editauditlinkId = this.params['linkID']
    if(this.params['linkID'] == 'myTask_audit_id'){
      this.myTask_audit_id = this.params.data.audit_id;
    }
    if(this.params['linkID'] == 'progress_status') {
        this.audit_id =  this.params.data.audit_id;
        this.progress_status = this.params.data.overall_progress_status;
    }
    if(this.params['linkID'] == 'myTask_preAuditCheckList_id') {
      this.myTask_preAuditCheckList_id =  this.params.data.audit_id;
    }
    if(this.params['linkID'] == 'myTask_ongoingAudit_id') {
      this.myTask_ongoingAuditList_id =  this.params.data.audit_id;
      this.auditType = this.params.data.audit_type;
    }
    if(this.params['linkID'] == 'ongoing_audit_action') {
      // this.task_status_action = this.params.data.task_status;
      this.pending_with_action = this.params.data.pending_with;
      
    }
    if(this.params['linkID'] == 'ongoing_preaudit_action') {​​​​​      
      this.pending_with_action = this.params.data.pending_with;
      
    }​​​​​
  }

  onClick() {
    if (this.params.data != undefined) {
      let pptyName = this.params["linkID"];
      let controlID= this.params.data["control_id"];          
      let audit_checklist_id= this.params.data["audit_checklist_id"];   
      //let pptyValue= this.params.data[this.params["linkID"]];
      if(pptyName == 'myTask_audit_id') {
        this._router.navigateByUrl("/Mytasks/" + this.myTask_audit_id );
      }
      if(pptyName == 'myTask_preAuditCheckList_id') {
        this._router.navigateByUrl("/Mytasks/Preaudittasks/" +  this.myTask_preAuditCheckList_id );
      }
      if(pptyName == 'myTask_ongoingAudit_id') {
        this._router.navigateByUrl("/Mytasks/Ongoingauditlist/" +  this.myTask_ongoingAuditList_id  + "/" + this.auditType);
      }
      if(pptyName == "ongoing_audit_action"){                
        this._router.navigateByUrl("/Mytasks/Ongoingaudits/Update/"+ this.audit_id + "/"+ controlID +"/AUDIT");        
    } 
      if(pptyName == "ongoing_preaudit_action"){                
        this._router.navigateByUrl("/Mytasks/Ongoingaudits/Update/"+ this.audit_id + "/"+ audit_checklist_id +"/PREAUDIT");        
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

}
