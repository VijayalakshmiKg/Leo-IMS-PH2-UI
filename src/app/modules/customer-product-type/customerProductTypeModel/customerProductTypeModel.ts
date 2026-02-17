export class CustomerProductTypeModel {
    CPT_Mapping_ID: number = 0;
    CustomerID: number = 0;
    CustomerName: string = '';
    ProductTypeID: number = 0;
    ProductTypeName: string = '';
    Status: string = 'Active';
    CreatedBy?: string;
    CreatedDate?: string;
    ModifiedBy?: string;
    ModifiedDate?: string;
}
