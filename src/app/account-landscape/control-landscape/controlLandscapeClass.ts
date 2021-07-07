export class ManageControlsSearch {
    public ParentCategoryID : number;
    public CategoryID : number;   
    public Control : string;    
}


export class ManageCategories{
    public parent_category_id:number;
    public parent_category_name:string;
    public category_name:string;
    public category_id:number;
    public Hasparent:string;
    public userId : string;
    public key_indicator_percent: number;
    public compliance_indicator_percent: number;
    public category_short_name: string;
    

}

export class ManageParentCategory{
    public Key : number;
    public Value : string;
    public SortOrder : string | null;
}

export class GetAuditChecklist{
    public audit_category_id :number;
    public audit_category_name:string;
    public audit_checklist :string;
    public audit_checklist_id:number;
}

export class ChecklistJsondata {
    public  ChecklistData :  GetAuditChecklist [];
    public  UserId:string;
 
}

export class ManageControlsdata {
    public  accLsAddUpdateControlContexts :  ManageControls [] ;
    public user_id : string;
    public p_parent_category_id : number;
 
}
export class MetricJsonControl {
    public  accLsManagecontrolcontext  :  ManageControls [] ;
    public user_id : string;
    
 
}
export class ManageControls {
    public parent_category_id : number;
    public parent_category_name : string;
    public category_id : number;
    public category_name : string;
    public control_id : number;
    public control_name : string;
    public weightage : number;
    public indicator_type : string;
    public follow_up_required : string;
    public control_desc : string;
    public amber_percent : string;
    public red_percent  : string;
    public green_percent  : string;
    
    // public restrict_weightage_calc : string;
    // public parent_weightage : number;
    // public objective : string;
    // public overallweightage : string;
    
}
