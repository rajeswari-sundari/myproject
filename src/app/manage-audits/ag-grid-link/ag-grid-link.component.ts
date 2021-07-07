import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ag-grid-link',
  templateUrl: './ag-grid-link.component.html',
  styleUrls: ['./ag-grid-link.component.css']
})
export class AgGridLinkComponent implements ICellRendererAngularComp {

  params;
  label: string;
  public numberofprojects : number;
  public field : string;
public isView:boolean;
public actionParam:string;

constructor(private router: Router, private _routeParameters: ActivatedRoute) {}
  agInit(params): void {
    this.params = params;
    this._routeParameters.params.subscribe((data) => {
      this.actionParam = data['action'];
      this.isView = this.actionParam == 'view' ? true : false;
    })
    this.numberofprojects = this.params.data.NoOfProjects;
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
