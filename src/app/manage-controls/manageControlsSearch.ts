export class ManageControlsSearch {
    public ParentCategoryID : number;
    public CategoryID : number;
   // public ControlID : number;
    public Control : string;
    public Weightage : number;
}


export class ManageCategories{
    public parent_category_id:number;
    public parent_category_name:string;
    public category_name:string;
    public category_id:number;
    public Hasparent:string;
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
    public  jsonadd :  ManageControls [] ;
    public userID : string;
 
}
 
export class ManageControls {
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
    
}
