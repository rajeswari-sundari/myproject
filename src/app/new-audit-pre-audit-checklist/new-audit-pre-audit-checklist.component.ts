import { Component, OnInit, ViewChild} from '@angular/core';
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import {​​​​​​​​ ActivatedRoute,Router }​​​​​​​​ from'@angular/router';
import {Newauditpreauditchecklistservice } from './new-audit-pre-audit-checklist.service'
import { ToastrService } from 'ngx-toastr';
import {GridOptions} from "@ag-grid-community/all-modules";
import{AuditList,AuditName,CheckListItems,CheckListItemsJson} from './newauditpreauditchecklist.Search';
import { NgxSpinnerService } from 'ngx-spinner';

 declare var jQuery:any;

@Component({
  selector: 'app-new-audit-pre-audit-checklist',
  templateUrl: './new-audit-pre-audit-checklist.component.html',
  styleUrls: ['./new-audit-pre-audit-checklist.component.css']
})
export class NewAuditPreAuditChecklistComponent implements OnInit {
  //  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  public AuditNameData:AuditName;
  public AuditNamefilterDD:AuditName[];
  public AuditNameList : AuditList ;
  public NewAuditList:AuditList;
  public tabMenu:any;
  public newaudit:any;
  public tabID:Number;
  public audit_id:string;
  public disabled:boolean;
  public isAdmin:boolean;
  public actionParam: string;
  public tabsets:any[]=[
    {​​ title: 'Checklist items',ID:1}​​,
    {​​ title: 'Manage Point Of Contact',ID:2}​​,
    {​​ title: 'Preview & publish',ID:3}​​]
  
 

  constructor(private _NewPreAuditChecklistServiceClient : Newauditpreauditchecklistservice,private _router:Router,
    public toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private _routeParameters : ActivatedRoute) {
      this.AuditNameData=new AuditName();
      this.AuditNameList=new AuditList();
     }
  
  ngOnInit() {
    this._routeParameters.params.subscribe((data) =>{
      this.audit_id = data['auditID'];
      this.actionParam = data['action'];
    });
    if(this.actionParam == 'view'){
      this.tabsets= [
        {​​ title: 'Checklist items',ID:1}​​,
        {​​ title: 'Manage Point Of Contact',ID:2}​​​​]
    }
    this.isAdmin = this.actionParam == 'view' ? true : false;
    this.newaudit="true";
    this.tabsets[0].active=true;


    this.spinnerService.show()
    this._NewPreAuditChecklistServiceClient.GetAuditList().subscribe((data : any[]) => {
      this.AuditNamefilterDD = data; 
      this.spinnerService.hide()
      if(this.audit_id!=null && this.audit_id!=""){
        this.AuditNameData.audit_id=this.audit_id;
        var ddval=this.AuditNamefilterDD.filter(d=>d['audit_id']==this.audit_id);
        this.AuditNameData.audit_name=ddval[0].audit_name;
        this.GetNewAuditList();
      }
      else{
        this.AuditNameData.audit_id=null;
        this.AuditNameData.audit_name=null;
      }
    });
    this.AuditNameList=null;
  }
  GetNewAuditList():void{
    if(this.AuditNameData.audit_id!="" && this.AuditNameData.audit_id!=null){
    jQuery("#auditerr").text("")
    jQuery("#AuditName").css('border-color', '');
    this.spinnerService.show()
    this._NewPreAuditChecklistServiceClient.GetNewAuditChecklist(this.AuditNameData).subscribe((data :any) => {
      if(data!=null && data!=""){
      this.AuditNameList = data; 
      console.log(this.AuditNameList);
      }
      else{
        this.AuditNameList = null;
       
      }
      this.spinnerService.hide()
    });
  }
  else{
    jQuery("#auditerr").text("Please select Auditname")
    jQuery("#AuditName").css('border-color', 'red');
  }
  }
  ChangeAuditDD():void{
    this.AuditNameData.audit_name=jQuery('#AuditName option:selected').text();
    if(this.AuditNameData.audit_id!=null && this.AuditNameData.audit_id!=""){
      jQuery("#auditerr").text("")
      jQuery("#AuditName").css('border-color', '');
    }
    else{
      jQuery("#auditerr").text("Please select Auditname")
      jQuery("#AuditName").css('border-color', 'red');
    }
  }
  ProceedAudit():void{
    jQuery("#auditerr").text("")
    jQuery("#AuditName").css('border-color', '');
    if(this.AuditNameList!=null)
    {
       this.tabMenu="true";
       this.newaudit=null;    
    }
    else{
    this.tabMenu=null;
    this.newaudit="true";
    }
  }
  Selecttab(tab:TabDirective):void{
    tab.active=true;
  }
  // tabactive(tabID):void{
  //   if(tabID==4){
  //   this.tabMenu=null;
  //   this.newaudit="true";
  //   }
  //  else
  //  {
  //   this.staticTabs.tabs[tabID].active = true;
  //  }
  // }
  tabactive(tabId):void{
    if(tabId==4){
    this.tabMenu=null;
    this.newaudit="true";
    }
   else
   {
    this.tabsets[tabId].active=true;
   }
  }
  CancelProceed() :void{
    jQuery("#auditerr").text("")
    jQuery("#AuditName").css('border-color', '');
    this._router.navigateByUrl('/Manageaudits/1');
  }


}
