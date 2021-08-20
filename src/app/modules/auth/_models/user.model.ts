export class UserModel {

id: number;
roleCode:string;
roleDescription:string;
typePersonCode:string;
typePersonDescription:string;
typeDocumentCode:string;
typeDocumentDescription:string;
districtCode:string;
populatedCenterCode:string;
documentNumber:number;
name:string;
secondName:string;
lastName: string
secondLastName:string;
phone1: number;
phone2: number;
referentialAddress: string;
latitude: string;
longitude: string;
frontDocument: string;
reverseDocument: string;
lastPage: string;
evidence: string; 
userName: string;
email: string;
enable: boolean;


  setUser(user: any) {
    this.id = user.id||'';
    // user valido
    this.roleCode = user.oleCode || '';
    this.roleDescription = user.roleDescription|| '';
    this.typeDocumentCode = user.typeDocumentCode || '';
    this.typeDocumentDescription = user.typeDocumentDescription|| '';
    this.districtCode=user.districtCode||'';
    this.populatedCenterCode = user.populatedCenterCode || [];
    this.documentNumber = user.documentNumber || '';
    this.typePersonCode = user.typePersonCode || '';
    this.name = user.name || '';
    this.secondName = user.secondName || '';
    this.lastName = user.lastName||'';
    this.secondLastName = user.secondLastName||'';
    this.phone1=user.phone1||'';
    this.phone2=user.phone2||'';
    this.referentialAddress=user.referentialAddress||'';
    this.latitude=user.latitude||'';
    this.longitude=user.longitude||'';
    this.frontDocument=user.frontDocument||'';
    this.reverseDocument=user.reverseDocument||'';
    this.lastPage=user.lastPage||'';
    this.evidence=user.evidence||'';
    this.userName=user.userName||'';
    this.email=user.email||'';
  }
}






