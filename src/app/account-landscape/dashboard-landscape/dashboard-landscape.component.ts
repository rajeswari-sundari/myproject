import { Component, OnInit, Output, EventEmitter,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { CategoryRiskdetails, CategoryRiskSummaryDetails, PublishData,AccLsSearchProject,DashboardSearchData,AccLsSearchAccount, AccLsViewData, AccLsAccountOverview, AccLsAccountOverviewSearch, AccLsFilterBasedOnUserRequest,} from '../account-landscape';
import { KeyValuePairDTO } from '../../Common/KeyValuePairDTO';
import { Chart } from 'chart.js';
import 'chart.piecelabel.js';
import html2canvas from 'html2canvas';
import { AccountLandscapeService } from '../account-landscape.service';
import { NgForm, NgModel } from '@angular/forms';
import { environment } from  '../../../environments/environment';
import { NgxSpinnerService }  from 'ngx-spinner'


declare var jQuery: any;
@Component({
  selector: 'app-dashboard-landscape',
  templateUrl: './dashboard-landscape.component.html',
  styleUrls: ['./dashboard-landscape.component.css']
})
export class DashboardLandscapeComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild("dashboardPulishedform", {static: false}) dashboardForm: NgForm;

  public modalRef: BsModalRef;
  public categoryRisks : CategoryRiskdetails[];
  public categorysummary:CategoryRiskSummaryDetails[];
  public dashboardSearchData:DashboardSearchData;
  public AccLsSearchAccount:AccLsSearchAccount;
  public AccLsSearchProject:AccLsSearchProject;
  public parentCategory:any[];
  public BUList:any[];
  public AccountList:any[];
  public ProjectList:any[];
  public colours:any[];
  public categoryRiskSummaryPercentage:any[];
  public publishData : PublishData ;
  public screenshotfile : File;
  public datasets:any[];
  public publishPopBUList : any[];
  public pulishAccountList : any[];
  public publishProjectList : any[];
  public userRole: string;
  public isSBURPOC: boolean = false;
  public accLsCategoryView: AccLsViewData;
  public action : number;
  public accountOverview: AccLsAccountOverview;
  public accOverviewSearch: AccLsAccountOverviewSearch;
  public accountOverviewList: any;
  public accountOverviewEnabled: boolean = false;
  public acclsFilterBased: AccLsFilterBasedOnUserRequest;
  //public roleInfo: RoleWiseInfo;
  public isRpocApocMdu: boolean = false;

  constructor(
          private router: Router, 
          private modalService: BsModalService,
          private toastr: ToastrService,
          private _accountLandscapeServiceClient : AccountLandscapeService,
           private spinnerService : NgxSpinnerService,
           private _routeParameters : ActivatedRoute ) { 
             this.publishData = new PublishData();
             this.dashboardSearchData=new DashboardSearchData();
             this.AccLsSearchAccount=new AccLsSearchAccount();
             this.AccLsSearchProject=new AccLsSearchProject();
             this.accLsCategoryView = new AccLsViewData();
             this.accountOverview = new AccLsAccountOverview();
             this.accOverviewSearch = new AccLsAccountOverviewSearch();
             this.acclsFilterBased = new AccLsFilterBasedOnUserRequest();
             //this.roleInfo = new RoleWiseInfo();
          }


          
  ngOnInit() {
    
    //code for hiding content based on userroles
    this.userRole = sessionStorage.getItem('UserRole');
    //this.isSBU = this.userRole == 'SBU' ? true : false;
    if(sessionStorage.getItem("AccessSBU") == 'true' || 
    ((this.userRole == 'RPOC' || this.userRole == 'APOC') && sessionStorage.getItem('HasAccess') == 'true')) {
      this.isSBURPOC = true;
    }
    // if((sessionStorage.getItem('UserRole')=='RPOC' || sessionStorage.getItem('UserRole')=='APOC') && sessionStorage.getItem('HasAccess') == 'true') {
    //   this.isRpocApocMdu = true;
    // }
    
    this.router.navigateByUrl('/Accountlandscape/0');
    
    //if(this.action == 0) {
    var obj = JSON.parse(sessionStorage.getItem("accLSViewdata"));
      if(obj != null) {
        this.dashboardSearchData.bu_name= obj.Levelofview != "All BUs & SBUs" ? obj.Levelofview : null;
        this.dashboardSearchData.account_id = obj.AccountId;
        this.dashboardSearchData.project_id = obj.ProjectId;
      } 
      else {
        this.dashboardSearchData.bu_name=null;
        this.dashboardSearchData.account_id=null;
        this.dashboardSearchData.project_id=null;
      }
      this.loadFilterBasedUser();
      this.LoadAccounts(this.dashboardSearchData.bu_name);
      this.LoadProjects();
    // } 
      // else {
      //    this.dashboardSearchData.bu_name=null;
      //    this.dashboardSearchData.account_id=null;
      //    this.dashboardSearchData.project_id=null;
      // }
  
 
    this.doughnutchartdata(this.dashboardSearchData);
    //this.BarChartData();
    //this.ClearFilter();
    this.ClearPublish();

    this._accountLandscapeServiceClient.getBUandSBUList().subscribe((data : KeyValuePairDTO[]) => {
      this.BUList = data; 
      this.publishPopBUList = data;
    }); 
      
    
  }
  LoadAccounts(selectedBU : any){
  // this.dashboardSearchData.account_id=null;
  // this.dashboardSearchData.project_id=null;
    this.AccLsSearchAccount.LevelofView=selectedBU;//jQuery('#BU option:selected').text();
    this._accountLandscapeServiceClient.getAccountList(this.AccLsSearchAccount).subscribe((data : any[]) => {
      this.AccountList = data; 
    }); 
  }
  PublishLoadAccounts(selectedPublishBU : any ){
    this.publishData.account_id=null;
    this.publishData.project_id=null;
      this.AccLsSearchAccount.LevelofView= selectedPublishBU;
      this._accountLandscapeServiceClient.getAccountList(this.AccLsSearchAccount).subscribe((data : any[]) => {
        this.pulishAccountList = data; 
      }); 
    }
  LoadProjects(){
  // this.dashboardSearchData.project_id=null;
    this.AccLsSearchProject.LevelofView=this.dashboardSearchData.bu_name;//jQuery('#BU option:selected').text();
    this.AccLsSearchProject.Accountid=this.dashboardSearchData.account_id;
    this.accountOverviewEnabled = this.AccLsSearchProject.Accountid != null ? true : false;
    this._accountLandscapeServiceClient.getProjectList(this.AccLsSearchProject).subscribe((data : any[]) => {
      this.ProjectList = data; 
    }); 
  }
  PublishLoadProjects(){
    this.publishData.project_id=null;
     this.AccLsSearchProject.LevelofView=this.publishData.bu_name;
     this.AccLsSearchProject.Accountid=this.publishData.account_id;
     this._accountLandscapeServiceClient.getProjectList(this.AccLsSearchProject).subscribe((data : any[]) => {
       this.publishProjectList = data; 
     }); 
   }

  ClearFilter(){
  this.dashboardSearchData.bu_name=null;
  this.dashboardSearchData.account_id=null;
  this.dashboardSearchData.project_id=null;
  this.doughnutchartdata(this.dashboardSearchData)
  }

  ClearPublish() {
    this.publishData.bu_name = null;
    this.publishData.associateIds = null;
    this.publishData.project_id = null;
    this.publishData.dashboard_name = null;
    //this.publishData.dashboardName.
    this.publishData.account_id = null;
    
  }

  Overviewpopup() {
    jQuery("#Overviewpopup").modal();
    this.accOverviewSearch.AccountID = this.dashboardSearchData.account_id;
    this.accOverviewSearch.BU = this.dashboardSearchData.bu_name;
    this._accountLandscapeServiceClient.getAccountOverview(this.accOverviewSearch).subscribe((data: any[]) => {
      console.log(data);
      this.accountOverviewList = data;
      console.log(this.accountOverviewList)
    })
  }

  closeOverview() {
    jQuery("#Overviewpopup").modal('hide');
  }

  loadFilterBasedUser() {
    this.acclsFilterBased.p_user_id = sessionStorage.getItem('UserID');
    
    this._accountLandscapeServiceClient.getLoadFilterbased(this.acclsFilterBased).subscribe((data: any) => {
      console.log(data);
      this.dashboardSearchData.bu_name = data.BU;
      this.dashboardSearchData.account_id = data.Account;
      this.dashboardSearchData.project_id = data.project;
      console.log(this.dashboardSearchData)
    })
    this.LoadAccounts(this.dashboardSearchData.bu_name);
    this.LoadProjects();
  }

  screenshot() : string {
   // console.log('bharath');
   var resultdata = null;
    var maxHeight = Math.max(document.body.scrollHeight,
      document.body.offsetHeight, document.documentElement.clientHeight,
      document.documentElement.scrollHeight, document.documentElement.offsetHeight) ;// > 1470 ? 1470 :1470;
    //  var maxHeight = 1470;
      var maxWidth = Math.max(document.body.scrollWidth,
      document.body.offsetWidth, document.documentElement.clientWidth,
      document.documentElement.scrollWidth, document.documentElement.offsetWidth);
      html2canvas(document.querySelector("#capture"), { height : maxHeight, width : maxWidth } ).then(canvas => {
    //html2canvas(document.querySelector("#capture")).then(canvas => {
   //   this.publishData.screenShot = canvas.toDataURL();
      document.body.appendChild(canvas);
     let formData = new FormData();
     const imageBlob = this.dataURItoBlob(canvas.toDataURL());
     // var blob = new Blob([canvas.toDataURL()], {type: 'image/png'});
      this.screenshotfile = new File([imageBlob], 'screenshot', { type: 'image/png' });
      
      formData.append('file', this.screenshotfile, this.publishData.published_file_name);

     // console.log("canvas.toDataURL() -->" + this.publishData.screenShot);
      document.body.removeChild(canvas);
      // canvas.toBlob(function (blob) {
        
      //   //  just pass blob to something expecting a blob
      //   // somfunc(blob);

      //   // Same as canvas.toDataURL(), just longer way to do it.
       
      //   var reader = new FileReader();
      //   this.screenshotfile = "";
      //  this.screenshotfile = new File([blob], 'screenshot')
      //  // reader.readAsDataURL(blob);
      //   formData.append('file', this.screenshotfile, 'DashboardScreen');
      //   // reader.onloadend = function () {
      //   //   reader.readAsDataURL();
      //   //  // console.log("Base64--> " + base64data);
      //   // }
      //   console.log(formData);
      

      // });
      //console.log(formData);
      this._accountLandscapeServiceClient.Screenshotupload(formData).subscribe((data: any) => {
        resultdata = data;
        });
    });
    return resultdata;
  }

  Publishpopup() {
    this.ClearPublish();
    jQuery("#Publishpopup").modal();
  }
  dataURItoBlob(dataURI){
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  closePublish() {
    //jQuery("#Publishpopup").setFocusable(false)
 
    jQuery("#Publishpopup").modal('hide');
    this.dashboardForm.resetForm();
    this.ClearPublish();
  }

  Publishdashboard() {
   // if(screenshotdata != 'failure') {
      this.publishData.account_name = this.pulishAccountList.find(x=>x.Key == this.publishData.account_id).Value;
      this.publishData.project_name = this.publishProjectList.find(x=>x.Key == this.publishData.project_id).Value;
      this.publishData.p_user_id =sessionStorage.getItem('UserID');
      this.publishData.published_file_name = this.publishData.dashboard_name + '.png';
      this._accountLandscapeServiceClient.savePublishDashboard(this.publishData).subscribe((data: any) => {
          console.log(data);
         
          if(data == 'success') {
            this.screenshot();
            this.toastr.success("Account landscape dashboard published successfully.", "Success");
            jQuery("#Publishpopup").modal('hide');
          }
          else if(data == 'Dashboard name exist' ) {
            this.toastr.error("Dashboard name exist.", 'error');
          }
          else if(data == 'Associate iD not match' ) {
            this.toastr.error("Entered valid associate IDs.", 'error');
          }
          else {
            this.toastr.error("Account landscape dashboard published failed.", 'error');
          }
        });
       
       
   // }
    // else {
    //   this.toastr.error("Account landscape dashboard published failed.", 'error');
    // }
  }

  checkDashboardPublishData() : boolean {
    if(this.publishData.dashboard_name == null || this.publishData.bu_name == null || this.publishData.associateIds == null) {
        return false;
      } else {
        return true;
      }
  }
  
  doughnutchartdata(data : DashboardSearchData) : void {
    // this.accLsSearchData.bu_name = null;
    // this.accLsSearchData.account_id = null;
    // this.accLsSearchData.project_id = null;
    this.spinnerService.show();
    this._accountLandscapeServiceClient.getDoughnutChartData(data).subscribe((data :any[]) => {
      this.categoryRisks = data['categoryLevel']; 
      this.spinnerService.hide();
      console.log(data);
     // var percentage = 100/this.categoryRisks.length;
     // console.log(percentage)
      this.categoryRisks.forEach(element => {
            element.Color = [{'backgroundColor' : element.Color , 'hoverBackgroundColor' : element.Color}];
       });
       this.categorysummary = data['ParentCategoryLevel'];
       this.categorysummary.forEach(x=>{
         x.percentageValue = '80'
       });
       console.log(this.categorysummary);
       this.parentCategory=this.categorysummary.map(d=>d['parent_category_name']);
       this.colours=this.categorysummary.map(d=>d['color']);
       this.categoryRiskSummaryPercentage= this.categorysummary.map(d=>d['percentageValue']);
           this.datasets= [{
             barPercentage: 0.5,barThickness: 'flex', minBarLength: 2, label: 'Chart',
             data: this.categoryRiskSummaryPercentage,
             backgroundColor: this.colours,
             hoverBackgroundColor: this.colours
           }]

       // console.log(data);
      });
  }

  // BarChartData():void{
   
  //   this._accountLandscapeServiceClient.getBarChartData().subscribe((dataobj :any[]) => {
  //     this.categorysummary = dataobj; 
  //     this.parentCategory=this.categorysummary.map(d=>d['parentCategoryName']);
  //     this.colours=this.categorysummary.map(d=>d['categoryRiskFlag']);
  //     this.categoryRiskSummaryPercentage=this.categorysummary.map(d=>d['categoryRiskSummaryPercentage']);
  //         this.datasets= [{
  //           barPercentage: 0.5,barThickness: 'flex', minBarLength: 2, label: 'Chart',
  //           data: this.categoryRiskSummaryPercentage,
  //           backgroundColor: this.colours,
  //           hoverBackgroundColor: this.colours
  //         }]
  //       })
      
  //   }
  
 public options:any={
    tooltips: { enabled: false,
 },
    legend: {
      labels: {
      filter: function(item,myChart) { return !item.text.includes('Chart'); },
    },
   },
    scales: {
      xAxes: [{
          ticks: {
            beginAtZero: true,autoSkip:false, maxRotation: 30,minRotation: 30,fontStyle:'Bold'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)"
          }
        }],
      yAxes: [{
        ticks: {
          beginAtZero: true,stepSize:20, max: 80,display:false,fontStyle:'Bold'
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }]
    } 
  }

  public chartOptions: any = {
     pieceLabel:{ render: 'label',
     fontSize: 10,
    fontStyle: 'bold',
     fontColor: '#fff',
     fontFamily:'"TTNorms-Regular"'} ,
     tooltips: { enabled: false,
     },
    //  cutoutPercentage: 50
    //  legend: {
    //   position: 'top',
    //   fontSize: 14,
    // fontStyle: 'bold'
    // },
     
  }

     
  

  chartclick(e : any, index : any) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
         // const label = chart.data.labels[clickedElementIndex];
          // get value by index
        //  const value = chart.data.datasets[0].data[clickedElementIndex];
          var categoryID = this.categoryRisks[index].category_id[clickedElementIndex];
          var parentCategoryID = this.categoryRisks[index].parent_category_id;
          //console.log(clickedElementIndex, label, value)
          this.accLsCategoryView.ParentCategoryName = this.categoryRisks[index].parent_category_name;
          this.accLsCategoryView.CategoryName = this.categoryRisks[index].category_name[clickedElementIndex];
          this.accLsCategoryView.CategoryRAGColor = activePoints[0]._view.backgroundColor;
          this.accLsCategoryView.Levelofview = this.dashboardSearchData.bu_name != null ? this.dashboardSearchData.bu_name : "All BUs & SBUs";
          this.accLsCategoryView.ProjectName = this.dashboardSearchData.project_id != null ? this.ProjectList.find(x=>x.Key == this.dashboardSearchData.project_id).Value :"All projects";
          this.accLsCategoryView.ProjectId =  this.dashboardSearchData.project_id;
          this.accLsCategoryView.AccountId = this.dashboardSearchData.account_id;
          this.accLsCategoryView.AccountName =this.dashboardSearchData.account_id != null ? this.AccountList.find(x=>x.Key == this.dashboardSearchData.account_id).Value : "All accounts";
         // this._accountLandscapeServiceClient.controlsViewDetail(this.accLsCategoryView);
          // this.accLsCategoryView.Followup = this.categoryRisks[index].follow_up_required
          sessionStorage.setItem("accLSViewdata", JSON.stringify(this.accLsCategoryView));



          this.router.navigateByUrl('/Accountlandscape/Control-risk/'+ parentCategoryID + '/' + categoryID);   
      }
  }
  }
  
  /*
  this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: "Publish dashboard",
        message: "Are you sure you want to publish the dashboard?",
        callback: (result) => {
          if(result == "yes") {
            this.toastr.success("Account landscape dashboard published successfully.","Success");
          } else {
            console.log("no");
          }
        }
      }
    })
  */
}
