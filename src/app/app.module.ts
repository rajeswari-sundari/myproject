import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatCardModule  } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'; 
import { ChartsModule,ThemeService } from 'ng2-charts';

import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';
import { AgGridModule } from 'ag-grid-angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from'ngx-toastr';
import { ToastrService } from'ngx-toastr';

import { AppComponent } from './app.component';
import { ManageControlsComponent } from './manage-controls/manage-controls.component';
import { ManageControlsService } from './manage-controls/manage-controls.service'


import { AddEditControlComponent } from './add-edit-control/add-edit-control.component'
import { MetricsDefinitionService } from './metrics-definition/metrics-definition.service';
import { MetricsDefinitionComponent } from './metrics-definition/metrics-definition.component';

import { ConfirmDialogComponent } from './Shared/confirm-dialog/confirm-dialog.component';
import { CustomTooltipComponent } from './Custom/custom-tooltip/custom-tooltip.component'; 
import {​​​​​ AddEditChecklistComponent }​​​​​ from './add-edit-checklist/add-edit-checklist.component';
import {​​​​​ EditCategoryControlComponent }​​​​​ from './manage-controls/edit-category-control/edit-category-control.component';
import { EditMetricsDefinationComponent } from './manage-controls/edit-metrics-defination/edit-metrics-defination.component';
import { CustomAGGridLinkButtonComponent } from './Custom/custom-aggrid-link-button/custom-aggrid-link-button.component';
import { ManageAuditsComponent } from './manage-audits/manage-audits.component';
import { PreAuditChecklistComponent } from './pre-audit-checklist/pre-audit-checklist.component';
import { PreAuditChecklistService } from './pre-audit-checklist/pre-audit-checklist.service';
import { NewAuditPreAuditChecklistComponent } from './new-audit-pre-audit-checklist/new-audit-pre-audit-checklist.component';
import { CategoryControlsComponent } from './manage-audits/category-controls/category-controls.component';
import { EmailRemindersComponent } from './manage-audits/email-reminders/email-reminders.component';
import { ManageMetricsComponent } from './manage-audits/manage-metrics/manage-metrics.component';
import { PreviewPublishComponent } from './manage-audits/preview-publish/preview-publish.component';
import { ManagePocComponent } from './manage-audits/manage-poc/manage-poc.component';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';  
import { ManageAuditService } from './manage-audits/manage-audits.service'
import { Newauditpreauditchecklistservice } from './new-audit-pre-audit-checklist/new-audit-pre-audit-checklist.service';
import { ManagePOCChecklistComponent } from './new-audit-pre-audit-checklist/manage-poc-checklist/manage-poc-checklist.component';
import { PublishPreviewCheckListComponent } from './new-audit-pre-audit-checklist/publish-preview-check-list/publish-preview-check-list.component';
import { CheckListItemsComponent } from './new-audit-pre-audit-checklist/check-list-items/check-list-items.component';
import { PreNewAuditComponent } from './manage-audits/pre-new-audit/pre-new-audit.component';
import { NewAuditComponent } from './manage-audits/new-audit/new-audit.component';
import { CustomCheckboxComponent } from './Custom/custom-checkbox/custom-checkbox.component';
import { DatePipe } from '@angular/common';
import { AgGridLinkComponent } from './manage-audits/ag-grid-link/ag-grid-link.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AuditReadinessTasksComponent } from './my-tasks/audit-readiness-tasks/audit-readiness-tasks.component';
import { AuditUpdateTasksComponent } from './my-tasks/audit-readiness-tasks/audit-update-tasks/audit-update-tasks.component';
import { CategoryControlsTabComponent } from './manage-audits/category-controls-tab/category-controls-tab.component';
import { OngoingAuditsTasksComponent } from './my-tasks/ongoing-audits-tasks/ongoing-audits-tasks.component';
import { PreauditChecklistTasksComponent } from './my-tasks/preaudit-checklist-tasks/preaudit-checklist-tasks.component';
import { PreauditUpdateTasksComponent } from './my-tasks/preaudit-checklist-tasks/preaudit-update-tasks/preaudit-update-tasks.component';
import { CustomAggridLinkButtonMyTasksComponent } from './Custom/custom-aggrid-link-button-my-tasks/custom-aggrid-link-button-my-tasks.component';
import { OngoingUpdateTaskComponent } from './my-tasks/ongoing-audits-tasks/ongoing-update-task/ongoing-update-task.component';
import { AccountLandscapeComponent } from './account-landscape/account-landscape.component';
import { DashboardLandscapeComponent } from './account-landscape/dashboard-landscape/dashboard-landscape.component';
import { ControlLandscapeComponent } from './account-landscape/control-landscape/control-landscape.component';
import { IntegrationLandscapeComponent } from './account-landscape/integration-landscape/integration-landscape.component';
import { PublishLandscapeComponent } from './account-landscape/publish-landscape/publish-landscape.component';
import { ControlRiskComponent } from './account-landscape/dashboard-landscape/control-risk/control-risk.component';
import { ControlDetailComponent } from './account-landscape/dashboard-landscape/control-detail/control-detail.component';
import { ControlEditComponent } from './account-landscape/control-landscape/control-edit-category/control-edit-category.component';
import { ControlDefinitionComponent } from './account-landscape/control-landscape/control-definition/control-definition.component';
import { ControlLandscapeService } from './account-landscape/control-landscape/control-landscape.service';
import { ControlLandscapeEditComponent } from './account-landscape/control-landscape/control-landscape-edit/control-landscape-edit.component';
import { CustomRadioGroupComponent } from './Custom/custom-radio-group/custom-radio-group.component';
import { CustomSelectboxComponent } from './Custom/custom-selectbox/custom-selectbox.component';
import { CustomAggridLinkButtonAcclsComponent } from './Custom/custom-aggrid-link-button-accls/custom-aggrid-link-button-accls.component';
import { PreAuditComponent } from './manage-audits/pre-audit/pre-audit.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AppUserService } from './app-user.service';
import { AuthGuard } from './AuthGuard';


// import {​​​​​ EditLandscapeCategoryComponent }​​​​​ from './account-landscape/control-landscape/edit-category-control.component';
//import { AgGridModule } from '@ag-grid-community/angular'



// export function initializeApp(appInitService: AppInitService) {
//   return (): Promise<any> => { 
//     return appInitService.Init();
//   }
// }

@NgModule({
  declarations: [
    AppComponent,    
    ManageControlsComponent,
    AddEditControlComponent,
    MetricsDefinitionComponent,
    ConfirmDialogComponent,
    CustomTooltipComponent,
    AddEditChecklistComponent,
    EditCategoryControlComponent,
    EditMetricsDefinationComponent,
    CustomAGGridLinkButtonComponent,
    ManageAuditsComponent,
    PreAuditChecklistComponent,
    NewAuditPreAuditChecklistComponent,
    CategoryControlsComponent,
    EmailRemindersComponent,
    ManageMetricsComponent,
    PreviewPublishComponent,
    ManagePocComponent,
    ManagePOCChecklistComponent,
    PublishPreviewCheckListComponent,
    CheckListItemsComponent,
    PreNewAuditComponent,
    NewAuditComponent,
    CustomCheckboxComponent,
    AgGridLinkComponent,
    MyTasksComponent,
    AuditReadinessTasksComponent,
    AuditUpdateTasksComponent,
    CategoryControlsTabComponent,
    OngoingAuditsTasksComponent,
    PreauditChecklistTasksComponent,
    PreauditUpdateTasksComponent,
    CustomAggridLinkButtonMyTasksComponent,
    OngoingUpdateTaskComponent,
    AccountLandscapeComponent,
    DashboardLandscapeComponent,
    ControlLandscapeComponent,
    IntegrationLandscapeComponent,
    PublishLandscapeComponent,
    ControlRiskComponent,
    ControlDetailComponent,
    ControlEditComponent,
    ControlDefinitionComponent,
    ControlLandscapeEditComponent,
    CustomRadioGroupComponent,
    CustomSelectboxComponent,
    CustomAggridLinkButtonAcclsComponent,
    PreAuditComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    PdfJsViewerModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ChartsModule,
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AgGridModule.withComponents([CustomTooltipComponent,EditCategoryControlComponent,
      EditMetricsDefinationComponent,CustomAGGridLinkButtonComponent,CustomCheckboxComponent,
      AgGridLinkComponent, CustomAggridLinkButtonMyTasksComponent,ControlEditComponent,
      CustomRadioGroupComponent, CustomSelectboxComponent, CustomAggridLinkButtonAcclsComponent]),
    ToastrModule.forRoot(
      {
        positionClass: "toast-top-full-width",
        closeButton: true,
        timeOut: 2000,
        maxOpened: 1,
      }
    ),
    NgxSpinnerModule
  ],
  entryComponents: [
    ConfirmDialogComponent,ManagePOCChecklistComponent
  ],
  providers: [AppInitService,
              ManageControlsService,
              MetricsDefinitionService,
              PreAuditChecklistService,
              ManageAuditService,
              Newauditpreauditchecklistservice,
              ControlLandscapeService,
              DatePipe,ThemeService, AppUserService, AuthGuard  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
