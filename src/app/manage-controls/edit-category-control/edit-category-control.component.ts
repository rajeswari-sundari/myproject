import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";


@Component({
  selector: 'child-cell',
  templateUrl: './edit-category-control.component.html',
  styleUrls: ['./edit-category-control.component.css']
})
export class EditCategoryControlComponent implements ICellRendererAngularComp {
  public params: any;
  refresh = function (params) {
    return true;
  };
  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  
  public EditCategoryMethod() {
    this.params.api.setFocusedCell(this.params.node.rowIndex, "Action");
    this.params.api.startEditingCell({
      rowIndex: this.params.node.rowIndex,
      colKey: "Action"
    });
    var selectedData = this.params.data;
    var index = this.params.rowIndex;    
     this.params.context.componentParent.EditCategory(selectedData,index);
  }
}
