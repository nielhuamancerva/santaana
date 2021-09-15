import { LocalService } from './../../../_services/local.service';
import { UsersService } from './../../../_services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { catchError, switchMap } from 'rxjs/operators';

import { of, interval, Subject, Subscription, Observable } from 'rxjs';
import { UserModel } from '../../../_models/user.model';
import { RolesModel } from '../../../_models/Roles.model';
import { TypeDocumentModel } from '../../../_models/TypeDocument.model';
import { RoleRepositoryService } from '../../../_services/role-repository.service';
import { TypeDocumentRepositoryService } from '../../../_services/typedocument-repository.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


const EMPTY_INTERNAL_USER: UserModel = {
    id: '',
    roleCode: '',
    typePersonCode: '',
    ubigeeCode: '',
    typeObjectCode: '',
    typeDocumentCode: '',
    documentNumber: '',
    name: '',
    lastName: '',
    phone1: '',
    email: '',
    userName: '',
    hasher: '',
};

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditUserModalComponent implements OnInit, OnDestroy{
    
    @Input() id: UserModel;
    formGroup: FormGroup;
    internalUser: UserModel;
    $_user:UserModel;
    $_roles: Observable<RolesModel[]>;
    $_typesDocument: Observable<TypeDocumentModel[]>;
    private subscriptions: Subscription[] = [];
    
    constructor(public modal: NgbActiveModal,
                private userService: UsersService,
                private rolesService: RoleRepositoryService,
                private typesDocumentService: TypeDocumentRepositoryService,
                private _localService: LocalService,
                private fb: FormBuilder) { }



    ngOnInit(): void {
        this.loadFormWithOutInfo();

    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }


    loadInternalUser() {
        if (!this.id) {
          this.internalUser = EMPTY_INTERNAL_USER;
        } else {
          this.internalUser = this.id;
        }
    }

    loadFormWithOutInfo() {
        this.formGroup = this.fb.group({
            roleCode: ['', Validators.compose([Validators.required])],
            typeDocumentCode: ['', Validators.compose([Validators.required])],
            documentNumber: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            lastName: ['', Validators.compose([Validators.required])],
            phone1: ['', Validators.compose([Validators.required])],
            userName: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required])],
            password: ['', !this.id ? Validators.compose([Validators.required]) : null],
        });

        this.loadUtilities();
    }

    private prepareInternalUser() {
        const formData = this.formGroup.value;
        this.internalUser.roleCode = formData.roleCode;
        this.internalUser.typePersonCode = "NODATA";
        this.internalUser.ubigeeCode = "NODATA";
        this.internalUser.typeObjectCode = "USERINT";
        this.internalUser.typeDocumentCode = formData.typeDocumentCode;
        this.internalUser.documentNumber = formData.documentNumber;
        this.internalUser.name = formData.name;
        this.internalUser.lastName = formData.lastName;
        this.internalUser.phone1 = formData.phone1;
        this.internalUser.email = formData.email;
        this.internalUser.userName = formData.userName;
        this.internalUser.hasher = formData.password;
    }

    sendToServer() {
        this.prepareInternalUser();
        if (!this.id) {
            this.save();
          } else {
            this.edit();
          }
    }

    save() {
        const formData: FormData = new FormData();
        const fileJson = new File([JSON.stringify(this.internalUser)] , "user.json", {type: "application/json"});
        
        formData.append('user', fileJson);


        const httpResult$ = this._localService.getFileFromPath('/assets/media/users/default.jpg').pipe(
            switchMap(sourceValue => {
                const file = new File([sourceValue], 'default.jpg', {type:"application/jpg"});

                formData.append('frontDocument', file);
                formData.append('reverseDocument', file);
                formData.append('lastPage', file);
                formData.append('evidence', file);

                return this.userService.register(formData, this.internalUser.hasher).pipe(
                catchError((errorMessage) => {
                    return of(errorMessage);
                    })
                )
                }
             )
        );


        const registerUser = httpResult$.subscribe( response  => {
            if(response.success) {
                console.log("Usuario registrado");
                this.modal.close();
            } else {
                console.log("No se registro usuario");
            }
        });
        
        
        this.subscriptions.push(registerUser);
    }

    edit() {
        const formData: FormData = new FormData();
        const fileJson = new File([JSON.stringify(this.internalUser)] , "user.json", {type: "application/json"});
        
        formData.append('user', fileJson);


        const httpResult$ = this._localService.getFileFromPath('/assets/media/users/default.jpg').pipe(
            switchMap(sourceValue => {
                const file = new File([sourceValue], 'default.jpg', {type:"application/jpg"});

                formData.append('frontDocument', file);
                formData.append('reverseDocument', file);
                formData.append('lastPage', file);
                formData.append('evidence', file);

                return this.userService.updater(formData, this.internalUser.id).pipe(
                catchError((errorMessage) => {
                    return of(errorMessage);
                    })
                )
                }
             )
        );


        const updaterUser = httpResult$.subscribe( response  => {
            if(response.success) {
                console.log("Usuario registrado");
                this.modal.close();
            } else {
                console.log("No se registro usuario");
            }
        });
        
        
        this.subscriptions.push(updaterUser);
    }


    loadUtilities() {

        this.$_roles = this.rolesService.getAllRoles(0,100,"USERINT");
        this.$_typesDocument = this.typesDocumentService.getAllTypedocument();

   
        this.loadInternalUser();

        if (this.id) {

            this.formGroup.get('roleCode').patchValue(this.internalUser.role.code);
            this.formGroup.get('typeDocumentCode').patchValue(this.internalUser.typeDocument.code);
            this.formGroup.get('documentNumber').patchValue(this.internalUser.documentNumber);
            this.formGroup.get('name').patchValue(this.internalUser.name);
            this.formGroup.get('lastName').patchValue(this.internalUser.lastName);
            this.formGroup.get('phone1').patchValue(this.internalUser.phone1);
            this.formGroup.get('userName').patchValue(this.internalUser.userName);
            this.formGroup.get('email').patchValue(this.internalUser.email);
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
        return control.dirty || control.touched;
    }
    
    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }
}