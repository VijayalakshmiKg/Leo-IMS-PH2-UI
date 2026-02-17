export class CustomerTrailerInTypeModel {
    CTIT_Mapping_ID: number = 0;
    CustomerID: number = 0;
    CustomerName: string = '';
    TrailerTypeID: number = 0;
    TrailerTypeName: string = '';
    Status: string = 'Active';
    CreatedBy: string = '';
    ModifiedBy: string = '';
    CreatedDate: Date = new Date();
    ModifiedDate: Date = new Date();
}
