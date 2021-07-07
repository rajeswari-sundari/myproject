import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AccountLandscapeService } from 'src/app/account-landscape/account-landscape.service';

@Component({
  selector: 'app-custom-radio-group',
  templateUrl: './custom-radio-group.component.html',
  styleUrls: ['./custom-radio-group.component.css']
})
export class CustomRadioGroupComponent implements ICellRendererAngularComp {
  public params;
  public selectedItem;
  constructor(private landscapeService: AccountLandscapeService) { }

  agInit(params) {
    this.params = params;
    this.selectedItem = this.params.value || '';
  }

  refresh() {
    return true;
  }

  onChange() {
    this.params.value = this.selectedItem;
    this.params.node.data[this.params.column.colId] = this.selectedItem;
    if (this.params.pageRef === 'landscape-integrations') {
      this.landscapeService.setISData(this.params);
    }
  }
}
