export class AuditList{
  public preaudit_checklist_id:Number;
  public audit_name:string;
  public audit_id:string;
  public parent_customer:string;
  public actual_audit_date:string;
  public delivery_partner:string;
}
export class AuditName{
  public audit_id:string;
  public audit_name:string;
}

export class CheckListItemsforcheckbox{
  public audit_category_id:string;
  public audit_category_name:string;
  public audit_checklist_id :string
  public audit_checklist :string
  public Point_of_contact :string
  public Additional_POC_for_email :string
  public checklistchecked:boolean
}

export class CheckListItems{
  public audit_category_id:string;
  public audit_category_name:string;
  public audit_checklist_id :string
  public audit_checklist :string
  public Point_of_contact :string
  public Additional_POC_for_email :string
}
export class CheckListItemsJson{
  public Loadchecklist:CheckListItems[];
  public preaudit_checklist_id:Number;
  public user_id:string;
}
export class PointOfContact{
  public pointofContact:string;
}
export class PublishCheckList{
  public preaudit_checklist_id:Number;
  public user_id:string;
}
