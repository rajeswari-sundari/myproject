import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AccountLandscapeService } from 'src/app/account-landscape/account-landscape.service';

@Component({
  selector: 'app-custom-selectbox',
  templateUrl: './custom-selectbox.component.html',
  styleUrls: ['./custom-selectbox.component.css']
})
export class CustomSelectboxComponent implements ICellRendererAngularComp {
  public params;
  public optionList = [];
  public selectedItem;

  constructor(private landscapeService: AccountLandscapeService) { }

  agInit(params) {
    this.params = params;
    if (this.params) {
      this.selectedItem = this.params.value;
      if (this.params.pageRef === 'landscape-integrations') {
        this.optionList = this.params.integrationSourceData[this.params.data.data_source] || [];
        this.landscapeService.getISData().subscribe((node: any) => {
          if (node && this.params.rowIndex === node.rowIndex) {
            this.params.value = '';
            this.selectedItem = '';
            this.params.node.data[this.params.column.colId] = '';
            this.optionList = this.params.integrationSourceData[node.data.data_source] || [];
          }
        });
      }
    }
  }

  refresh() {
    return true;
  }

  onChange() {
    this.params.value = this.selectedItem;
    this.params.node.data[this.params.column.colId] = this.selectedItem;
  }

}
