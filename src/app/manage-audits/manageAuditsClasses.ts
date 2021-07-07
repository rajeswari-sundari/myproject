import { ManageControls } from "../manage-controls/manageControlsSearch";

export class ManageAuditsSearch {
    public CustomerID : number;
    public parent_customer_name : string;
    public audit_name : string;
    public audit_id : number;
    public status : string;
    public from_date : string;
    public to_date : string;
}

export class ManageAuditControls {
    public audit_id: string;
    public parent_category_id: string;
    public parent_category_name: string;
    public parent_weightage: string;
    public category_id: string;
    public category_name: string;
    public control_id: string;
    public control_name: string;
    public weightage: string;
    public restrict_weightage_calc: string;
    public metrics_type: string;
    public cliff_percent: string;
    public need_improvement_percent: string;
    public partially_ready_percent: string;
    public audit_ready_percent: string;
    public created_by: string;
    public created_date: Date;
    public last_upd_by: string;
    public last_upd_date: string;
    public objective : string;
    public overallweightage : string;
    public controlchecked:boolean;

    
}

export class ParentCustomersSearch {
    public p_classification : string;
    public p_department_group : string;
    public p_parent_customer_name : string;
}

export class ParentCustomers {
    public parent_customer_id : number;
    public parent_customer_name : string;
    public region : string;
    public delivery_partner : string;
}

export class Customers {
    public Customer_ID : string;
    public Customer_Name : string;
    public region : string;
    public delivery_partner : string;
    public IsSelected :  boolean;
}

export class Locations {
    public city  : string;
    public Location : string;
    public IsSelected : boolean;
}
export class AddNewAudit {
   public p_parent_customer_id : number;
   public p_parent_customer_name : string;
   public p_region : string;
   public p_delivery_partner : string;
   public p_department_group : string;
   public p_user_id : string; 
}

export class SavedAudit {
    public auditId : number;
    public message : string;
}

export class AuditDetails {
    public audit_id  : number;
    public audit_name : string;
    public parent_customer_id :string;
    public parent_customer_name : string;
    public pre_audit_start_date : string;
    public pre_audit_end_date : string;
    public actual_audit_start_date : string;
    public actual_audit_end_date : string;
    public audit_status : string;
    public CustomerDetails : CustomerDetailsList[];
    public LocationDetails : CustomerLocationDetails[];
    public programme : string;
}

export class UpdateAuditDetailsRequest {
    public p_audit_id  : number;
    public p_audit_name : string;
    public p_pre_audit_start_date : string;
    public p_pre_audit_end_date : string;
    public p_actual_audit_start_date : string;
    public p_actual_audit_end_date : string;
    public p_audit_status : string;
    public p_programme : string;
    public p_user_id : string;
    // public p_CustomerDetails : CustomerDetailsList[];
    // public p_LocationDetails : CustomerLocationDetails[];
}

export class CustomerDetailsList {
    public Customer_ID : string;
    public Customer_Name : string;
    public region : string;
    public delivery_partner : string;
    public NoOfProjects : number;
    public customerProjectDetails : CustomerProjectDetails [];
}
export class CustomerDetails {
    public audit_id : string;
    public parent_customer_id : string;
    public parent_customer_name : string;
    public customer_id : string;
    public customer_name : string;
    public region : string;
    public delivery_partner : string;
}

export class LocationDetail {
    public audit_id : string;
    public parent_customer_id : string;
    public parent_customer_name : string;
    public city : string;
    public location : string;
}

export class NewAuditDetails{
    
    public audit_name : string;
    public parent_customer_name : string;
    public pre_audit_date : string;
    public actual_audit_date: string;
    public delivery_partner : string;
    public status : string;
    public published:string;
}

export class SaveCustomerDetails {
    public CustomerDetails : CustomerDetails[];
    public UserId : string;
    public audit_id:string;
}

export class SaveLocationDetails {
    public LocationDetails : LocationDetail[];
    public UserId : string;
    public audit_id:string;
}

export class CustomerProject {
    public p_parent_customer_name : string;
    public p_customer_id : string;
    public p_customer_name : string;
    public p_audit_id : number;
} 
export class ProjectDetail {
    public audit_id : string;
    public parent_customer_id : string;
    public parent_customer_name : string;
    public customer_id : string;
    public customer_name : string;
    public project_id : string;
    public project_name : string;
}

export class SaveProjectDetails {
    public ProjectDetails : ProjectDetail[];
    public UserId : string;
    public audit_id:string;
    public p_customer_id : string;
}

export class CustomerProjectDetails {
    public Project_Id : string;
    public Project_Name : string;
    public IsSelected : boolean;
}

export class CustomerLocationDetails {
    public city : string;
    public Location : string;
}

export class ManageAudits {
        public audit_id : number;
        public audit_name : string;
        public parent_customer_name : string;
        public pre_audit_date : string;
        public actual_audit_date: string;
        public status : string;
        public audit_readiness : string
        public published : string;
}
export class PreviewAuditDisplay {
    public control_id : number;
    public control_name : string;
    public Account_point_of_contact : string;
    public Responsible_point_of_contact : string;

}

export class CategoryDataJson {
    public LoadAudit: ManageControls[];
    public audit_id: number;
    public user_id: number;
}


export class LoadAuditControlData {
    public audit_id: number;
    public parent_category_id: number;
    public category_id: number;
    public control_id: number;
    public control_name: string;
}

export class AuditControlDetails {
    public audit_id: string;
    public parent_category_id: string;
    public parent_category_name: string;
    public parent_weightage: string;
    public category_id: string;
    public category_name: string;
    public control_id: string;
    public control_name: string;
    public weightage: string;
    public restrict_weightage_calc: string;
    public metrics_type: string;
    public cliff_percent: string;
    public need_improvement_percent: string;
    public partially_ready_percent: string;
    public audit_ready_percent: string;
    public objective:string;
    public created_by: string;
    public created_date: Date;
    public last_upd_by: string;
    public last_upd_date: string;
}

export class AddAuditControlDetails {
    public AuditControlDetails: AuditControlDetails[];
    public p_audit_id: string;
    public p_user_id: string;
}

export class SaveAuditControl {
    public p_audit_id: string;
    public p_user_id: string;
}
export class PointOfContact{
    public pointofContact:string;
  }

export class AuditControl {
    public p_audit_id: string;
    public p_parent_category_id: string;
    public p_category_id: string;
    public p_control_id: string;
    public p_control_name: string;
}
export class EmailReminderDetails{
    public audit_id : string;
    public control_id : string;
    public control_name : string;
    public email_reminder_days : string;
    public email_reminder_time : string;    
    public email_reminder_timezone : string;
    public email_reminder_until : string;
    public created_by : string;
    public last_upd_by : string;
    public created_date : string;
    public last_upd_date : string;
    
}
export class updateEmailReminderDetails {
    public EmailReminderDetails:EmailReminderDetails[];
    public p_audit_id: string;
    public p_user_id: string;
}
export class EmailAuditDisplay {    
    public parent_category : string;
    public category_name : string;
    public control_name : string;    

}
   
export class AuditControlPOC {
    public audit_id: string;
    public control_id: string;
    public control_name: string;
    public Account_point_of_contact: string;
    public Responsible_point_of_contact:string;
    public APOC_email_address: string;
    public RPOC_email_address: string;
    public Additional_POC_for_email: string;
    public Add_POC_email_address: string;
}

export class UpdateAuditControlPOC {
    public AuditControlPOCs: AuditControlPOC[];
    public p_audit_id: string;
    public p_user_id: string;
    public IsImport: boolean;
}
export class ManageAuditMetricsControls 
{
    public parent_category_id : number;
    public category_id : number;
    public control_id : number;
    public control_name : string;
    public metrics_type : string;  
    public cliff_percent : string;
    public need_improvement_percent : string;
    public partially_ready_percent : string;
    public audit_ready_percent : string;
    public cliff_percentNumber : number;
    public cliff_percentRange1 : number;
    public cliff_percentRange2 : number;
    public need_improvement_percentNumber : number;
    public need_improvement_percentRange1 : number;
    public need_improvement_percentRange2 : number;
    public partially_ready_percentNumber : number;
    public partially_ready_percentRange1 : number;
    public partially_ready_percentRange2 : number;
    public audit_ready_percentNumber : number;
    public audit_ready_percentRange1 : number;
    public audit_ready_percentRange2 : number;
    public audit_id: number;
    public created_by: string;
    public created_date: Date;
    public last_upd_by: string;
    public last_upd_date: Date;

}

export class AuditControlMetrics {
    public audit_id: number;
    public control_id: number;
    public control_name: string;
    public metrics_type:string;
    public cliff_percent: string;
    public need_improvement_percent: string;
    public partially_ready_percent: string;
    public audit_ready_percent: string;
    public created_by: string;
    public created_date: Date;
    public last_upd_by: string;
    public last_upd_date: Date;
}

export class UpdateAuditControlMetrics {
    public AuditControlMetrics: AuditControlMetrics[];
    public p_audit_id: string;
    public p_user_id: string;
}

export class GetCategoryData {
    public parent_category_id : number;
    public parent_category_name : string;
    public category_id : number;
    public category_name : string;
    public control_id : number;
    public control_name : string;
    public weightage : number;
    public restrict_weightage_calc : string;
    public parent_weightage : number;
    public objective : string;
    public overallweightage : string;
    public categorychecked: boolean;
}

export class SearchCustomerData {
    public parentCustomerName : string;
    public p_audit_id : number;
}
export class PreAuditRequest {
    public p_audit_id: string;     
    public p_preaudit_checklist_id: string;
    public p_audit_checklist_id: string;
    
    
}