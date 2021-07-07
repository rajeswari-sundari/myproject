
export class PreAuditChecklist{
    public preaudit_checklist_id:number;
    public parent_customer_name:string;
   
}
export class CheckListGridData{
    public  preaudit_checklist_id :string;
    public  audit_id:string;
    public  audit_name :string;
    public  parent_customer :string;
    public  pre_audit_date :string;
    public  actual_audit_date :string;

    public  preaudit_checklist_readiness :string;
}
export class Newauditchecklist{
    public parent_customer_name:string;
}
