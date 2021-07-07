import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomAggridLinkButtonAcclsComponent } from 'src/app/Custom/custom-aggrid-link-button-accls/custom-aggrid-link-button-accls.component';
import { PublishedRecordDetails } from '../account-landscape';
import { AccountLandscapeService } from '../account-landscape.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-publish-landscape',
  templateUrl: './publish-landscape.component.html',
  styleUrls: ['./publish-landscape.component.css']
})
export class PublishLandscapeComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();

  public publishedRow: any[];
  public publishedColumn: any[];
  public defaultpublishedColDef;
  public publishedloadingTemplate;
  public nopublishedRowsTemplate;

  public publishRecord: PublishedRecordDetails;

  constructor(private _accountLandscapeServiceClient: AccountLandscapeService,private _router:Router,
    private spinnerService: NgxSpinnerService ) { }

  ngOnInit() {
    this.PublishRecords();
    this._router.navigateByUrl('/Accountlandscape/3');

    this.publishedloadingTemplate = 
    `<span class="ag-overlay-loading-center">No Records are published.</span>`;

    this.nopublishedRowsTemplate = 
    `<span class="ag-overlay-loading-center">No Records are published.</span>`;

    this.publishedColumn = [
      { headerName: 'Report name', field: 'dashboard_name' },
      { headerName: 'Published on', field: 'published_on' },
      { headerName: 'Sent to', field: 'associate_name' },
      { headerName: 'Action', field: 'download_link', cellRendererFramework: CustomAggridLinkButtonAcclsComponent,
        cellRendererParams: {
          linkID: 'DownloadImg'
        }
      }
    ]

    this.defaultpublishedColDef = {
      editable: false, sortable: false, resizable: true, flex: 1, lockPosition:true
    }
  }

  PublishRecords() {
    this.spinnerService.show()
    this._accountLandscapeServiceClient.publishedRecords().subscribe((data: PublishedRecordDetails[]) => {
      this.publishedRow = data;
      this.spinnerService.hide()
      console.log(data);
    })
  }

}
