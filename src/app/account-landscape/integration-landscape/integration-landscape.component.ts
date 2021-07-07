import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CustomRadioGroupComponent } from 'src/app/Custom/custom-radio-group/custom-radio-group.component';
import { CustomSelectboxComponent } from 'src/app/Custom/custom-selectbox/custom-selectbox.component';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { AccountLandscapeService } from '../account-landscape.service';

@Component({
  selector: 'app-integration-landscape',
  templateUrl: './integration-landscape.component.html',
  styleUrls: ['./integration-landscape.component.css']
})
export class IntegrationLandscapeComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();

  public modalRef: BsModalRef;

  public integrationRow: any[];
  public integrationColumn: any[];
  public defaultintegrationColDef;
  public integrationloadingTemplate;
  public nointegrationRowsTemplate;

  private integrationSource = {Manual: [], Integration: []};
  private orgIntegData = [];

  constructor(private modalService: BsModalService, private toastr: ToastrService, private _router:Router, 
    private alService: AccountLandscapeService, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this._router.navigateByUrl('/Accountlandscape/2');
    this.integrationloadingTemplate = `<span class="ag-overlay-loading-center">Fetching Integration Controls...</span>`;
    this.nointegrationRowsTemplate = `<span class="ag-overlay-loading-center">No Integration Controls are added.</span>`;
    this.getIntegrationData();
  }

  getIntegrationData() {
    this.spinnerService.show()
    forkJoin([
      this.alService.getIntegrationSource(),
      this.alService.getIntegrationDetails()
    ]).subscribe(
      (resultSet) => {
        const [iSource, iDetails] = resultSet;
        this.orgIntegData = iDetails || [];
        this.orgIntegData = this.orgIntegData.filter((row) => row && row.control_name);
        this.integrationSource.Manual = (iSource && iSource.manual) || [];
        this.integrationSource.Integration = (iSource && iSource.integration) || [];
        this.resetData();
        this.tableDefs();
        this.spinnerService.hide()
      }
    );
    
  }

  tableDefs() {
    this.integrationColumn = [
      { headerName: 'Parent category', field: 'parent_category_name' },
      { headerName: 'Category', field: 'category_name', sortable: true },
      { headerName: 'Control', field: 'control_name' },
      { headerName: 'Data source', field: 'data_source', editable: false,
        cellRendererFramework: CustomRadioGroupComponent,
        cellRendererParams: {
          radioList: [
            {label: 'Manual', value: 'Manual'},
            {label: 'Integration', value: 'Integration'}
          ],
          mandatory: true,
          pageRef: 'landscape-integrations'
        }
      },
      { headerName: 'Integration source', field: 'integration_source_name', editable: false,
        cellRendererFramework: CustomSelectboxComponent,
        cellRendererParams: {
          integrationSourceData: this.integrationSource,
          mandatory: true,
          pageRef: 'landscape-integrations'
        }
      }
    ];

    this.defaultintegrationColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition: true
    };
  }

  ValidateAndSave() {
    const hasEmptyData = this.integrationRow.some((rowData) => !rowData.data_source || !rowData.integration_source_name);
    if (hasEmptyData) {
      this.toastr.error('Please fill all mandatory values', 'error');
    } else {
      this.SaveIntegrations();
    }
  }

  SaveIntegrations() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: 'Save integration(s)',
        message: 'Are you sure you want to save the integration(s)?',
        callback: (result) => {
          if (result === 'yes') {
            const data = {
              controlIntegrationContexts: this.integrationRow.map((row) => {
                                            return {
                                              control_id: row.control_id,
                                              data_source_value: row.data_source,
                                              integration_source: row.integration_source_name
                                            };
                                          })
              };
            this.alService.updateIntegrationDetails(data).subscribe(
              () => {
                this.toastr.success('Integration saved successfully', 'success');
                this.getIntegrationData();
              },
              (error) => this.toastr.error('Save failed. Please try again later!', 'error')
            );
            this._router.navigateByUrl('/Accountlandscape/2');
          } else {
            this.resetData();
          }
        }
      }
    });
  }

  resetData() {
    this.integrationRow = JSON.parse(JSON.stringify(this.orgIntegData));
  }

}
