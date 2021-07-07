
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, of} from 'rxjs';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { environment } from  '../../environments/environment'

import { PreAuditChecklist,CheckListGridData,Newauditchecklist} from './preauditchecklistSearch';




@Injectable()

export class PreAuditChecklistService {

  constructor(private _serviceClient : HttpClient) {}
  
  

 
  GetParentCustomer() : Observable<any[]> {
     return this._serviceClient.get<any>(environment.APIURL + 'ManagePreAuditChecklist/GetParentCustomer').pipe();
    //return of(this.ParentCustomerList);
  }
  GetAuditnameList() : Observable<any[]> {
      return this._serviceClient.get<any>(environment.APIURL + 'NewAuditPreChecklist/GetAuditnameList').pipe();
   // return of(this.auditnameList);
  }
  GetCheckListItems() : Observable<any[]> {
      return this._serviceClient.get<any>(environment.APIURL + 'NewAuditPreChecklist/GetCheckListItems').pipe()
     //return of(this.ControlList);    
  }

  GetPreAuditChecklistDetails(PreAuditChecklist) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManagePreAuditChecklist/GetPreAuditChecklistDetails',PreAuditChecklist).pipe()
  }
  GetNewAuditChecklist(Newauditchecklist) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'NewAuditPreChecklist/GetNewAuditChecklist',Newauditchecklist).pipe()
  }
}
