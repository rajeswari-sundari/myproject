import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ManageAuditService } from '../../manage-audits/manage-audits.service';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.css']
})
export class CustomCheckboxComponent implements ICellRendererAngularComp, OnDestroy {
public params: any;
refresh;
ngOnDestroy;
public isDisabled = null;

  constructor(private auditService: ManageAuditService) {}

  agInit(params: any): void {
    this.params = params;
    const orgData = this.auditService.getPreviewAuditData();
    if (this.params && this.params.pageRef &&
        this.params.pageRef === 'select-controls' &&
        !this.params.isEditable && orgData
      ) {
      this.isDisabled = this.auditService.hasExistingData(orgData, 'control_name', this.params.data.control_name) ? true : null;
    }
  }

  checkedHandler(event) {
      let checked = event.target.checked;
      let colId = this.params.column.colId;
      this.params.node.setDataValue(colId, checked);
  }

}
