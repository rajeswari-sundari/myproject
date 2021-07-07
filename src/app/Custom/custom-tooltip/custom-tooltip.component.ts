import { Component, OnInit } from '@angular/core';
import { ITooltipAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.css']
})
export class CustomTooltipComponent implements ITooltipAngularComp {

  private params: any;
  public data: any;
  public objectiveupdate : any;
  public objectiveupdatearr : any;

  agInit(params): void {
    this.params = params;

    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.data.color = this.params.color || 'white';
   if(this.data.objective!=null){
    if(this.data.objective.includes("|")){
    this.objectiveupdatearr = this.data.objective.split('|');
    
    this.objectiveupdate = this.objectiveupdatearr[1];


    if(this.objectiveupdate.includes("#1")){
      this.objectiveupdate = this.objectiveupdate.replace("#1",this.data.cliff_percent);
    }
    if(this.objectiveupdate.includes("#2")){
      this.objectiveupdate = this.objectiveupdate.replace("#2",this.data.need_improvement_percent);
    }
    if(this.objectiveupdate.includes("#3")){
      this.objectiveupdate = this.objectiveupdate.replace("#3",this.data.partially_ready_percent);
    }
    if(this.objectiveupdate.includes("#4")){
      this.objectiveupdate = this.objectiveupdate.replace("#4",this.data.audit_ready_percent);
    }
  }
}
  }
}
