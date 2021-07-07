import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-metrics-defination',
  templateUrl: './edit-metrics-defination.component.html',
  styleUrls: ['./edit-metrics-defination.component.css']
})
export class EditMetricsDefinationComponent implements ICellRendererAngularComp {

  params;
  label: string;
  public field : string;
  public actionParam:any;

  constructor(private _router: Router, private _routeParameters : ActivatedRoute ){}

  
  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    this.field = this.params.data.control_name;
    this._routeParameters.params.subscribe((data) =>{
      this.actionParam = data['action'];
    });
    if(this.actionParam=='view'){
      this.field='';
    }
    // if(this.params.data.published=='Yes'){
    // this.field='';
    // }
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
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
