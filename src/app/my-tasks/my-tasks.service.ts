import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadAuditReadiness, SaveAuditReadinessTask, SaveAuditbyAPOC,SaveAuditbyRPOC, SearchTasks, LoadPreAuditChecklistTasks,SavePreAuditbyRPOC, SearchProgress, SearchOngoindAudits, OngoingAuditDetails, OngoingPreAuditChecklistDetails, SaveAudibyMDU, EmailDetails } from './my-tasks';

@Injectable({
  providedIn: 'root'
})
export class MyTasksService {

  constructor(private _serviceClient: HttpClient) { }

  public preAuditChecklisttask : any[] = [{ AuditId : '001', AuditName : 'TeNovartis_Dec_2020st1', CustomerName : 'Novartis(390001)',
  TaskDueDate :'15 Dec 2020',ProgressStatus : '30%',  NumberofTasks: 4,TaskStatus : 'Not Started' },
  { AuditId : '001', AuditName : 'TeNovartis_Dec_2020st1', CustomerName : 'Novartis(390001)',
  TaskDueDate :'15 Dec 2020',overallComp : '60%', overallProgressStatus : '50%', NumberofTasks: 2,TaskStatus : 'Not Started' }];
  
  LoadAuditReadiness(data: LoadAuditReadiness): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/LoadAuditReadinessList', data).pipe();
  }

  ImportEvidence(formData): Observable<any[]> {
    return this._serviceClient.post<any>(environment.UIURL + '/ManageTasksEvidence/ImportEvidence', formData).pipe();
  }

  SaveSubmitReadiness(data: SaveAuditReadinessTask): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/UpdateReadinesstask', data).pipe();
  }
  ApproveAuditReadiness(data: SaveAuditbyAPOC): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/SaveSubmitAuditbyAPOC', data).pipe();
  }
  SubmitAuditbyRPOC(data: SaveAuditbyRPOC): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/SaveSubmitAuditbyRPOC', data).pipe();
  }

  getAuditReadinessTasks(data: SearchTasks) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/GetAuditReadinessList', data).pipe();
  }


  LoadPreAuditReadiness(data: LoadPreAuditChecklistTasks): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/LoadpreauditcheckList', data).pipe();
  }
  SubmitPreAuditbyRPOC(data: SavePreAuditbyRPOC): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/SubmitPreAuditCheckListTasks', data).pipe();
  }
  getProgressStatus(data:SearchProgress) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/LoadProgressStatus', data ).pipe();
  }
  getPreAuditChecklistTasks(data: SearchTasks) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/GetpreauditcheckList', data).pipe();
    //return of(this.preAuditChecklisttask);
  }
  getOngoingAudits(data: OngoingAuditDetails) : Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/LoadOngoingAudits', data).pipe();
  }
    ListOngoingAudits(data: OngoingAuditDetails): Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/GetOngoingAuditsDetails', data).pipe();
    }
    ListOngoingPreAuditChecklist(data: OngoingPreAuditChecklistDetails): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/GetOngoingPreAuditCheckLists', data).pipe();
  }

  SaveAuditMDU(data: SaveAudibyMDU): Observable<any[]> {
    return this._serviceClient.post<any>(environment.APIURL + 'ManageTasks/UpdateReadinesstasksMDU', data).pipe();
  }
  
  MDUUserlist(): Observable<any[]> {
    return this._serviceClient.get<any>(environment.APIURL + 'ManageTasks/GetMduUserList').pipe();
  }
  // Email services starts here
  //when RPOC submits the readiness. Used in audit readiness/update , ongoing grid/update
  sendmailtoAPOC(data: EmailDetails) : Observable<any[]> {    
    return this._serviceClient.post<any>(environment.UIURL + '/TaskCompletion/APOCMail',data).pipe();  
 }
 // when APOC / Admin Approves the readiness
 sendApproveMail(data: EmailDetails) : Observable<any[]> {    
  return this._serviceClient.post<any>(environment.UIURL + '/TaskCompletion/MDURCMMail',data).pipe();  
}
// when APOC/Admin rejects the readiness
sendRejectMail(data: EmailDetails) : Observable<any[]> {    
  return this._serviceClient.post<any>(environment.UIURL + '/TaskCompletion/RejectionMail',data).pipe();  
}
// when MDU rejects preaudit checklist in My task
sendPreAuditRejectionmail(data: SavePreAuditbyRPOC) : Observable<any[]> {    
  return this._serviceClient.post<any>(environment.UIURL + '/TaskCompletion/PreAuditRejectionMail',data).pipe();  
}
// when MDU rejects preaudit checklist in My task
sendPreAuditRPOCSubmitmail(data: SavePreAuditbyRPOC) : Observable<any[]> {    
  return this._serviceClient.post<any>(environment.UIURL + '/TaskCompletion/PreAuditMDURCMMail',data).pipe();  
}






}
