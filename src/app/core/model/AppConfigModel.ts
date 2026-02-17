//import { UserModel } from './UserModel';

import { IMenu } from "./user.model";

// import { IMenu } from "src/app/ux/bmsmenu/bmsmenu.component";

// import { IMenu } from "src/app/ux/bmsmenu/bmsmenu.component";

export class AppConfigModel {
    //public LoginUser: UserModel = new UserModel();
    public ApiEndPoint!: string;
    public AppMenus: Array<IMenu> = [];
    public ScreenWidth!: number;
    public ScreenHeight!: number;
    public AvailableAreaWidth!: number;
    public AvailableAreaHeight!: number;
}
