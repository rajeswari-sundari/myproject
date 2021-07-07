import { Component, OnInit } from '@angular/core';
import { MetricsDefinitionService } from './metrics-definition.service';
import { MetricsDefinitionSearch, ManageMetricsControls, MetricsJonControl } from './metricsDefinitionSearch';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO'
import { param } from 'jquery';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-metrics-definition',
  templateUrl: './metrics-definition.component.html',
  styleUrls: ['./metrics-definition.component.css']
})

export class MetricsDefinitionComponent implements OnInit {

  public metricsDefinitionSearchData: MetricsDefinitionSearch;
  public parentCategories: any[];
  public Categories: any[];
  public columnDefs: any[];
  public rowData: any[];
  public defaultColDef;
  public columnDefs1: any[];
  public rowData1: any[];
  public metricsType: string;
  public components;
  public gridOptions: GridOptions;
  public controls: ManageMetricsControls[] = [];
  public  errorMessage : string;
  public jsonControls : MetricsJonControl;
  public onCellEditingStopped : any;
  public onCellEditingStarted : any;

  constructor(private _metricsDefinitionServiceClient: MetricsDefinitionService,public toastr: ToastrService,
    private spinnerService: NgxSpinnerService) {
    this.metricsDefinitionSearchData = new MetricsDefinitionSearch();
    this.jsonControls = new MetricsJonControl();
  }

  ngOnInit() {

    this.parentCategories = [{ Key: 0, Value: "Select Parent Category" }];
    this.Categories = [{ Key: 0, Value: "Select Category" }];
    this.spinnerService.show()
    this._metricsDefinitionServiceClient.getParentCategory().subscribe((data: KeyValuePairDTO[]) => {
      this.parentCategories = this.parentCategories.concat(data);
      this.spinnerService.hide()
      //console.log(this.parentCategories);
    });

    this.metricsDefinitionSearchData.ParentCategoryID = 0;
    this.metricsDefinitionSearchData.CategoryID= 0;
    this.metricsType = "Range";

    this._metricsDefinitionServiceClient.getControls(this.metricsDefinitionSearchData).subscribe((data: any[]) => {
      if (data.length > 0) {
        this.controls = data.filter(d => d['control_id']>0);
        this.rowData = this.controls;
        //this.rowData1 = data;
        //console.log(data);
      }

    });

    this.columnDefs = [
      { headerName: 'Control ID', field: 'control_id', editable: false },
      { headerName: 'Control', field: 'control_name', editable: false },
      {
        headerName: 'Cliff (%)', field: 'cliff_percent'
      },
      { headerName: 'Need improvement(%)', field: 'need_improvement_percent' },
      //{headerName: 'Control ID', field: 'ControlID'},      
      { headerName: 'Partially ready (%)', field: 'partially_ready_percent' },
      { headerName: 'Audit ready (%)', field: 'audit_ready_percent' }
    ];

    this.defaultColDef = {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
      flex: 1,
      lockPosition:true,
    }

    this.gridOptions = <GridOptions>
      {
        columnDefs: this.columnDefs,

        defaultColDef: this.defaultColDef,

        rowData: this.rowData,
        
        singleClickEdit:true,

        onCellEditingStarted: function (event) {
          //console.log('cellEditingStarted');
          //alert("Start");
        },

        onCellEditingStopped: (event) => {
          //console.log('cellEditingStopped');
          //alert(event.value);
          if (event.value != undefined && event.value != null && event.value != "") {
            //event.node.setDataValue(event.column, event.value.replace(/[^0-9\-]/gi, ''));
            //let reg = /^(\d+-?)+\d+$/;
            let reg = /^([0-9]+-)*[0-9]+$/;
            let val = event.value;
            if (reg.test(val) == false) {
              event.node.setDataValue(event.column, "");
            }
            else if (event.value > 100) {
              event.node.setDataValue(event.column, "");
            }
            else if(event.value.includes("-"))
            {
              let splittedValues = event.value.split("-");
              console.log(splittedValues);
              console.log(splittedValues[0]);
              console.log(splittedValues[1]);
              if(Number(splittedValues[0]) > Number(splittedValues[1]) || Number(splittedValues[0]) > 100 || Number(splittedValues[1]) > 100)
              {
                event.node.setDataValue(event.column, "");
              }
            }

          }             
        },

        stopEditingWhenGridLosesFocus: true,

      }

  }


  SearchControls(): void {
    console.log('search...');
    this._metricsDefinitionServiceClient.getControls(this.metricsDefinitionSearchData).subscribe((data: any[]) => {
      if (data.length > 0) {
        this.controls = data.filter(d => d['control_id']>0);
        this.rowData = this.controls;
        //console.log(data);
      }
      else
      {
        this.controls = null;
        this.rowData = null;
      }
    });

  }

  ResetControls(): void {

    console.log(this.metricsDefinitionSearchData);
    this.metricsDefinitionSearchData.ParentCategoryID = 0;
    this.Categories = null;
    this.Categories = [{ Key: 0, Value: "Select Category" }];
    this.metricsDefinitionSearchData.CategoryID = 0;
    //this.metricsDefinitionSearchData.ControlID = null;
    this.metricsDefinitionSearchData.Control = '';
    this.SearchControls();

  }

  LoadCategory(): void {

    this.Categories = null;
    this.Categories = [{ Key: 0, Value: "Select Category" }];
    this.metricsDefinitionSearchData.CategoryID = 0;
    if (this.metricsDefinitionSearchData.ParentCategoryID > 0) {
      this._metricsDefinitionServiceClient.getCategory(this.metricsDefinitionSearchData).subscribe((data: KeyValuePairDTO[]) => {
        this.Categories = this.Categories.concat(data);

      });
    }
  }

  validateMetrics(): any {
    let val = true;
    if(this.controls != null)
    {
      //this.controls.every(x => {
        for(let x of  this.controls) {
      if ((x.cliff_percent == "" || x.need_improvement_percent == "" || x.partially_ready_percent == "" || x.audit_ready_percent == "") ||
        (x.cliff_percent == "undefined" || x.need_improvement_percent == "undefined" || x.partially_ready_percent == "undefined" || x.audit_ready_percent == "undefined")) {
        this.errorMessage = "Control : " + x.control_name + " : data should not be empty ";
        this.toastr.error(this.errorMessage, 'error');
        val = false;
        return val;
        
      }
      else {
        if (x.cliff_percent.indexOf("-") > 0 && x.need_improvement_percent.indexOf("-") > 0 && x.partially_ready_percent.indexOf("-") > 0 && x.audit_ready_percent.indexOf("-") > 0 ) {
          // Check all values are range 
          console.log("Range");
          x.metrics_type = "Range";

          let cliffArr = x.cliff_percent.split("-");
          let needImpArr = x.need_improvement_percent.split("-");
          let partReadyArr = x.partially_ready_percent.split("-");
          let auditReadyArr = x.audit_ready_percent.split("-");

          if(Number(cliffArr[1]) >= Number(needImpArr[0]) || Number(needImpArr[1]) >= Number(partReadyArr[0])  ||
          Number(partReadyArr[1]) >= Number(auditReadyArr[0]))
          {
            // Check A>B>C>D
            this.errorMessage = "Control : " + x.control_name + " :  has invalid range value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }

        }
        else if (x.cliff_percent.indexOf("-") <= 0 && x.need_improvement_percent.indexOf("-") <= 0 && x.partially_ready_percent.indexOf("-") <= 0 && x.audit_ready_percent.indexOf("-") <= 0) {
          // Check all values are Numbers
          console.log("Number");
          x.metrics_type = "Number";

          if(Number(x.cliff_percent) > Number(x.need_improvement_percent) || Number(x.need_improvement_percent) > Number(x.partially_ready_percent)  ||
          Number(x.partially_ready_percent) > Number(x.audit_ready_percent))
          {
            // Check A>B>C>D
            
            this.errorMessage = "Control : " + x.control_name + " :  has invalid number value";
            this.toastr.error(this.errorMessage, 'error');
            val = false;
            return val;
          }
        }
        else {
          this.errorMessage = "Control : " + x.control_name + " : should have range/number value";
          this.toastr.error(this.errorMessage, 'error');
          val = false;
          return val;
        }

        if ( // Invalid value check like 10-10-10
          (x.cliff_percent.indexOf("-") != x.cliff_percent.lastIndexOf("-")) || (x.need_improvement_percent.indexOf("-") != x.need_improvement_percent.lastIndexOf("-")) ||
          (x.partially_ready_percent.indexOf("-") != x.partially_ready_percent.lastIndexOf("-")) || (x.audit_ready_percent.indexOf("-") != x.audit_ready_percent.lastIndexOf("-"))
        ) {
          this.errorMessage = "Control : " + x.control_name + " :  has invalid value";
          this.toastr.error(this.errorMessage, 'error');
          val = false;
          return val;
        }
      }
    }
    }
    else
    {
      val = false;
    }
    return val;
  }

  SaveMetrics(): void {

    // let element : HTMLElement = document.getElementById('agGridMetrics') as HTMLElement;
    // element.blur();

    this.jsonControls.updatemetric = this.controls;
    this.jsonControls.userID = "Suresh";
      
    if (this.validateMetrics()) {
      this.errorMessage = "";
      this._metricsDefinitionServiceClient.saveMetrics(this.jsonControls).subscribe((data: any) => {
         //this.rowData = data;
         //console.log(data);
         if (data == "failure") {
          this.toastr.error("Failed", 'error');
        } else {
          this.toastr.success("Metrics defined successfully" ,'Success', { enableHtml: true });
        }
       });
     }
    else {

    }
  }


}
