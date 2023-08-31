export interface GetUserPermissionsResponse {
    message:     string;
    Permissions: Permissions;
}

export interface Permissions {
    date:  Date;
    User:  string;
    Level: string[];
    Role:  string[];
}
