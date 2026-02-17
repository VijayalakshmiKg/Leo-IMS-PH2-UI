export class CustomerTrailerOutModel {
    CTO_Mapping_ID: number = 0;
    CustomerID: number = 0;
    CustomerName: string = '';
    TrailerID: number = 0;
    TrailerNumber: string = '';
    Status: string = 'Active';
    CreatedBy: string = '';
    ModifiedBy: string = '';
    CreatedDate: Date = new Date();
    ModifiedDate: Date = new Date();
}
