export class CustomerProductModel {
    CP_Mapping_ID: number = 0;
    CustomerID?: number | null;
    ProductID?: number | null;
    CreatedBy?: string;
    CreatedDate?: Date | string | null;
    Deleted: boolean = false;
    ModifiedBy?: string;
    ModifiedDate?: Date | string | null;
    
    // Navigation properties for display (readonly from API)
    CustomerName?: string;
    CustomerCode?: string;
    ProductName?: string;
    ProductTypeName?: string;
    CustomerProductDetails?: string;
    MappingInfo?: string;
    
    constructor() {
        this.CP_Mapping_ID = 0;
        this.CustomerID = null;
        this.ProductID = null;
        this.Deleted = false;
        this.CreatedBy = '';
        this.ModifiedBy = '';
        this.CreatedDate = null;
        this.ModifiedDate = null;
    }
}
