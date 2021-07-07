export class MyTasks {
}

//Audit Readiness and Update Audit Readiness Screens
export class LoadAuditReadiness {
    public audit_id: string;
    public user_id: string;
    public audit_name: string;
    public parent_customer_name: string;
    public parent_category_id: string;
    public parent_category_name: string;
    public category_id: string;
    public category_name: string;
    public control_id: string;
    public control_name: string;
    public target_achieved: string;
    public RPOC_comments: string;
    public objective: string;
    public evidence: string;
    public task_status_updated_by: string;
    public actual_audit_date: string;
    public user_role: string;
    public comments : string;
    public task_status: string;
    public responsible_point_of_contact: string;
    public account_point_of_contact: string;
}

// Update Audit Readiness Screen
export class SaveAuditReadinessTask {
    public audit_id: string;
    public control_id: string;
    public target_achieved: string;
    public RPOC_comments: string;
    public evidence: string;
    public user_id: string;
    public action: string;
    public comments: string;
}

// SaveAuditbyAPOC 
export class SaveAuditbyAPOC {
    public audit_id: string;
    public control_id: string;
    public user_id: string;
    public comments: string;
    public action: string;    
    public role: string;
}
// SaveAuditbyRPOC
export class SaveAuditbyRPOC {
    public audit_id: string;
    public control_id: string;
    public user_id: string;
}
export class EmailDetails {
    public p_audit_id: string;
    public p_control_ids: string; 
    public audit_checklist_id: string;
}


export class SearchTasks{
    public user_id : string;
    public audit_id : string;
}
export class SearchProgress {
    public audit_id : string;
}
export class SearchOngoindAudits {
    public p_audit_id : string;
}
export class ProgressList {
    public audit_id : string;
    public audit_name : string;
    public parent_customer_id : string;
    public parent_customer_name : string;
    public control_id : string;
    public control_name : string;
    public Updated : string;
    public Total_count : string;
    public Updated_count : string;
}
// Load PreAuditChecklist tasks
export class LoadPreAuditChecklistTasks {
    public audit_id: string;    
    public user_id: string;
    public audit_name: string;
    public parent_customer_name: string;
    public preaudit_checklist_id: string;
    // public parent_category_name: string;
    public audit_category_id: string;
    public audit_category_name: string;
    public audit_checklist_id: string;
    public audit_checklist: string;
    public comments: string;
    // public RPOC_comments: string;
    public task_status: string;
    public user_role: string;
    public target_achieved: string;
    public actual_audit_date: string;
    public point_of_contact: string;
}
// SaveAuditbyRPOCData
export class SavePreAuditbyRPOC {
    public p_audit_id: string;
    public p_preaudit_checklist_id: string;
    public p_user_id: string;
    public p_audit_checklist_id: string;
    public p_comments: string;
    public p_action: string;    
    public p_role: string;
    public p_target_achieved: string;
}

export class Tasks {
    public audit_id : string;
    public audit_name : string;
    public parent_customer_name : string;
    public task_due_date : string;
    public number_of_tasks : string;
    public task_status : string;
    public overall_compliance_status : string;
    public overall_progress_status: string;
}

export class PreAuditCheckList {
    public audit_id : string;
    public audit_name : string;
    public parent_customer_name : string;
    public task_due_date : string;
    public number_of_tasks : string;
    public task_status : string;
    public progress_status : string;
}
export class OngoingAuditList {
    public audit_id : string;
    public audit_name : string;
    public parent_customer_name : string;
    public pre_audit_date : string;
    public actual_audit_date : string;
    public delivery_partner : string;
    public audit_status : string;
    public audit_readiness : string;
    public published : string;
    public audit_type : string;
}

export class OngoingAuditDetails {
    public audit_id : string;
    public user_id: string;
    public audit_name : string;
    public parent_customer_name : string;
    public parent_category_name : string;
    public category_id : string;
    public category_name : string;
    public control_id : string;
    public control_name : string;
    public actual_audit_date : string;
    public task_status : string;
    public target_achieved : string;
    public RPOC_comments : string;
    public MDU_comments: string;
    public objective : string;
    public task_status_updated_by : string;
    public responsible_point_of_contact : string;
    public account_point_of_contact : string;
    public pending_with : string;
    public p_audit_id : string;
    public evidence: string;
    public comments : string;
}

export class OngoingPreAuditChecklistDetails {
    public audit_id : string;
    public audit_name : string;
    public parent_customer_name : string;        
    public actual_audit_date  : string;
    public task_status  : string;
    public target_achieved  : string;
    public comments  : string;
    public task_status_updated_by  : string;
    public point_of_contact  : string;
    public pending_with  : string;
    public user_id  : string;
    public audit_category_name  : string;
    public audit_category_id  : string;
    public audit_checklist  : string;
    public audit_checklist_id  : string;
    public preaudit_checklist_id  : string;
    
    
   
}

export class SaveAudibyMDU {
    public audit_id : string;
    public control_id : string;
    public p_target_achieved  : string;
    public user_id  : string;
    public comments  : string;
    public evidence: string;
    public action: string;
    public audit_type : string;
    public p_audit_checklist_id  : string;
    public p_preaudit_checklist_id  : string;
}

export class MDUUserlist {
    public associate_id: string;
    public associate_name: string
    public associate_email_id: string
    public associatedetail: string
    public associatelist: string
}