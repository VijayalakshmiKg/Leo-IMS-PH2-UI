// rolesModel
export class rolesModel {
    public RoleName !: string
    public Description !: string
    public RoleType !: string
    public RoleId !: number
    public RootMenu!: RootMenuModel[]
    public Settings !: SettingsModel

}

// RootMenuModel
export class RootMenuModel {
    public RootMenuId !: number
    public RootMenuName !: string
    public IsVisible !: boolean
    public RoleId !: number
    public FullAccess !: boolean
    public ViewAccess !: boolean
    public CreateAccess !: boolean
    public EditAccess !: boolean
    public DeleteAccess !: boolean
    public PageUrl !: string
    public SubMenus !: SubMenuModel
}

// SubMenuModel
export class SubMenuModel {
    public  RoleId  !: number 
    public SubMenuId  !: number
    public RootMenuId  !: number
    public SubMenuName  !: string
    public IsVisible  !: boolean
    public FullAccess  !: boolean
    public ViewAccess  !: boolean
    public CreateAccess  !: boolean
    public EditAccess  !: boolean
    public DeleteAccess  !: boolean
    public PageUrl  !: string
}



//  SettingsModel
export class SettingsModel {
    public SettingId  !: number
    public SettingName  !: string
    public IsVisible  !: boolean
    public PageUrl  !: string
    public RoleId  !: number
}


