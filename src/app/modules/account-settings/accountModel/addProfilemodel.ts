export class addaddressModel {
    public EmployeeAddressId !: number;
    public EmployeeId !: number;
    public Address1 !: string;
    public Address2 !: string;
    public County !: string;
    public City !: string;
    public Pincode !: string;
    public State !: string;
    public Country !: string;
    public IsSameAsBillingAddress !: boolean;
    public BillingAddressLine1 !: string;
    public BillingAddressLine2 !: string;
    public BillingCity !: string;
    public BillingState !: string;
    public BillingPincode !: string;
    public BillingCountry !: string;
    public BillingCounty !: string;
    public OrganizationName !: string;
    public OrganizationFaxNumber !: string;
    public OrganzitionPhoneNumber !: string;
    public OrganizationMobileNumber !: string;
    public OrganizationAdr  !: string
    public OrganizationBillingAdr !: string;
    public DisplayName !: string
    public TimeZone !: string;
    public DateFormat !: string;
    public OrganizationMobileNumberCountryCode !: string;
    public OrganizationPhoneCountryCode !: string;
    public OrganizationFaxCountryCode !: string;

}

export class addprofileModel {
    public EmployeeId !: number;
    public UserId !: string;
    public RoleId !: number;
    public Email !: string;
    public DOJ !: Date;
    public FirstName !: string;
    public MiddleName !: string;
    public LastName !: string;
    public Gender !: number;
    public DOB !: Date;
    public Age !: number;
    public IsActive !: boolean;
    public PhoneNumber !: string;
    public Password !: string;
    public EmailConfirmed !: boolean;
    public PhoneNumberConfirmed !: boolean;
    public TwoFactorEnabled !: boolean;
    public MobileNumber !: string
    public PhoneCountryCode !: string
    public MobileNumberCountryCode !: string

}