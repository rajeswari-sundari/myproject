import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, of} from 'rxjs';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { environment } from  '../../environments/environment'

import { ManageCategories, ManageControlsSearch,ChecklistJsondata,ManageControlsdata} from './manageControlsSearch'
import { MetricsJonControl}  from '../metrics-definition/metricsDefinitionSearch'

@Injectable()
export class ManageControlsService {

    constructor(private _serviceClient : HttpClient) {}
    // public parentCategoryList : any[] = [{key:1,value:'Corporate Security'}, {key:2,value:'HR Management'}];
    // public categoryList : any[] =  [{key:1,value:'Security Management Plan'}, {key:2,value:'Personal Security'}]; ;
    // public ControlList : any [] = [{ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 1, Control : 'Review of Security Management Plan',Weightage: 0.5},
    //                                 {ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 2, Control : 'BGV ontime completion - validation',Weightage: 0.5 },
    //                                 {ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 3, Control : 'Security Awareness Training(AUP)',Weightage: 0.5},
    //                                 {ParentCategory : 'HR Management', Category :'Talent Management',ControlID : 4, Control : 'Attrition Rate',Weightage: 1 },
    //                                 {ParentCategory : 'HR Management', Category :'Talent Management',ControlID : 5, Control : 'My Proöle Compliance',Weightage: 2 }]

     

// public parentCategoryList : any[] = [{​​​​​​​​key:1,value:'Corporate Security'}​​​​​​​​, {​​​​​​​​key:2,value:'HR Management'}​​​​​​​​];
// public categoryList : any[] =  [{​​​​​​​​key:1,value:'Security Management Plan'}​​​​​​​​, {​​​​​​​​key:2,value:'Personal Security'}​​​​​​​​]; ;


    

// public ControlList : any [] = [{​​​​​​​​parent_category_name : 'Corporate Security', category_name :'Security Management Plan',control_id : 1, control_name : 'Review of Security Management Plan',weightage: 0.5,}​​​​​​​​,
//                                     {​​​​​​​​parent_category_name : 'Corporate Security', category_name :'Security Management Plan',control_id : 2, control_name : 'BGV ontime completion - validation',weightage: 0.5 }​​​​​​​​,
//                                     {​​​​​​​​parent_category_name : 'Corporate Security', category_name :'Security Management Plan',control_id : 3, control_name : 'Security Awareness Training(AUP)',weightage: 0.5}​​​​​​​​,
//                                     {​​​​​​​​parent_category_name : 'HR Management', category_name :'Talent Management',control_id : 4, control_name : 'Attrition Rate',weightage: 1 }​​​​​​​​,
//                                     {​​​​​​​​parent_category_name : 'HR Management', category_name :'Talent Management',control_id : 5, control_name : 'My Proöle Compliance',weightage: 2 }​​​​​​​​]

public duringAuidtList : any [] = [{audit_category_id : 1, audit_category_name : 'Test1', audit_checklist_id:1,audit_checklist:'list1' },
{audit_category_id : 1, audit_category_name : 'Test2', audit_checklist_id:2,audit_checklist:'list2' },
{audit_category_id : 1, audit_category_name : 'Test3', audit_checklist_id:3,audit_checklist:'list3' }]

      
    getParentCategory() : Observable<any[]> {
        return this._serviceClient.get<any>(environment.APIURL + 'ManageControl/GetParentCategory').pipe();
      // return of(this.parentCategoryList);
    }
    getCategory(manageControlsSearchData) : Observable<any[]> {
        return this._serviceClient.post<any>(environment.APIURL + 'ManageControl/GetCategoryList',manageControlsSearchData).pipe();
        //return of(this.categoryList);
    }
    getControls(manageControlsSearchdata : ManageControlsSearch) : Observable<any[]> {
        return this._serviceClient.post<any>(environment.APIURL + 'ManageControl/GetManageControlDetails',manageControlsSearchdata).pipe()
       //return of(this.ControlList);
        
    }
    getManageParentCategory() : Observable<any[]> {
        return this._serviceClient.get<any>(environment.APIURL + 'ManageCategories/GetParentCategory').pipe();
        //return of(this.parentCategoryList);
    }
    getManageCategory(manageControlsSearchdata) : Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'ManageControl/GetManageControlDetails',manageControlsSearchdata).pipe()
    }
    getmanagecategoryList():Observable<any[]>{
      return this._serviceClient.get<any>(environment.APIURL+'ManageCategories/GetmanagecategoryList').pipe();
    }
    saveManageCategory(ManageCategories) : Observable<any[]>{
      return this._serviceClient.post<any>(environment.APIURL + 'ManageCategories/SaveManageCategory',ManageCategories).pipe()
      }
      
    getDuringAuditCheckList():Observable<any[]>{
      return this._serviceClient.get<any>(environment.APIURL + 'DuringAuditCheckList/GetDuringAuditCheckList').pipe();
     //return of(this.duringAuidtList);
    }

    AddEditCheckList(checklistdata:ChecklistJsondata):Observable<any[]>{
      return this._serviceClient.post<any>(environment.APIURL + 'DuringAuditCheckList/SaveDuringAuditCheckList',checklistdata).pipe();
    }

    AddEditControls(manageControlsdata : ManageControlsdata ) : Observable<any> {
        console.log("pass addEDIt Controls")
        return this._serviceClient.post<ManageControlsdata[]>(environment.APIURL +  'AddManageControl/SaveManageControlDetails', manageControlsdata).pipe()
        //return of(this.ControlList);
         
     }

     UpdateManageMetrics(metricsdata : MetricsJonControl ) : Observable<any> {
      console.log("Update Metrics")
      return this._serviceClient.post<MetricsJonControl[]>( environment.APIURL + 'MetricsDefinition/UpdateJsonMetricControlList', metricsdata).pipe()
    
       
   }
}