import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditControlComponent } from '../app/add-edit-control/add-edit-control.component';
import { ManageControlsComponent } from '../app/manage-controls/manage-controls.component';
import { MetricsDefinitionComponent } from '../app/metrics-definition/metrics-definition.component'
import {​​​​​ AddEditChecklistComponent }​​​​​ from './add-edit-checklist/add-edit-checklist.component';
import { ManageAuditsComponent} from './manage-audits/manage-audits.component';
import { PreAuditChecklistComponent } from './pre-audit-checklist/pre-audit-checklist.component';
import {NewAuditPreAuditChecklistComponent} from './new-audit-pre-audit-checklist/new-audit-pre-audit-checklist.component';
import { PreNewAuditComponent } from './manage-audits/pre-new-audit/pre-new-audit.component'
import { NewAuditComponent } from './manage-audits/new-audit/new-audit.component';
import {CategoryControlsComponent} from './manage-audits/category-controls/category-controls.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AuditReadinessTasksComponent } from './my-tasks/audit-readiness-tasks/audit-readiness-tasks.component';
import { AuditUpdateTasksComponent } from './my-tasks/audit-readiness-tasks/audit-update-tasks/audit-update-tasks.component';
import { OngoingAuditsTasksComponent } from './my-tasks/ongoing-audits-tasks/ongoing-audits-tasks.component';
import { PreauditChecklistTasksComponent } from './my-tasks/preaudit-checklist-tasks/preaudit-checklist-tasks.component';
import { PreauditUpdateTasksComponent } from './my-tasks/preaudit-checklist-tasks/preaudit-update-tasks/preaudit-update-tasks.component';
import { OngoingUpdateTaskComponent } from './my-tasks/ongoing-audits-tasks/ongoing-update-task/ongoing-update-task.component';
import { AccountLandscapeComponent } from './account-landscape/account-landscape.component';
import { ControlRiskComponent } from './account-landscape/dashboard-landscape/control-risk/control-risk.component';
import { ControlDetailComponent } from './account-landscape/dashboard-landscape/control-detail/control-detail.component';
import { ControlLandscapeEditComponent } from './account-landscape/control-landscape/control-landscape-edit/control-landscape-edit.component';
import { ControlDefinitionComponent } from './account-landscape/control-landscape/control-definition/control-definition.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './AuthGuard';

// import { ControlLandscapeComponent } from './account-landscape/control-landscape/control-landscape.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  { path: 'Managecontrols', component: ManageControlsComponent },
  { path: 'Managecontrols/:tab', component: ManageControlsComponent },
  { path: 'Manageaudits', component: ManageAuditsComponent },
  { path: 'Manageaudits/:tabActive', component: ManageAuditsComponent },
  { path: 'AddEditAudit', component: PreNewAuditComponent },
  { path: 'AddEditAudit/:auditID', component: NewAuditComponent},
  { path: 'AddEditAudit/:auditID/:action', component: NewAuditComponent},
  { path: 'NewAudit/:auditID', component: CategoryControlsComponent},
  { path: 'AddEditControl/:parentCategoryID', component: AddEditControlComponent},
  { path: 'MetricsDefinition', component: MetricsDefinitionComponent },
  { path: 'AddEditCheckList/:auditCategoryID', component: AddEditChecklistComponent },
  {path:  'Newpreauditchecklist',component:NewAuditPreAuditChecklistComponent},
  {path:  'Newpreauditchecklist/:auditID',component:NewAuditPreAuditChecklistComponent},
  {path:  'Newpreauditchecklist/:auditID/:action',component:NewAuditPreAuditChecklistComponent},
  { path: 'NewAudit/:auditID/:action', component: CategoryControlsComponent}, 
  { path: 'Mytasks', component: MyTasksComponent },
  { path: 'Mytasks/:auditID', component: AuditReadinessTasksComponent },  
  {​​​​​ path:'Mytasks/:AuditReadiness/:UpdateReadiness/:action/:auditID', component:AuditUpdateTasksComponent, canActivate: [AuthGuard] }​​​​​,
  {​​​​​ path:'Mytasks/Preaudittasks/:auditID', component:PreauditChecklistTasksComponent }​​​​​,
  {​​​​​ path:'Mytasks/Preaudittasks/PreauditUpdateTasksComponent/Checklist/:auditID/:action', component:PreauditUpdateTasksComponent, canActivate: [AuthGuard]}​​​​​,
  {​​​​​ path:'Mytasks/Ongoingauditlist/:auditID/:audittype', component:OngoingAuditsTasksComponent }​​​​​,
  { path: 'Mytasks/Ongoingaudits/Update/:auditID/:action/:audittype', component: OngoingUpdateTaskComponent},
  { path: 'Accountlandscape', component: AccountLandscapeComponent },
  { path: 'Accountlandscape/:action', component: AccountLandscapeComponent,canActivate: [AuthGuard] },
  { path: 'Accountlandscape/Control-risk/:parentCategoryID/:categoryID', component: ControlRiskComponent },
  { path: 'Accountlandscape/Control-detail/:cID', component: ControlDetailComponent },
  { path: 'ControllandscapeEdit/:parentCategoryID', component: ControlLandscapeEditComponent},
  { path: 'Definitionlandscape', component: ControlDefinitionComponent },
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
