import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { AccLsSearchControlData, AccLsViewData } from '../../account-landscape';
import { AccountLandscapeService } from '../../account-landscape.service';
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-control-detail',
  templateUrl: './control-detail.component.html',
  styleUrls: ['./control-detail.component.css']
})
export class ControlDetailComponent implements OnInit {

  public detailedRow: any[];
  public resultcolumn :any[];
  public detailedColumn:any [];
  public defaultdetailedColDef;
  public detailedloadingTemplate;
  public nodetailedRowsTemplate;
  public accLsSearchControl : AccLsSearchControlData;
  public controlID : number;
  public accLsCategoryView : AccLsViewData;
  public userRole: string;
  public isSBURPOC: boolean = false;

  constructor(private _accountLandscapeServiceClient : AccountLandscapeService,  private _routeParameters : ActivatedRoute, private spinnerService : NgxSpinnerService) {
    _routeParameters.params.subscribe((data) => {
        this.controlID = data["cID"];
    });
    this.accLsSearchControl = new AccLsSearchControlData();
    this.resultcolumn =[];
   }

  ngOnInit() {
    this.detailedloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Control detailed records are updated.</span>`;

    this.nodetailedRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Control detailed records are updated.</span>`;
    this.controldata();

    this.defaultdetailedColDef = {
      editable: false, sortable: false, filter:true, resizable: true, flex: 1, lockPosition:true
    }
    // this._accountLandscapeServiceClient.currentAccLanControlViewDetails.subscribe(d =>
    //   {
    //     this.accLsCategoryView= d
    //   } ); 
    this.userRole = sessionStorage.getItem('UserRole');
    //this.isSBU = this.userRole == 'SBU' ? true : false;
    if(sessionStorage.getItem("AccessSBU") == 'true' || 
    ((this.userRole == 'RPOC' || this.userRole == 'APOC') && sessionStorage.getItem('HasAccess') == 'true')) {
      this.isSBURPOC = true;
    }
      this.accLsCategoryView=JSON.parse(sessionStorage.getItem("accLSViewdata"));
  }

  controldata() : void {
    this.accLsSearchControl.Levelofview = null;
    this.accLsSearchControl.ProjectId = null;
    this.accLsSearchControl.AccountId = null;
    this.accLsSearchControl.controlId = this.controlID;
    this.spinnerService.show();
    this._accountLandscapeServiceClient.getControlLevelData(this.accLsSearchControl).subscribe((data :any[]) => {
      //Dynamic column loading functionality 
    this.resultcolumn.push(data["GridHeader"].map(t => {
        return {
          headerName: t,
          field : t,
        };
      }));
    this.detailedColumn = this.resultcolumn[0];
    this.detailedRow = data["GridValues"];
    this.spinnerService.hide();
    });
  }

  DownloadReport() {
      this.accLsSearchControl.controlId = this.controlID;
    this.accLsSearchControl.Levelofview = null;
    this.accLsSearchControl.ProjectId = null;
    this.accLsSearchControl.AccountId = null;    
    this.accLsSearchControl.IsDownload = true;
    this._accountLandscapeServiceClient.getDownloadData(this.accLsSearchControl).subscribe((data: any) => {         
      //this._accountLandscapeServiceClient.exportAsExcelFile(data, "Control-Detail-report");                 
      console.log('success')
      this._accountLandscapeServiceClient.exportAsExcelFile(data.GridValues, "Control-Detail-report");
    }) 
  }

}
