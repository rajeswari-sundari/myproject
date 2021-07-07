import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { ControlLandscapeService } from '../control-landscape.service';
import { ManageControlsSearch,ManageControls,ManageControlsdata,MetricJsonControl} from '../controlLandscapeClass';
import { GridOptions } from "@ag-grid-community/all-modules";
import { KeyValuePairDTO } from '../../../Common/KeyValuePairDTO';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-control-definition',
  templateUrl: './control-definition.component.html',
  styleUrls: ['./control-definition.component.css']
})
export class ControlDefinitionComponent implements OnInit {

  public modalRef: BsModalRef;
  public AcclsMetricsrow: any[];
  public AcclsMetricscolumn: any[];
  public AcclsMetricsdefaultColDef;
  public AcclsMetricsloadingTemplate;
  public noAcclsMetricsRowsTemplate;
  public parentCategories: any[];
  public Categories: any[];
  public metricsDefinitionSearchData: ManageControlsSearch;
  public MetricJsonControl: MetricJsonControl;
  public gridOptions: GridOptions;
  public errorMessage : string;
  public controls: ManageControls[] = [];
  
  constructor(private _metricsDefinitionServiceClient: ControlLandscapeService,private modalService: BsModalService, private router: Router, 
    private toastr: ToastrService,private _router: Router, private spinnerService: NgxSpinnerService ) { 
    this.metricsDefinitionSearchData = new ManageControlsSearch();
     this.MetricJsonControl = new MetricJsonControl();

  } 

  ngOnInit() {
    this.AcclsMetricsloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Metrics are added.</span>`;

    this.noAcclsMetricsRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Metrics are added.</span>`;

    this.AcclsMetricscolumn = [
      
      { headerName: 'Control', field: 'control_name', editable: false },   
      { headerName: 'Red(%)', field: 'red_percent' },      
      { headerName: 'Amber(%)', field: 'amber_percent' },
      { headerName: 'Green(%)', field: 'green_percent' }
    ];

    this.AcclsMetricsdefaultColDef = {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
      flex: 1,
      lockPosition:true,
    }

/////// editing staarts
this.gridOptions = <GridOptions>
{
  columnDefs: this.AcclsMetricscolumn,

  defaultColDef: this.AcclsMetricsdefaultColDef,

  rowData: this.AcclsMetricsrow,
  
  singleClickEdit:true,

  onCellEditingStarted: function (event) {    
  },

  onCellEditingStopped: (event) => {    
    if (event.value != undefined && event.value != null && event.value != "") {
      //event.node.setDataValue(event.column, event.value.replace(/[^0-9\-]/gi, ''));
      //let reg = /^(\d+-?)+\d+$/;
      let reg = /^([0-9]+)$/;
      let val = event.value;
      console.log(reg.test(val))
      if (reg.test(val) == false) {
        event.node.setDataValue(event.column, "");
      }
       else if (event.value > 200) {
         event.node.setDataValue(event.column, "");
       }
      // else{
      //   if(event.value.includes("-")){
      //     {
      //       let splittedValues = event.value.split("-");
      //       if(Number(splittedValues[0]) > Number(splittedValues[1]) || Number(splittedValues[0]) > 100 || Number(splittedValues[1]) > 100 || splittedValues[0] == splittedValues[1])
      //       {
      //         event.node.setDataValue(event.column, "");
      //       }
         
      //     }
      //   }else{
      //     event.node.setDataValue(event.column, "");
      //   }
      // }
   


    }             
  },

  stopEditingWhenGridLosesFocus: true,

}
////// editing ends
    this.metricsDefinitionSearchData.ParentCategoryID = 0;
    this.metricsDefinitionSearchData.CategoryID = 0;

    this._metricsDefinitionServiceClient.getParentCategory().subscribe((data: KeyValuePairDTO[]) => {
      this.parentCategories = data;
    });
    this.GetMetrics(this.metricsDefinitionSearchData);


  }
  GetMetrics(metricsDefinitionSearchData) {
    this.spinnerService.show()
    this._metricsDefinitionServiceClient.getControls(metricsDefinitionSearchData).subscribe((data: ManageControls[]) => {
       // this.controls = data;
        this.AcclsMetricsrow = data;
         if (data.length > 0) {
        this.controls = data.filter(d => d['control_id']>0);
        this.AcclsMetricsrow = this.controls;        
      }
      else
      {
        this.controls = null;
        this.AcclsMetricsrow = null;
      }
      this.spinnerService.hide()
    });
  }
  LoadCategory() {
    this.Categories = null;
    this.metricsDefinitionSearchData.CategoryID = 0;
    if (this.metricsDefinitionSearchData.ParentCategoryID > 0) {
      this._metricsDefinitionServiceClient.getCategory(this.metricsDefinitionSearchData).subscribe((data: KeyValuePairDTO[]) => {
        this.Categories = data;
        console.log(this.Categories);
      });
    }
  }
  SearchControls(): void {
    this.GetMetrics(this.metricsDefinitionSearchData);

  }
  ResetControls(): void {
    this.Categories = null;
    this.parentCategories = null;
    this.metricsDefinitionSearchData.ParentCategoryID = 0;
    this.metricsDefinitionSearchData.CategoryID = 0;
    this.metricsDefinitionSearchData.Control = '';    
    this.GetMetrics(this.metricsDefinitionSearchData);
    this._metricsDefinitionServiceClient.getParentCategory().subscribe((data: KeyValuePairDTO[]) => {
      this.parentCategories = data;
    });
  }



  SaveMetrics() {
    /* removing popup
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: 'Save Metrics',
        message: 'Are you sure you want to save the metrics?',
        callback: (result) => {
          if (result === 'yes') {   
            */ 
            this.MetricJsonControl.accLsManagecontrolcontext  = this.controls;            
            this.MetricJsonControl.user_id = sessionStorage.getItem('UserID');
            // validation check here
            if (this.validateMetrics()) {
              this._metricsDefinitionServiceClient.saveMetrics(this.MetricJsonControl).subscribe((data: any) => {
                //this.rowData = data;
                //console.log(data);
                if (data == "success") {                 
                 this.toastr.success("Metrics defined successfully" ,'Success', { enableHtml: true });
               } else {
                this.toastr.error("Metrics not saved", 'error');
               }
              });
            }else{
              
            }
            /*
          } else {
            console.log('no');
          }
        }
      }
    })
    */ // removing popup
  }



  validateMetrics(): any {
    let val = true;
    if(this.controls != null) {      
      for(let x of  this.controls) {
        if ((x.red_percent == "" || x.green_percent == "" || x.amber_percent == "") ||
        (x.red_percent == "undefined" || x.green_percent == "undefined" || x.amber_percent == "undefined")) {
          this.errorMessage = "Control : " + x.control_name + " : data should not be empty ";
          this.toastr.error(this.errorMessage, 'error');
          val = false;
          return val;
        }
        else {              
          if (x.red_percent.indexOf("-") <= 0 && x.amber_percent.indexOf("-") <= 0 && x.green_percent.indexOf("-") <= 0 ) {
            // Check all values are range 
            console.log("Number");
            // x.metrics_type = "Range";
            // if(Number(x.red_percent) > Number(x.amber_percent) || Number(x.amber_percent) > Number(x.green_percent) || Number(x.red_percent) > Number(x.green_percent)) {
            //   this.errorMessage = "Control : " + x.control_name + " :  has invalid number value";
            //   this.toastr.error(this.errorMessage, 'error');
            //   val = false;
            //   return val;
            // }
            // let redArr = x.red_percent.split("-");
            // let amberArr = x.amber_percent.split("-");
            // let greenArr = x.green_percent.split("-");
            // let nextamber= Number(redArr[1]) + 1;
            // let nextgreen= Number(amberArr[1]) + 1;
            // let test1 = Number(amberArr[0])-1;
            // let test2 = Number(redArr[0])-1;
            // if(redArr[0] > greenArr[0]) {// descending order
            //   if(Number(greenArr[1]) ==  test1 && Number(amberArr[1]) == test2) {
            //   //val= true;return val;
            //   } else {
            //     this.errorMessage = "Control : " + x.control_name + " :  has invalid range value";
            //     this.toastr.error(this.errorMessage, 'error');
            //     val = false;
            //     return val;
            //   }
            // }
            // else { 
            //   if(Number(amberArr[0]) == nextamber && Number(greenArr[0]) == nextgreen) { // incase of ascending order
            //     // val= true;
            //     //return val;
            //   } else {
            //     //if(Number(redArr[1]) >= Number(amberArr[0]) || Number(amberArr[1]) >= Number(greenArr[0]))   {
            //     // Check A>B>C>D
            //     this.errorMessage = "Control : " + x.control_name + " :  has invalid range value";
            //     this.toastr.error(this.errorMessage, 'error');
            //     val = false;
            //     return val;
            //   }
            // }
          }        
          else {
            this.errorMessage = "Control : " + x.control_name + " : should have Number value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }
          if ( // Invalid value check like 10-10-10
          (x.red_percent.indexOf("-") != x.red_percent.lastIndexOf("-")) || (x.green_percent.indexOf("-") != x.green_percent.lastIndexOf("-")) ||
          (x.amber_percent.indexOf("-") != x.amber_percent.lastIndexOf("-"))) {
            this.errorMessage = "Control : " + x.control_name + " :  has invalid value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }        
        }
      }  // for looop ends here
    } // if control not null ends here
    else {
      val = false;
    }
    return val;
  } // validatemetrics ends here

  GotoControl(){    
    this._router.navigateByUrl('/Accountlandscape/1');
  }
}
