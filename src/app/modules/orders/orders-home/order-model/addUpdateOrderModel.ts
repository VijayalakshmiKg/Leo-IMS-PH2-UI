export class addUpdateOrderModel {
  // public OrderID   !: Number
  // public OrderNo !: string
  // public TruckID   !: Number
  // public DriverID   !: Number
  // public TrailerID   !: Number
  // public ConsignorID  !: Number
  // public ConsigneeID   !: Number
  // public MaterialID   !: Number
  // public Quantity !: string
  // public AssignedBy   !: Number
  // public DepartureDateTime   !: Date
  // public ArrivalDateTime     !: Date
  // public Status   !: string
  // public OrderDate     !: Date
  // public ConfirmedByDriver   !: boolenean
  // public Deleted   !: boolenean
  // public Createddate     !: Date
  // public CreatedBy   !: string
  // public ModifiedDate     !: Date
  // public ModifiedBy   !: string
  // public TotalDistance   !: string
  // public Notes   !: string
  // public TicketNo   !: string
  public OrderID!: number
  public OrderNo!: string
  public TruckID!: number | null
  public DriverID!: number | null
  public TrailerID!: number | null
  public ConsignorID!: number
  public ConsigneeID!: number
  public MaterialID!: number
  public Quantity!: string
  public AssignedBy!: number
  public DepartureDateTime!: Date
  public ArrivalDateTime!: Date
  public Status!: string
  public OrderDate!: Date | string
  public ConfirmedByDriver!: boolean
  public Deleted!: boolean
  public Createddate!: Date
  public CreatedBy!: string
  public ModifiedDate!: Date
  public ModifiedBy!: string
  public TotalDistance!: string
  public Notes!: string
  public TicketNo!: string
  public RepeatDays!: string
  public RepeatOrder!: boolean
  public PickupTrailerNo!: string
  public PickupTrailerNotes!: string
}

export class statusUpadte {
  public DriverID!: Number
  public TruckID!: Number
  public TrailerID!: Number
  public Status!: string
  public PickupTrailerNumber!: string
  public  TrailerDropId! : Number

}

export class transitModel {
  public TransitId!: Number
  public OrderID!: Number
  public Status !: string

}