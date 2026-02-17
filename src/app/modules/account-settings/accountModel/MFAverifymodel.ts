export class MFAverifyModel {
    public UserMFAID !: number
    public Username!: string
    public Email!: string
    public PasswordHash!: string
    public FirstName!: string
    public MiddleName!: string
    public LastName!: string
    public DateOfBirth!: Date
    public IsEmailVerified!: boolean
    public MobileNumber!: string
    public IsMobileVerified!: boolean
    public AlternateMobileNumber!: string
    public PhoneNumberCountryCode!: string
    public MobileOTP!: string
    public EmailOTP!: string
    public AuthenticatedAppOTP!: string
    public IsActive!: boolean
    public IsTwofactorEnabled!: boolean
    public Code!: string
    public Status!: string
    public Message!: string
    public AccessToken!: string
    public FormatedKey!: string
    public AuthenticatedKey!: string
    public AuthTypeCode!: string
    public CurrentPassword!: string
    public OldPassword!: string
}

