import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, of} from 'rxjs';
import { environment } from  '../../environments/environment';
import {  PreAuditRequest} from '../manage-audits/manageAuditsClasses'

@Injectable()
export class Newauditpreauditchecklistservice {

  constructor(private _serviceClient : HttpClient) { }

  GetAuditList() : Observable<any[]> {
    return this._serviceClient.get<any>(environment.APIURL + 'NewAuditPreChecklist/GetAuditnameList').pipe();
   
 }
 GetNewAuditChecklist(AuditName):Observable<any[]>{
  return this._serviceClient.post<any>(environment.APIURL + 'NewAuditPreChecklist/GetNewAuditChecklist',AuditName).pipe();
 }

 GetCheckListItems(): Observable<any[]> {
  return this._serviceClient.get<any>(environment.APIURL + 'NewAuditPreChecklist/GetCheckListItems').pipe();
 }
 LoadCheckListItems(selectedItems):Observable<any[]>{
  return this._serviceClient.post<any>(environment.APIURL + 'NewAuditPreChecklist/LoadCheckListItems',selectedItems).pipe();
}
GetPointofContactDetails(PointOfContact):Observable<any[]>{
  return this._serviceClient.post<any>(environment.APIURL + 'NewAuditPreChecklist/GetPointofContactDetails',PointOfContact).pipe();
}
PublishPreauditChecklist(publishCheckList):Observable<any[]>{
  return this._serviceClient.post<any>(environment.APIURL + 'NewAuditPreChecklist/PublishPreauditChecklist',publishCheckList).pipe();
}
// send mail once checklist is published
sendPublishmail(PreAuditRequest: PreAuditRequest) : Observable<any[]> {  
  return this._serviceClient.post<any>(environment.UIURL + '/PublishEmail/EmailPreAuditCheckListDeliveryDetails',PreAuditRequest).pipe();      
}

}
