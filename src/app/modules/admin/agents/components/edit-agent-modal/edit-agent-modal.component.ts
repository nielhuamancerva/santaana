import { UserModel } from './../../../_models/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeDocumentModel } from 'src/app/modules/admin/_models/TypeDocument.model';
import { TypePersonModel } from 'src/app/modules/admin/_models/TypePerson.model';
import { RolesModel } from 'src/app/modules/admin/_models/Roles.model';
import { Observable } from 'rxjs';
import { DepartamentRepositoryService } from 'src/app/modules/admin/_services/departament-repository.service';
import { DistrictRepositoryService } from 'src/app/modules/admin/_services/distric-repository.service';
import { ProvinceRepositoryService } from 'src/app/modules/admin/_services/province-repository.service';
import { RoleRepositoryService } from 'src/app/modules/admin/_services/role-repository.service';
import { TypeDocumentRepositoryService } from 'src/app/modules/admin/_services/typedocument-repository.service';
import { TypePersonRepositoryService } from 'src/app/modules/admin/_services/typeperson-repository.service';
import { DepartamentModel } from '../../../_models/Departament.model';
import { DistrictModel } from '../../../_models/District.model';
import { ProvinceModel } from '../../../_models/Province.model';
import { ImageModel } from '../../../_models/Image.model';
import { AgentsService } from '../../../_services/agents.service';
import { FileService } from '../../../_services/file.service';
import { HttpResponse } from '@angular/common/http';


const EMPTY_USER: UserModel ={
    id: undefined,
    name: '',
    lastName: '',
    typeDocumentCode: '',
    documentNumber: '',
    phone1: '',
    phone2: '',
    email: '',
    latitude: '',
    longitude: '',
    typePersonCode: '',
    typeObjectCode: ''
};

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-edit-agent-modal',
    templateUrl: './edit-agent-modal.component.html',
    styleUrls: ['./edit-agent-modal.component.scss'],
})

export class EditAgentModalComponent implements OnInit {
    @Input() id: UserModel;
    private subscriptions: Subscription[] = [];
    $_typedocument: Observable<TypeDocumentModel[]>;
    $_typeperson: Observable<TypePersonModel[]>;
    file: File;
    photoSelected1:  String | ArrayBuffer;
    photoSelected2:  String | ArrayBuffer;
    photoSelected3:  String | ArrayBuffer;
    photoSelected4:  String | ArrayBuffer;
    photoSelected5:  String | ArrayBuffer;
  
    formGroup: FormGroup;
    agentUser: UserModel;
    userName: string = '';
    img1: ImageModel;
    img2: ImageModel;
    img3: ImageModel;
    img4: ImageModel;
    $_roles: Observable<RolesModel[]>;
    $_departament: Observable<DepartamentModel[]>;
    $_province: ProvinceModel[];
    $_district: Observable<DistrictModel[]>;
    $_img1: Observable<Blob>;
    $_img2: Observable<Blob>;
    $_img3: Observable<Blob>;
    $_img4: Observable<Blob>;

    constructor(
        private _agentService: AgentsService,
        public rolesService: RoleRepositoryService,
        private fb: FormBuilder, 
        public modal: NgbActiveModal,
        private typodocumentService: TypeDocumentRepositoryService,
        private typopersonService: TypePersonRepositoryService,
        private departamentService: DepartamentRepositoryService,
        private provinceService: ProvinceRepositoryService,
        private districtService: DistrictRepositoryService,
        private fileService: FileService
    ) { }

    ngOnInit(): void {
        this.loadFormWithOutInfo();
    }


    loadUtilities() {
        this.loadDepartament();
        this.$_roles = this.rolesService.getAllRoles(0, 100, "USEREXT");
        this.$_typedocument = this.typodocumentService.getAllTypedocument();
        this.$_typeperson = this.typopersonService.getAllTypeperson();
        this.loadAgentUser();

    }

    private prepareAgentUser() {
        const formData = this.formGroup.value;
        this.agentUser.roleCode = formData.roleCode;
        this.agentUser.typePersonCode = formData.typePersonCode;
        this.agentUser.ubigeeCode = formData.districtCode;
        this.agentUser.typeObjectCode = "USEREXT";
        this.agentUser.typeDocumentCode = formData.typeDocumentCode;
        this.agentUser.documentNumber = formData.documentNumber;
        this.agentUser.name = formData.name;
        this.agentUser.lastName = formData.lastName;
        this.agentUser.phone1 = formData.phone1;
        this.agentUser.phone2 = formData.phone2;
        this.agentUser.email = formData.email ? formData.email : formData.userName + "@company.com"  ;
        this.agentUser.userName = formData.userName;
        this.agentUser.address = formData.address;
        this.agentUser.latitude = formData.latitude;
        this.agentUser.longitude = formData.longitude;
        this.agentUser.ccpp = formData.populatedCenterCode;
        this.agentUser.hasher = formData.hasher;

    }
      

    loadAgentUser() {
        if (!this.id) {
            this.agentUser = EMPTY_USER;
        } else {

            this.agentUser = this.id;

            this.loadPronvince(this.agentUser.department.code);
            this.loadDistrict(this.agentUser.province.code);

            this.formGroup.get('name').patchValue(this.agentUser.name);
            this.formGroup.get('lastName').patchValue(this.agentUser.lastName);
            this.formGroup.get('documentNumber').patchValue(this.agentUser.documentNumber);
            this.formGroup.get('phone1').patchValue(this.agentUser.phone1);
            this.formGroup.get('phone2').patchValue(this.agentUser.phone2);
            this.formGroup.get('email').patchValue(this.agentUser.email);
            this.formGroup.get('address').patchValue(this.agentUser.address);
            this.formGroup.get('latitude').patchValue(this.agentUser.latitude);
            this.formGroup.get('longitude').patchValue(this.agentUser.longitude);
            this.formGroup.get('userName').patchValue(this.agentUser.userName);
            this.formGroup.get('populatedCenterCode').patchValue(this.agentUser.ccpp);

            this.formGroup.get('department').patchValue(this.agentUser.department.id);
            this.formGroup.get('province').patchValue(this.agentUser.province.id);
            this.formGroup.get('districtCode').patchValue(this.agentUser.district.code);
            this.formGroup.get('typePersonCode').patchValue(this.agentUser.typePerson.code);
            this.formGroup.get('typeDocumentCode').patchValue(this.agentUser.typeDocument.code);
            this.formGroup.get('roleCode').patchValue(this.agentUser.role.code);

            const _img1 = this.fileService.getFile(this.agentUser.data.frontDocument).subscribe( (response: HttpResponse<Blob>)  => {
              
                 // Extract content disposition header
                const contentDisposition = response.headers.get('Content-Disposition');

                // Extract the file name
                const filename = contentDisposition
                        .split(';')[1]
                        .split('filename')[1]
                        .split('=')[1]
                        .trim()
                        .match(/"([^"]+)"/)[1];

                this.formGroup.get('foto1').patchValue(response.body);        
                this.img1 = {file: response.body, name: filename, type: response.body.type}
                const reader = new FileReader();
                reader.onload= e => this.photoSelected1 = reader.result;
                reader.readAsDataURL(response.body);
            });

            this.subscriptions.push(_img1);
            
            const _img2 = this.fileService.getFile(this.agentUser.data.reverseDocument).subscribe( (response: HttpResponse<Blob>)  => {
              
                // Extract content disposition header
               const contentDisposition = response.headers.get('Content-Disposition');

               // Extract the file name
               const filename = contentDisposition
                       .split(';')[1]
                       .split('filename')[1]
                       .split('=')[1]
                       .trim()
                       .match(/"([^"]+)"/)[1];

               this.formGroup.get('foto2').patchValue(response.body);        
               this.img2 = {file: response.body, name: filename, type: response.body.type}
               const reader = new FileReader();
               reader.onload= e => this.photoSelected2 = reader.result;
               reader.readAsDataURL(response.body);
           });

            this.subscriptions.push(_img2);

            const _img3 =this.fileService.getFile(this.agentUser.data.lastPage).subscribe( (response: HttpResponse<Blob>)  => {
              
                // Extract content disposition header
               const contentDisposition = response.headers.get('Content-Disposition');

               // Extract the file name
               const filename = contentDisposition
                       .split(';')[1]
                       .split('filename')[1]
                       .split('=')[1]
                       .trim()
                       .match(/"([^"]+)"/)[1];

               this.formGroup.get('foto3').patchValue(response.body);        
               this.img3 = {file: response.body, name: filename, type: response.body.type}
               const reader = new FileReader();
               reader.onload= e => this.photoSelected3 = reader.result;
               reader.readAsDataURL(response.body);
           });

            this.subscriptions.push(_img3);

            const _img4 = this.fileService.getFile(this.agentUser.data.evidence).subscribe( (response: HttpResponse<Blob>)  => {
              
                // Extract content disposition header
               const contentDisposition = response.headers.get('Content-Disposition');

               // Extract the file name
               const filename = contentDisposition
                       .split(';')[1]
                       .split('filename')[1]
                       .split('=')[1]
                       .trim()
                       .match(/"([^"]+)"/)[1];

               this.formGroup.get('foto4').patchValue(response.body);        
               this.img4 = {file: response.body, name: filename, type: response.body.type}
               const reader = new FileReader();
               reader.onload= e => this.photoSelected4 = reader.result;
               reader.readAsDataURL(response.body);
           });

            this.subscriptions.push(_img4);
        }
    }

    asignUserNamePartOne(){
        if(this.agentUser.name.length > 3){
            let texto = this.agentUser.name.substr(0,3);
            this.userName = texto;
        }
    }

    asignUserNamePartTwo(){
        if(this.agentUser.lastName.length > 3){
            console.log("ejecuta la 2da parte")
            let texto = this.agentUser.lastName.substr(0,3);
            this.userName = this.userName + texto;
        }
    }

    loadFormWithOutInfo() {
        this.formGroup = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            lastName: ['', ],
            documentNumber: ['', Validators.compose([Validators.required])],
            phone1: ['', Validators.compose([Validators.required])],
            phone2: ['', ],
            email: ['', ],
            address: ['', Validators.compose([Validators.required])],
            longitude: ['', ],
            latitude: ['', ],
            typePersonCode: ['', Validators.compose([Validators.required])],
            typeDocumentCode: ['', Validators.compose([Validators.required])],
            roleCode: ['', Validators.compose([Validators.required])],
            userName: ['', Validators.compose([Validators.required])],
            foto1: [null],
            foto2: [null],
            foto3: [null],
            foto4: [null],
            department: ['', Validators.compose([Validators.required])],
            province: ['', Validators.compose([Validators.required])],
            districtCode: ['', Validators.compose([Validators.required])],
            populatedCenterCode: ['', Validators.compose([Validators.required])],
            hasher: ['',  !this.id ? Validators.compose([Validators.required]) : null]
        });


        this.loadUtilities();
    }
    
    getPic() {
        return `url('./assets/media/users/100_1.jpg')`;
    }
    
    deletePic() {}

    sendToServer() {
        this.prepareAgentUser();
        if (!this.id) {
            this.save();
          } else {
            this.edit();
          }
    }

    save(){
        
        const _formData = this.formGroup.value;
        const fileJson = new File([JSON.stringify(this.agentUser)] , "user.json", {type: "application/json"});

        const f1 = new File([_formData.foto1], this.img1.name, {type: this.img1.type});
        const f2 = new File([_formData.foto2], this.img2.name, {type: this.img2.type});
        const f3 = new File([_formData.foto3], this.img3.name, {type: this.img3.type});
        const f4 = new File([_formData.foto4], this.img4.name, {type: this.img4.type});
        
        const formData: FormData = new FormData();
        formData.append('user', fileJson);
        formData.append('frontDocument', f1);
        formData.append('reverseDocument', f2);
        formData.append('lastPage', f3);
        formData.append('evidence', f4);

        const registerUser = this._agentService.register(formData, this.agentUser.hasher).pipe(
            catchError((errorMessage) => {
                return of(errorMessage);
                })
            ).subscribe( response  => {
                if(response.success) {
                    console.log("Usuario registrado");
                    this.modal.close();
                } else {
                    console.log("No se registro usuario");
                }
            });
            
        this.subscriptions.push(registerUser);
    }


    edit(){
        const _formData = this.formGroup.value;
        const fileJson = new File([JSON.stringify(this.agentUser)] , "user.json", {type: "application/json"});

        const f1 = new File([_formData.foto1], this.img1.name, {type: this.img1.type});
        const f2 = new File([_formData.foto2], this.img2.name, {type: this.img2.type});
        const f3 = new File([_formData.foto3], this.img3.name, {type: this.img3.type});
        const f4 = new File([_formData.foto4], this.img4.name, {type: this.img4.type});
        
        const formData: FormData = new FormData();
        formData.append('user', fileJson);
        formData.append('frontDocument', f1);
        formData.append('reverseDocument', f2);
        formData.append('lastPage', f3);
        formData.append('evidence', f4);

        const updaterUser = this._agentService.updater(formData, this.agentUser.id).pipe(
            catchError((errorMessage) => {
                return of(errorMessage);
                })
            ).subscribe( response  => {
                if(response.success) {
                    console.log("Usuario registrado");
                    this.modal.close();
                } else {
                    console.log("No se registro usuario");
                }
            });
            
        this.subscriptions.push(updaterUser);
    }

    btn1(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
            this.file = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.photoSelected1 =reader.result;
            reader.readAsDataURL(this.file);
            this.img1 = {file: this.file, name: event.target.files[0].name, type: event.target.files[0].type } ;
            this.formGroup.patchValue({
                foto1: this.file
            });
        }
        
    }

    btn2(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
            this.file = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.photoSelected2 = reader.result;
            reader.readAsDataURL(this.file);
            this.img2 = {file: this.file, name: event.target.files[0].name, type: event.target.files[0].type } ;
            this.formGroup.patchValue({
                foto2: this.file
            });
        }
    }

    btn3(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
            this.file = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.photoSelected3=reader.result;
            reader.readAsDataURL(this.file);
            this.img3 = {file: this.file, name: event.target.files[0].name, type: event.target.files[0].type } ;
            this.formGroup.patchValue({
                foto3: this.file
            });
        }
    }

    btn4(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
            this.file = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.photoSelected4 =reader.result;
            reader.readAsDataURL(this.file);
            this.img4 = {file: this.file, name: event.target.files[0].name, type: event.target.files[0].type } ;
            this.formGroup.patchValue({
                foto4: this.file
            });
        }
    }
    
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty && control.touched;
    }

    loadDepartament(){
        const sbDepartament = this.departamentService.getAllDepartament().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_departament) => {
            this.$_departament = _departament.content;
        });
        this.subscriptions.push(sbDepartament);
    }

    loadPronvince(codeprovince){
        const sbProvince = this.provinceService.getAllProvince(codeprovince).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_pronvince) => {
            this.$_province = _pronvince.content;
        });
        this.subscriptions.push(sbProvince);
    }

    loadDistrict(codedistrict){
        const sbDistrict = this.districtService.getAllDistrict(codedistrict).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_district) => {
            this.$_district = _district.content;
        });
        this.subscriptions.push(sbDistrict);
    }



    isDepartmentValid(controlName: string): boolean {
        let control = this.formGroup.controls[controlName];
        if(control.value == "NODATA"){
            return true;
        }else{
            return null;
        }
    }

    isProvinceValid(controlName: string): boolean {
        let control = this.formGroup.controls[controlName];
        if(control.value == ""){
            return true;
        }else{
            return null;
        }
    }

    onOptionsSelectedDepartament(check){
        console.log(check.currentTarget.options[check.currentTarget.options.selectedIndex].id);
        const DepartamentCode=check.currentTarget.options[check.currentTarget.options.selectedIndex].id;
        this.loadPronvince(DepartamentCode);
    }
    onOptionsSelectedProvince(checks){
        console.log(checks.currentTarget.options[checks.currentTarget.options.selectedIndex].id);
        const ProvinceCode=checks.currentTarget.options[checks.currentTarget.options.selectedIndex].id;
        this.loadDistrict(ProvinceCode);
    }
}