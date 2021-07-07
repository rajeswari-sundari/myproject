import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, of} from 'rxjs';
import { KeyValuePairDTO } from '../Common/KeyValuePairDTO';
import { environment } from  '../../environments/environment'
import { MetricsJonControl, ManageMetricsControls, MetricsDefinitionSearch } from './metricsDefinitionSearch'



@Injectable()

export class MetricsDefinitionService {

  constructor(private _serviceClient : HttpClient) {}
  // public parentCategoryList : any[] = [{key:1,value:'Corporate Security'}, {key:2,value:'HR Management'}];
  // public categoryList : any[] =  [{key:1,value:'Security Management Plan'}, {key:2,value:'Personal Security'}]; ;
  // public ControlList : any [] = [{ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 1, Control : 'Review of Security Management Plan',Weightage: 0.5},
  //                                 {ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 2, Control : 'BGV ontime completion - validation',Weightage: 0.5 },
  //                                 {ParentCategory : 'Corporate Security', Category :'Security Management Plan',ControlID : 3, Control : 'Security Awareness Training(AUP)',Weightage: 0.5},
  //                                 {ParentCategory : 'HR Management', Category :'Talent Management',ControlID : 4, Control : 'Attrition Rate',Weightage: 1 },
  //                                 {ParentCategory : 'HR Management', Category :'Talent Management',ControlID : 5, Control : 'My Proöle Compliance',Weightage: 2 }]

    
  getParentCategory() : Observable<any[]> {
      return this._serviceClient.get<any>(environment.APIURL + 'ManageControl/GetParentCategory').pipe();
    //  return of(this.parentCategoryList);
  }
  getCategory(metricsDefinitionSearchData : MetricsDefinitionSearch) : Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'ManageControl/GetCategoryList',metricsDefinitionSearchData).pipe();
     // return of(this.categoryList);
  }
  getControls(metricsDefinitionSearchData : MetricsDefinitionSearch) : Observable<any[]> {
      return this._serviceClient.post<any>(environment.APIURL + 'ManageControl/GetManageControlDetails',metricsDefinitionSearchData).pipe()
     //return of(this.ControlList);    
  }

  saveMetrics(controls : MetricsJonControl) : Observable<any[]> {
    return this._serviceClient.post<any[]>(environment.APIURL + 'MetricsDefinition/UpdateJsonMetricControlList',controls).pipe()
    //return of(this.ControlList);    
  }
}