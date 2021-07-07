export class MetricsDefinitionSearch {
    public ParentCategoryID : number;
    public CategoryID : number;
    //public control_id : number;
    public Control : string;
    public Weightage : string;  
}

export class ManageMetricsControls 
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

}

export class MetricsJonControl
{
    public updatemetric : ManageMetricsControls[];
    public userID : string;
}
