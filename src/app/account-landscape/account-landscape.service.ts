import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from  '../../environments/environment';
import { BehaviorSubject, Observable, Observer, of, Subject} from 'rxjs';
import { CategoryRiskdetails , PublishData,AccLsSearchAccount,AccLsSearchProject, CategoryRiskSummaryDetails,PublishedRecordDetails,ControlRiskDetails,  AccLsSearchControlData, DashboardSearchData, AccLsViewData, AccLsAccountOverview, AccLsAccountOverviewSearch, AccLsFilterBasedOnUserRequest} from './account-landscape';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class AccountLandscapeService {

  public integrationData = new Subject();
  public acclancontrolview = new  AccLsViewData();
  // Sharing data between not related components
  // public accLanControlViewSource = new  BehaviorSubject(this.acclancontrolview);
  // public currentAccLanControlViewDetails = this.accLanControlViewSource.asObservable();

  //public categoryRisks : CategoryRiskdetails[];
  constructor(private _serviceClient : HttpClient) { }
  
  getDoughnutChartData(searchData : DashboardSearchData) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/LoadAccountDashborad', searchData);
    // return of(this.categoryRisks);
  }
  getBUandSBUList(): Observable<any[]> {
    return this._serviceClient.get<any>(environment.APIURL + 'AccLsManageControl/GetAccLsDashboardLevelofView').pipe();

   }
   getAccountList(Accountsearch:AccLsSearchAccount): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/GetAccLsDashboardAccount',Accountsearch).pipe();
   }
   getProjectList(Accountsearch:AccLsSearchProject): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/GetAccLsDashboardProject',Accountsearch).pipe();
   }
  publishedRecords(): Observable<any[]> {
    // return of(this.publishRecords);
    return this._serviceClient.get<any>(environment.APIURL + 'AccLsManageControl/GetPublishedDashboard').pipe();
  }

  public setISData(data) {
    this.integrationData.next(data);
  }

  public getISData() {
    return this.integrationData.asObservable();
  }

  public getIntegrationSource(): Observable<any> {
    return this._serviceClient.get<any>(`${environment.APIURL}AccLsManageControl/GetIntegrationSource`);
  }

  public getIntegrationDetails(): Observable<any> {
    return this._serviceClient.post<any>(`${environment.APIURL}AccLsManageControl/GetAccLsManageControlDetails`, {});
  }

  public updateIntegrationDetails(data: any): Observable<any> {
    return this._serviceClient.post<any>(`${environment.APIURL}AccLsManageControl/UpdateIntegrationDetails`, data);
  }

  Screenshotupload(data : any) :Observable<any[]> {
   var loginuserid =sessionStorage.getItem('UserID');
    return this._serviceClient.post<any>(environment.UIURL + '/ManageTasksEvidence/Screenshotupload?userID='+loginuserid , data).pipe();
  //  return this._serviceClient.post<any>(environment.UIURL + '/ManageTasksEvidence/ImportEvidence', data).pipe();
  }

  savePublishDashboard(data : any):Observable<any>{
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/PublishDashboard', data);
    //return  of('success');
  }
  getControlLevelData(data : AccLsSearchControlData) : Observable<any> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/LoadControlDashboard', data);
  }
  getDownloadData(data : AccLsSearchControlData) : Observable<any> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/LoadControlDashboard', data);
  }

  getAccountOverview(data: AccLsAccountOverviewSearch): Observable<any> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/LoadAccountOverview', data);
  }

  getLoadFilterbased(data: AccLsFilterBasedOnUserRequest): Observable<any> {
    return this._serviceClient.post<any>(environment.APIURL + 'AccLsManageControl/LoadFilterBasedOnUesr', data);
  }
  
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  // public controlsViewDetail(data: any) {
  //    this.accLanControlViewSource.next(data);
  // }
}
