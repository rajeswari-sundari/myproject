import { Component, OnInit,AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AccLsViewData, CategoryRiskdetails, CategoryRiskSummaryDetails,ControlRiskDetails, DashboardSearchData } from '../../account-landscape';
import 'chart.piecelabel.js';
import { AccountLandscapeService } from '../../account-landscape.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-control-risk',
  templateUrl: './control-risk.component.html',
  styleUrls: ['./control-risk.component.css']
})
export class ControlRiskComponent implements OnInit{
  public categorysummary:CategoryRiskSummaryDetails[];
 //public controlRisks:ControlRiskDetails[];
  public controlLevelData : ControlRiskDetails[];
  //public parentCategory:any[];
  public colours:any[];
  public categoryRiskSummaryPercentage:any[];
  public Controls:any[];
  public controlcolors:any[];
  public controlRiskSummaryPercentage:any[];
  public datasets:any[];
  public parentCategoryID : string;
  public categoryID : string;
  public controlID : any;
  //public options:any[];
  public  dashboardSearchData : DashboardSearchData;
  accLsCategoryView: AccLsViewData;
  public userRole: string;
  public isSBURPOC: boolean = false;
  
  constructor(private router: Router,  private _routeParameters : ActivatedRoute,
    private _accountLandscapeServiceClient : AccountLandscapeService,private spinnerService : NgxSpinnerService ) { 
      this.dashboardSearchData = new DashboardSearchData();
      this.accLsCategoryView = new AccLsViewData();
     _routeParameters.params.subscribe((data) => {
      this.parentCategoryID = data["parentCategoryID"];
      this.categoryID = data["categoryID"];
      })
    }

  ngOnInit() {
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
    this.BarChartControlData();
  }
  
  BarChartControlData():void{
    this.dashboardSearchData.bu_name = null;
    this.dashboardSearchData.account_id = null;
    this.dashboardSearchData.project_id = null;
    this.spinnerService.show();
    this._accountLandscapeServiceClient.getDoughnutChartData(this.dashboardSearchData).subscribe((data :any[]) => {
    //  this.categoryLevel = data["categoryLevel"].filter(c=>c.parent_category_id == this.parentCategoryID && c.category_id == this.categoryID);
      this.controlLevelData =  data["controlLevel"].filter(d=>d.parent_category_id == this.parentCategoryID && d.category_id == this.categoryID);
      this.spinnerService.hide();
      this.controlLevelData.forEach(x=>{
        x.controlRiskPercentage = '80'
      });

      console.log(data["controlLevel"]);
      console.log(this.controlLevelData);
      this.Controls=this.controlLevelData.map(d=>d['control_name']);
      this.controlcolors=this.controlLevelData.map(d=>d['Color']);
      this.controlRiskSummaryPercentage=this.controlLevelData.map(d=>d['controlRiskPercentage']);
          this.datasets= [{
            barPercentage: 0.5, barThickness: 100, minBarLength: 2, label: 'controlPercentage',
            data: this.controlRiskSummaryPercentage,
            backgroundColor: this.controlcolors,
            hoverBackgroundColor: this.controlcolors,
          }]
     })
  }
 public options:any={
  tooltips: { enabled: false },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
        beginAtZero: true, max:10,autoSkip:false,maxRotation: 0,minRotation: 0, fontStyle:'Bold',
      },
      gridLines: {
        color: "rgba(0, 0, 0, 0)"
      }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,stepSize:25,max: 100, fontStyle:'Bold',  stacked: true
        }, gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
       }]  
      }
    } 
  RoutetoControlDetail() {
    this.router.navigateByUrl('/Accountlandscape/Control-detail/1');
  }
  BacktoLandscape() {
    this.router.navigateByUrl('Accountlandscape/0');
  }
  Barchartclick(event:any){  
    var control_label = event.active[0]._view['label'];    
    this.controlID = '';
    this.controlLevelData.forEach(x => {      
      if(x.control_name == control_label){
        this.controlID = x.control_id;
        return;
      }
    });
    console.log(this.controlID)
    this.accLsCategoryView.ControlName = control_label;
    this.accLsCategoryView.Followup = this.controlLevelData.find(x => x.control_id == this.controlID).follow_up_required;
    //this._accountLandscapeServiceClient.controlsViewDetail(this.accLsCategoryView);
    sessionStorage.setItem("accLSViewdata", JSON.stringify(this.accLsCategoryView));
    //var controlID = this.controlLevelData[0].control_id;
    this.router.navigateByUrl('/Accountlandscape/Control-detail/'+ this.controlID );
  }

 
}
