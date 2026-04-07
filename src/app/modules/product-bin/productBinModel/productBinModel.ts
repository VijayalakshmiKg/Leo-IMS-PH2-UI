export class ProductBinModel {
    PB_Mapping_ID: number = 0;
    ProductID?: number | null;
    BinID?: number | null;
    CreatedBy?: string;
    CreatedDate?: Date | string | null;
    Deleted: boolean = false;
    ModifiedBy?: string;
    ModifiedDate?: Date | string | null;

    // Navigation properties for display (readonly from API)
    ProductName?: string;
    BinName?: string;
    MappingInfo?: string;

    constructor() {
        this.PB_Mapping_ID = 0;
        this.ProductID = null;
        this.BinID = null;
        this.Deleted = false;
        this.CreatedBy = '';
        this.ModifiedBy = '';
        this.CreatedDate = null;
        this.ModifiedDate = null;
    }
}
