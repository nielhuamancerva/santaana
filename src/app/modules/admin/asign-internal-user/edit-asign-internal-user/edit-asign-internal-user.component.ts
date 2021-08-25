import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { catchError } from 'rxjs/operators';

import { RoleRepositoryService } from '../../_services-repository/role-repository.service';
import { TypeDocumentRepositoryService } from '../../_services-repository/typedocument-repository.service';
import { of, interval, Subject, Subscription, Observable } from 'rxjs';
import { RolesModel } from '../../_models/Roles.model';
import { TypeDocumentModel } from '../..//_models/TypeDocument.model';
import { InternalUser } from '../../internal-users/models/internal-user.model';
import { DepartamentRepositoryService } from '../../_services-repository/departament-repository.service';
import { DepartamentModel } from '../../_models/Departament.model';
import { ProvinceModel } from '../..//_models/Province.model';
import { ProvinceRepositoryService } from '../../_services-repository/province-repository.service';
import { DistrictModel } from '../../_models/District.model';
import { DistrictRepositoryService } from '../../_services-repository/distric-repository.service';
import { CcppModel } from '../../_models/Ccpp.model';
import { CcppRepositoryService } from '../../_services-repository/ccpp-repository.service';
import { UserModel } from '../../_models/user.model';
import { UserHTTPServiceDomain } from '../../_services/user-domain.service';
import { TypePersonModel } from '../../_models/TypePerson.model';
import { TypePersonRepositoryService } from '../../_services-repository/typeperson-repository.service';

const EMPTY_INTERNAL_USER: InternalUser ={
    id: undefined,
    name: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    documentType: '',
    documentNumber: '',
    roleCode: '',
    userName: '',
    password: '',
    department: '',
    province: '',
    district: '',
    ccpp: '',
    email: '',
    typePersonCode: '',
    phone1:''
};

@Component({
  selector: 'app-edit-asign-internal-user',
  templateUrl: './edit-asign-internal-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditAsignInternalUserComponent implements OnInit, OnDestroy{
    formGroup: FormGroup;
    internalUser: InternalUser;
    @Input() id: number;
    private subscriptions: Subscription[] = [];
    $_user:UserModel;
    $_roles: Observable<RolesModel[]>;
    $_typesDocument: Observable<TypeDocumentModel[]>;
    $_departament: Observable<DepartamentModel[]>;
    $_province: Observable<ProvinceModel[]>;
    $_district: Observable<DistrictModel[]>;
    $_Ccpp: Observable<CcppModel[]>;
    _typeperson:TypePersonModel[];
    constructor(
        private userService: UserHTTPServiceDomain,
        private rolesService: RoleRepositoryService,
        private typesDocumentService: TypeDocumentRepositoryService,
        private departamentService: DepartamentRepositoryService,
        private provinceService: ProvinceRepositoryService,
        private districtService: DistrictRepositoryService,
        private CcppService: CcppRepositoryService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private typopersonService: TypePersonRepositoryService,
    ) { }

    private utcTimeSubject: Subject<string> = new Subject<string>();
    utcTime$ = this.utcTimeSubject.asObservable();
    private utcSubscription: Subscription;

    ngOnInit(): void {
        this.loadInternalUser();
        this.loadRoles();
        this.loadTypeDocuments();
        this.loadDepartament();
       // this.loadPronvince();
      //  this.loadDistrict();
        this.loadCcpp();
        this.loadUser();
        this.loadTypeperson()
        this.utcSubscription = interval(1000).subscribe(() => this.getUtcTime());
    }

    ngOnDestroy() {
       this.utcSubscription.unsubscribe();
       this.utcTimeSubject.complete();
    }

    getUtcTime() {
        const time = new Date().toISOString().slice(11, 19);
       this.utcTimeSubject.next(time);
    }

    loadInternalUser() {
        if (!this.id) {
          this.internalUser = EMPTY_INTERNAL_USER;
          this.loadForm();
        }  
    }

    loadForm() {
        this.formGroup = this.fb.group({
            roleCode: [this.internalUser.roleCode, Validators.compose([Validators.required])],
            roleDescription: [null, Validators.compose([Validators.required])],
            typePersonCode: ['', Validators.compose([Validators.required])],
            typePersonDescription: [null, Validators.compose([Validators.required])],
            typeDocumentCode: ['', Validators.compose([Validators.required])],
            typeDocumentDescription: [null, Validators.compose([Validators.required])],
            districtCode: ['', Validators.compose([Validators.required])],
            populatedCenterCode: ['NODATA', Validators.compose([Validators.required])],
            documentNumber: [this.internalUser.documentNumber, Validators.compose([Validators.required])],
            name: [this.internalUser.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            secondName: [this.internalUser.secondName, Validators.compose([Validators.required])],
            lastName: [this.internalUser.lastName, Validators.compose([Validators.required])],
            secondLastName: [this.internalUser.secondLastName, Validators.compose([Validators.required])],
            phone1: [this.internalUser.phone1, Validators.compose([Validators.required])],
            phone2: [null, Validators.compose([Validators.required])],
            referentialAddress: [null, Validators.compose([Validators.required])],
            frontDocument: [null, Validators.compose([Validators.required])],
            reverseDocument: [null, Validators.compose([Validators.required])],
            lastPage: [null, Validators.compose([Validators.required])],
            evidence: [null, Validators.compose([Validators.required])],
            userName: [this.internalUser.userName, Validators.compose([Validators.required])],
            email: [this.internalUser.email, Validators.compose([Validators.required])],
            enabled: [true, Validators.compose([Validators.required])],
            password: [this.internalUser.password, Validators.compose([Validators.required])],
            department: ['NODATA', Validators.compose([Validators.required])],
            province: [this.internalUser.province, Validators.compose([Validators.required])],
            dni: [''],
            fullName: [''],

        });
    }

    save(){
        const formValues = this.formGroup.value;
        this.userService.CreateUser(formValues);
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

   // loadPronvince(){
  //      const sbProvince = this.provinceService.getAllProvince().pipe(
   //         catchError((errorMessage) => {
   //         return of(errorMessage);
   //         })
   //     ).subscribe((_pronvince) => {
    //        this.$_province = _pronvince.content;
    //    });
    //    this.subscriptions.push(sbProvince);
   // }

  //  loadDistrict(){
  //      const sbDistrict = this.districtService.getAllDistrict().pipe(
   //         catchError((errorMessage) => {
  //          return of(errorMessage);
  //          })
  //      ).subscribe((_district) => {
   //         this.$_district = _district.content;
   //     });
   //     this.subscriptions.push(sbDistrict);
  //  }

    loadCcpp(){
        const sbCcpp = this.CcppService.getAllCcpp().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_sbCcpp) => {
            this.$_Ccpp= _sbCcpp.content;
        });
        this.subscriptions.push(sbCcpp);
    }

    loadTypeperson() {
        const sbTypeperson = this.typopersonService.getAllTypeperson().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_typeperson) => {
            this._typeperson = _typeperson.content;
        });
        this.subscriptions.push(sbTypeperson);
    }

    loadTypeDocuments(){
        const sbTypedocument = this.typesDocumentService.getAllTypedocument().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_typedocument) => {
            this.$_typesDocument = _typedocument.content;
           // console.log(this.$_typesDocument)
        });
        this.subscriptions.push(sbTypedocument);
    }

    loadRoles() {
        const sbRole = this.rolesService.getAllRoles().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_roles) => {
            this.$_roles = _roles.content;
        });
        this.subscriptions.push(sbRole);
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
    
    loadUser(){
        const sbUser = this.userService.getAllUser().pipe(
           catchError((errorMessage) => {
          return of(errorMessage);
           })
       ).subscribe((_user) => {
          this.$_user = _user;
          console.log(this.$_user);
       });
        this.subscriptions.push(sbUser);
    }

    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }
}