import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent,TabDirective } from "ngx-bootstrap/tabs";
import { ManageAuditsSearch,ManageAudits, SaveAuditControl } from './manageAuditsClasses'
import { Router,ActivatedRoute } from '@angular/router';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import {ManageAuditService} from './manage-audits.service';
import { CustomAGGridLinkButtonComponent } from '../Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { AgGridLinkComponent } from './ag-grid-link/ag-grid-link.component';
import { GridOptions } from 'ag-grid-community';
//import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../Shared/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



declare var jQuery: any;

@Component({
  selector: 'app-manage-audits',
  templateUrl: './manage-audits.component.html',
  styleUrls: ['./manage-audits.component.css']
})
export class ManageAuditsComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

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
  
  public tabsets:any[]=[
    {​​ title: 'Pre-audit',ID:1}​​,
    {​​ title: 'Pre-audit checklist',ID:2}​​,
    {​​ title: 'Post Audit',ID:3}​​]
    public tabid:number;
  

    constructor(public datepipe: DatePipe,private router: Router, private _manageAuditsServiceClient : ManageAuditService,
    private _routeParameters : ActivatedRoute, private modalService: BsModalService) {
     this.manageAuditsSearchData = new ManageAuditsSearch();
     this.deleteAuditControl = new SaveAuditControl();
     this.auditgridOptions = <GridOptions>{ }
    
   }
  //  private _matDialog: MatDialog,
   ngOnInit() {
     this.tabid=0;
     this.tabsets[0].active=true;
    this._routeParameters.params.subscribe((data) =>{
      this.tabid = data['tabActive'];
      if(!this.tabid) {
        this.tabid=0;
      }
      this.tabactive(this.tabid);
    });
  }
  Selecttab(tab:TabDirective):void{
    tab.active=true;
  }
  tabactive(tabId):void{
    this.tabsets[tabId].active=true;
  }

  

}
