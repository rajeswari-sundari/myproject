import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import {GridOptions} from "@ag-grid-community/all-modules";
import { ToastrService } from 'ngx-toastr';
//import {MatDialog} from '@angular/material/dialog';
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router';
import {Newauditpreauditchecklistservice } from '../new-audit-pre-audit-checklist.service';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component';
import{AuditList,AuditName,CheckListItems,CheckListItemsJson,PublishCheckList} from '../newauditpreauditchecklist.Search';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PreAuditRequest } from '../../manage-audits/manageAuditsClasses';


@Component({
  selector: 'app-publish-preview-check-list',
  templateUrl: './publish-preview-check-list.component.html',
  styleUrls: ['./publish-preview-check-list.component.css']
})
export class PublishPreviewCheckListComponent implements OnInit {
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
public publishCheckList:PublishCheckList;
public PreAuditRequest : PreAuditRequest ;

  constructor(private _NewPreAuditChecklistServiceClient : Newauditpreauditchecklistservice,private router:Router,
    public toastr: ToastrService, private modalService: BsModalService, private spinnerService: NgxSpinnerService,
    private _routeParameters : ActivatedRoute) { 
      this.CheckListJson=new CheckListItemsJson();
      this.AuditNameList=new AuditList();
      this.publishCheckList=new PublishCheckList();
      this.PreAuditRequest = new PreAuditRequest();
      this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No items added.Please add one or more items</span>`;
    this.noRowsTemplate =
      `<span">No items added.Please add one or more items</span>`;

      this.columnDefs = [
        {headerName: 'Checklist items', field: 'audit_checklist',filter:true, sortable :false},
        {headerName: 'Point of contact', field: 'Point_of_contact' ,filter:true, sortable :false},
        {headerName: 'Additional POC for email', field: 'Additional_POC_for_email' ,filter:true, sortable :false}
      ]
  
      this.defaultColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,lockPosition:true,editable:false };
     }
// private _matDialog: MatDialog, 
  ngOnInit() {
    this.AuditNameList=this.data;
    this.CheckListJson.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
    this.spinnerService.show()
    this._NewPreAuditChecklistServiceClient.LoadCheckListItems(this.CheckListJson).subscribe((data:any[])=>{
     this.rowData=data;
     this.spinnerService.hide()
    })
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
  Publish():void{
    if(this.rowData!=null  &&  this.rowData.length!=0){
      if(this.validationCheckList()){
        this.modalRef = this.modalService.show(ConfirmDialogComponent, {
          initialState: {
            title: "Publish pre-audit checklist",
            message: "Are you sure you want to publish the pre-audit checklist?",
            callback: (result) => {
              if(result == 'yes') {
                this.PreAuditRequest.p_preaudit_checklist_id = this.AuditNameList[0].preaudit_checklist_id;
                // this.PreAuditRequest.p_audit_id = this.AuditNameList[0].audit_id;
                // this.PreAuditRequest.p_audit_checklist_id = this.AuditNameList[0].audit_checklist_id;
                this.publishCheckList.preaudit_checklist_id=this.AuditNameList[0].preaudit_checklist_id;
                this._NewPreAuditChecklistServiceClient.PublishPreauditChecklist(this.publishCheckList).subscribe((data:any)=>{
                  if(data=="success"){
                    // PublishEmail/EmailPreAuditCheckListDeliveryDetails
                    this._NewPreAuditChecklistServiceClient.sendPublishmail(this.PreAuditRequest).subscribe((emaildata: any) => {                          
                      if (emaildata['msg'] == 'success') {
                       console.log('email success');
                      }else{
                      //  this.toastr.error("Email Notification Failed", 'error');
                      }
                    })
                    this.toastr.success("Audit readiness checklistId "+this.publishCheckList.preaudit_checklist_id+"  published successfully" ,'Success', { enableHtml: true });
                    this.router.navigateByUrl('/Manageaudits/1');
                  } else {
                    this.toastr.error("Failed", 'error');
                  }
                })
              }
            }
          }
        })
      }
    } else {
      this.toastr.error("Data Should not be empty", 'error');
    }
  }
BacktoManagePOC():void{
  this.tabactive.emit(1);
}
}
