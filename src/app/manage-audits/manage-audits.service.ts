import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from  '../../environments/environment';
import { Observable, Observer, of} from 'rxjs';
import { ManageAuditsSearch, AddAuditControlDetails, UpdateAuditControlMetrics, UpdateAuditControlPOC, ParentCustomersSearch, SaveAuditControl, AuditControl, AuditControlDetails, AddNewAudit, AuditDetails, UpdateAuditDetailsRequest, EmailReminderDetails, updateEmailReminderDetails, CustomerProject, SearchCustomerData, AuditControlMetrics, PreAuditRequest} from './manageAuditsClasses'
import { ManageControls, ManageControlsSearch } from '../manage-controls/manageControlsSearch';

@Injectable()
export class ManageAuditService {
  httpOptions={
    headers:new HttpHeaders({
     
      'Accept':'application/json',
      "Access-Control-Allow-Origin":"*",
      'Access-Control-Allow-Methods':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-Type':'application/json;charset=utf-8'
    })
  }
    constructor(private _serviceClient : HttpClient) {}
   /*
    public previewList : any [] = [{control_id : 1, control_name : 'Control name 1', account_poc:'account poc 1',responsible_poc:'RPOC 1' },
    {control_id : 2, control_name : 'Control name 2', account_poc:'account poc 2',responsible_poc:'RPOC 2' },
    {control_id : 3, control_name : 'Control name 3', account_poc:'account poc 3',responsible_poc:'RPOC 3'},
    {control_id : 1, control_name : 'Control name 1', account_poc:'account poc 1',responsible_poc:'RPOC 1' },
    {control_id : 2, control_name : 'Control name 2', account_poc:'account poc 2',responsible_poc:'RPOC 2' },
    {control_id : 3, control_name : 'Control name 3', account_poc:'account poc 3',responsible_poc:'RPOC 3'},
    {control_id : 1, control_name : 'Control name 1', account_poc:'account poc 1',responsible_poc:'RPOC 1' },
    {control_id : 2, control_name : 'Control name 2', account_poc:'account poc 2',responsible_poc:'RPOC 2' },
    {control_id : 3, control_name : 'Control name 3', account_poc:'account poc 3',responsible_poc:'RPOC 3'}];
    
      { headerName: '', cellRendererFramework: CustomCheckboxComponent,},
      { headerName: 'Parent category', field: 'parent_category' },
      { headerName: 'Category', field: 'category_name' },
      { headerName: 'Component', field: 'component_name' },
      { headerName: 'Target achieved', field: 'target_achieved'  },
      { headerName: 'Comments', field: 'comments'  },
      { headerName: 'Evidence', field: 'evidence'  },
      { headerName: 'Updated by' , field: 'updated_by' },
      { headerName: 'Action'  }
  */
    public readinessList : any [] = [{parent_category : 1, category_name : 'Control name 1', component_name:'account poc 1',target:'APOC' , comments: 'comm1' , evidence:'evi', updated_by:'1/1/2020'},
    {parent_category : 1, category_name : 'Control name 2', component_name:'account poc 1',target:'RPOC' , comments: 'comm1' , evidence: null , updated_by:null},
    {parent_category : 1, category_name : 'Control name 3', component_name:'account poc 1',target:'APOC' , comments: 'comm1' , evidence:'evi', updated_by:'1/1/2020'},
    {parent_category : 1, category_name : 'Control name 4', component_name:'account poc 1',target:'RPOC' , comments: 'comm1' , evidence:null, updated_by:null},
    {parent_category : 1, category_name : 'Control name 5', component_name:'account poc 1',target:'APOC' , comments: 'comm1' , evidence: 'evi', updated_by: null},
    {parent_category : 1, category_name : 'Control name 6', component_name:'account poc 1',target:'RPOC' , comments: 'comm1' , evidence: null, updated_by: null },
    {parent_category : 1, category_name : 'Control name 7', component_name:'account poc 1',target:'APOC' , comments: 'comm1' , evidence:'evi', updated_by:'1/1/2020'}
    ];
    
    
    public returnpublish : any [] =[{rvalue: 'success'}]
    public returnval : any [] =[{rval: 'success'}]
    
    public emailAuditList : any [] = [{ parent_category : 'category 1', category_name:'category name',control_name:'Control name' },
    { parent_category : 'category 2', category_name:'category name 1',control_name:'Control name 1' },
    { parent_category : 'category 1', category_name:'category name 2',control_name:'Control name 1' },
    { parent_category : 'category 2', category_name:'category name 3',control_name:'Control name 1' },
    { parent_category : 'category 1', category_name:'category name 1',control_name:'Control name 2' },
    { parent_category : 'category 3', category_name:'category name 2',control_name:'Control name 3' },
    { parent_category : 'category 1', category_name:'category name 3',control_name:'Control name 4' },
    { parent_category : 'category 1', category_name:'category name 1',control_name:'Control name 2' },
    { parent_category : 'category 1', category_name:'category name 2',control_name:'Control name 1' },
    { parent_category : 'category 1', category_name:'category name2',control_name:'Control name 1' }
    ];

     
    //Parentcustomer dropdown list
    getParentCustomers() : Observable<any[]> {
        return this._serviceClient.get<any>(environment.APIURL + 'ManageAudit/GetParentCustomer').pipe();
    }
    getStatus(searchflag) : Observable<any[]> {
        return this._serviceClient.get<any>(environment.APIURL + 'ManageAudit/GetStatus?searchflag='+searchflag).pipe();
    }
    getAudits(manageAuditsSerach : ManageAuditsSearch) : Observable<any[]> {
        return this._serviceClient.post<any>(environment.APIURL + 'ManageAudit/GetManageAuditDetails', manageAuditsSerach).pipe();
    }
    getDepartments(classification : string) : Observable<any[]> {
      return this._serviceClient.get<any>(environment.APIURL + 'NewAudit/GetDepartmentGroup?classification=' + classification).pipe();
    }
    //parentcustomer details grid data loading functionality
    getParentCustomerDetails(searchData : ParentCustomersSearch) : Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetParentCustomerDetails', searchData).pipe();
    }

    addNewAudit(data : AddNewAudit) : Observable<any>{
      return this._serviceClient.post<any>(environment.APIURL+'NewAudit/AddNewAudit', data).pipe();
    }
    getAuditDetails(pAuditID : string) :Observable<any>{
      return this._serviceClient.get<any>(environment.APIURL + 'NewAudit/GetAuditDetails?p_audit_id=' + pAuditID).pipe();
    }
    UpdateAudit(data : UpdateAuditDetailsRequest) : Observable<any>{
      return this._serviceClient.post<any>(environment.APIURL+'NewAudit/UpdateNewAudit', data).pipe();
    }

    //Customers list for popup..
    getCustomers(data : SearchCustomerData): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetCustomerDetails', data).pipe();
    }

    saveCustomerDetails(data : any):Observable<any>{
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/AddAuditCustomerDetails', data).pipe();
    }

    //Projects list for popup..
    getProjects(data : CustomerProject): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetCustomerProjectDetails',data).pipe();
    }

    saveProjectDetails(data : any):Observable<any>{
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/AddAuditProjectDetails', data).pipe();
    }

    //Locations list for popup..
    getLocations(data : SearchCustomerData): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetCustomerLocationDetails', data).pipe();
    }

    saveLocationDetails(data : any):Observable<any>{
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/AddAuditLocationDetails', data).pipe();
    }

    addAuditControl(servivceControlData: AddAuditControlDetails): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/AddAuditControl', servivceControlData).pipe();
    }

    saveAuditControl(saveAudit: SaveAuditControl): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/SaveAuditControl', saveAudit).pipe();
    }

    DeleteAudit(deleteAuditData : SaveAuditControl): Observable<any> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/DeleteAudit', deleteAuditData).pipe();
    }
    GetAuditControl(auditControl: AuditControl): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'ManageAudit/GetAuditControl', auditControl).pipe();
    }
    
  getPreviewAudits(auditControl: AuditControl) : Observable<any[]> {   
    return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetAuditControl', auditControl).pipe();
    // return of(this.previewList);
    }
    UpdateMetrics(UpdateAuditControlMetrics:UpdateAuditControlMetrics):Observable<any[]>{
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/UpdateAuditControlMetrics', UpdateAuditControlMetrics).pipe();
    }
    SavePointOfContact(UpdateAuditControlPOC:UpdateAuditControlPOC){
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/UpdateAuditControlPOC', UpdateAuditControlPOC).pipe();
    }
 
   publishPreviewAudits(saveAuditControl: SaveAuditControl) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/PublishAudit', saveAuditControl).pipe();  
    //  return of(this.returnpublish) ;
   }
   getEmailReminderDetails(data : string) : Observable<any[]> {
     return this._serviceClient.get<any>(environment.APIURL + 'NewAudit/GetNewAuditEmailDetails?p_audit_id='+ data).pipe();
      //return of(this.emailAuditList);
   }
   saveEmailReminderDetails(emailReminderDetails: updateEmailReminderDetails) : Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/UpdateAuditEmailDetails', emailReminderDetails).pipe();    
    //return of(this.returnpublish) ;
   }
   sendPublishmail(auditId: any) : Observable<any[]> {
    //return this._serviceClient.post<any>(environment.UIURL + '/PublishEmail/EmailDeliveryDetails', auditId).pipe();    
    return this._serviceClient.get<any>(environment.UIURL + '/PublishEmail/EmailDeliveryDetails?auditId='+auditId).pipe();  
  }
  sendReminderOngoingPreaudit(PreAuditRequest: PreAuditRequest) : Observable<any[]> {  
    return this._serviceClient.post<any>(environment.UIURL + '/PublishEmail/EmailPreAuditCheckListDeliveryDetails',PreAuditRequest).pipe();      
  }
  // My task - ongoing audit - send reminder mail pending with RPOC 
  sendRPOCmail(auditId: any, controlId: any) : Observable<any[]> {    
    return this._serviceClient.get<any>(environment.UIURL + '/PublishEmail/EmailDeliveryDetails?auditId='+auditId+'&controlId='+controlId).pipe();  
  }
   public timezoneList : any[] = [{Key:'IST(GMT+5.30)',Value:'IST(GMT+5.30)'},{Key:'IST(GMT+6.30)',Value:'IST(GMT+6.30)'}, {Key:'IST(GMT+7.30)',Value:'IST(GMT+7.30)'}];
   showTimezoneDetails(emailReminderDetails:EmailReminderDetails) : Observable<any[]> {
    return this._serviceClient.get<any>(environment.APIURL + 'NewAudit/GetTimeZone').pipe();
   // return of(this.timezoneList);
}
ImportPOC(formdata) {
  return this._serviceClient.post(environment.UIURL+'/ImportContacts/ImportPOC', formdata).pipe();
}
ImportPointOfContact(auditId,POCFileName): Observable<any[]> {
  return this._serviceClient.post<any>(environment.UIURL+'/ImportContacts/ImportContacts', {"auditId":auditId,"filename":POCFileName}).pipe();    
}
UpdateManageMetrics(AuditControlMetrics:AuditControlMetrics):Observable<any[]> {
  return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/UpdateManageMetrics',AuditControlMetrics).pipe();
}
   
getAuditReadiness(auditControl: AuditControl) : Observable<any[]> {   
  // return this._serviceClient.post<any>(environment.APIURL + 'NewAudit/GetAuditControl', auditControl).pipe();
   return of(this.readinessList);
  }

  // ? UTILITY FUNCTIONS STARTS
  // ! fn: disableCheckbox is used only to disable the checkbox in the ag-grid column
  disableCheckbox(): void {
    setTimeout(() => {
      document.querySelectorAll('.art-disable input[type="checkbox"]').forEach((el: HTMLInputElement) => {
        el.disabled = true;
        el.onkeypress = null;
      });
    });
  }

  // ! fn: isRecordEditable returns the selected audit record data in the active session
  isRecordEditable(): boolean {
    if (sessionStorage.getItem('auditData')) {
      const data = JSON.parse(sessionStorage.getItem('auditData'));
      return (data.published === 'Yes' || data.overall_audit_status === 'Completed') ? false : true;
    }
    return false;
  }

  // !fn: hasExistingData return true, if a match is found in the array for the value; else false
  hasExistingData(arr, key, val) {
    if (!arr || !key || !val) {
      return false;
    }
    return arr.some((data) => data[key] === val);
  }

  // !fn: getPreviewAuditData returns the preview Audit data
  getPreviewAuditData() {
    if (sessionStorage.getItem('previewAuditData')) {
      return JSON.parse(sessionStorage.getItem('previewAuditData'));
    }
    return null;
  }

  // !fn: removePreviewData - clears the preview data from active session
  removePreviewData() {
    if (sessionStorage.getItem('previewAuditData')) {
      sessionStorage.removeItem('previewAuditData');
    }
  }
  // ? UTILITY FUNCTIONS ENDS
  
}
