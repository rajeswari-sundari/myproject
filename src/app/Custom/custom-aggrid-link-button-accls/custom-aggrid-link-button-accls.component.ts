import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-custom-aggrid-link-button-accls',
  templateUrl: './custom-aggrid-link-button-accls.component.html',
  styleUrls: ['./custom-aggrid-link-button-accls.component.css']
})
export class CustomAggridLinkButtonAcclsComponent implements ICellRendererAngularComp, OnInit, AfterViewInit {

  params: any;
  public downloadimg: string;

  constructor() { }

  ngOnInit() {
  }

  refresh(params: any): boolean {
    return true;
  }

  ngAfterViewInit(): void {
    return;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    if(this.params["linkID"] == 'DownloadImg') {
      this.downloadimg = this.params.data.download_link;
    }
  }

  Downloadpdf() {
    const imgUrl = '/ImportScreenShot/' + this.downloadimg;
    console.log(imgUrl);
    const imgName = this.downloadimg;
    console.log(imgName);
    FileSaver.saveAs(imgUrl, imgName);
  }

}
