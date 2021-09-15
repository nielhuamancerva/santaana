import { AuthModel } from './auth.model';
import { RoleModel } from './role.model';
 
export class UserModel extends AuthModel {
  id: string;
  username: string;
  email: string;
  pic: string;
  enabled: string;
  roles: RoleModel[];
  // personal information
  name?: string;
  surname?: string;


  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
  }
}
