import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import {​​​​​​​​ Router }​​​​​​​​ from'@angular/router'

@Component({
  selector: 'app-control-edit-category',
  templateUrl: './control-edit-category.component.html',
  styleUrls: ['./control-edit-category.component.css']
})
export class ControlEditComponent  implements ICellRendererAngularComp  {

  public params: any;
  public editcontrollinkId;
  
  refresh = function (params) {
    return true;
  };
  

  constructor(private _router: Router) { }

  agInit(params: any): void {
    this.params = params;
    this.editcontrollinkId = this.params['linkID']   ;
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

  AddEditControl() {
    if (this.params.data != undefined) {
      let pptyName = this.params["linkID"];
      let pptyValue= this.params.data[this.params["linkID"]]; 

      if(pptyName == 'parent_category_id') {
        this._router.navigateByUrl("/ControllandscapeEdit/" + pptyValue );
      }
    }


  }

}

