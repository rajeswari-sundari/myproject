export class AccountLandscape {
}

export class CategoryRiskdetails {
    public parent_category_id : string;
    public parent_category_name : string;
    public category_name : any;
    public category_short_name : string;
    public control_value : any;
   // public categoryRiskFlag : any;
   public percentageValue : string;
    public Color : any;
    public category_id : any;
    
}

export class PublishedRecordDetails {
    public dashboard_id: number;
    public dashboard_name: string;
    public associate_name: string;
    public published_on: string;
    public download_link: string;
}
export class CategoryRiskSummaryDetails{
    public parent_category_id : string;
    public parent_category_name : string;
    public percentageValue : string;
    public color: any;
    public colors : any;
    public colorcount:any;
}

export class ControlRiskDetails{
    public control_id : string;
    public control_name : string;
    public parent_category_id : string;
    public parent_category_name : string;
    public category_id : string;
    public category_name ; string;
    public controlRiskPercentage: any;
    public Color : any;
    public control_value:any;
    public follow_up_required: string;
}

export class PublishData {
    public dashboard_name : string;
    public bu_name : string;
    public account_id : string;
    public account_name : string;
    public project_id : string;
    public project_name : string;
    public associateIds : string;
    public p_user_id : string;
    public published_file_name : string;
    
}
export class DashboardSearchData{
    public bu_name:string;
    public account_id:string;
    public project_id:string;
}
export class AccLsSearchAccount{
    public LevelofView:string;
}
export class AccLsSearchProject{
    public LevelofView:string;
    public Accountid:string;
}
// export class AccLsSearchData {
//     public bu_name : string;
//     public account_id : string;
//     public project_id : string;
// }

export class AccLsSearchControlData {
    public Levelofview : string;
    public AccountId : string;
    public ProjectId : string;
    public controlId :  number;
    public IsDownload : boolean;

}

export class AccLsViewData {
    public Levelofview : string;
    public AccountName : string;
    public AccountId : string;
    public ProjectName : string;
    public ProjectId : string;
    public ParentCategoryName : string;
    public CategoryName : string;
    public CategoryRAGColor : string;
    public ControlName : string;
    public Followup: string;
}

export class AccLsAccountOverview {
    public AccountID: string;
    public AccountName: string;
    public DPName: string;
    public SBUName: string;
    public AccountType: string;
    public CurrentRevenue: string;
    public ContractEndDate: string;
    public servicesOffered: string;
    public RelationshipWithCognizant: string;
    public headcount: string;
    public CognizantLocation: string;
    public GDPRStatus: string;
    public GDPRProjectCoverage: string;
    public QMSFollowed: string;
    public LastIntervelAuditedDate: string;
    public LastcustomerAuditedDate: string;
    public InformationSecurityRisksOpen: string;
    public DeliveryRisksOpen: string;
    public ExternalAuditObservationsOpen: string;
    public DeliveryLeads: string;
}

export class AccLsAccountOverviewSearch {
    public AccountID: string;
    public BU: string;
}

// export class RoleWiseInfo {
//     public BU: string;
//     public Account: string;
//     public project: string;
// }

export class AccLsFilterBasedOnUserRequest {
    public p_user_id: string;
}