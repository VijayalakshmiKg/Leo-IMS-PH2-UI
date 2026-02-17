export class UserModel {
    UserName!: string ;
    Password!: string;
    UserPhone!: string;
    UserEmail!: string;
    FirstName!: string;
    LastName!: string;
}
export interface IMenu {
    Title: string;
    Url: string;
    isOpen?: boolean;
    Items?: Array<IMenu>;
    Icon?: string;
}