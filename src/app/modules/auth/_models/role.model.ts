export class RoleModel {
    id: string;
    name: string;
    description: Date;

    setAuth(role: any) {
        this.id = role.id;
        this.name = role.name;
        this.description = role.description;
    }
}