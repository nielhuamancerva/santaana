import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of, interval, Subject, Subscription, Observable } from 'rxjs';

import { RolesModel } from '../../_models/Roles.model';
import { TypeDocumentModel } from '../..//_models/TypeDocument.model';
import { InternalUser } from '../../internal-users/models/internal-user.model';
import { DepartamentModel } from '../../_models/Departament.model';
import { ProvinceModel } from '../..//_models/Province.model';
import { DistrictModel } from '../../_models/District.model';
import { CcppModel } from '../../_models/Ccpp.model';
import { UserModel } from '../../_models/user.model';
import { UserHTTPServiceDomain } from '../../_services/user-domain.service';
import { TypePersonModel } from '../../_models/TypePerson.model';
import { TypePersonRepositoryService } from '../../_services-repository/typeperson-repository.service';
import { ProvinceHTTPServiceDomain } from '../../_services/province-domain.service';
import { DepartamentHTTPServiceDomain } from '../../_services/departament-domain.service';
import { DistrictHTTPServiceDomain } from '../../_services/district-domain.service';
import { CcppHTTPServiceDomain } from '../../_services/ccpp-domain.service';
import { TypeDocumentHTTPServiceDomain } from '../../_services/typedocument-domain.service';
import { DepartamentRepositoryService } from '../../_services-repository/departament-repository.service';
import { ProvinceRepositoryService } from '../../_services-repository/province-repository.service';
import { DistrictRepositoryService } from '../../_services-repository/distric-repository.service';
import { CcppRepositoryService } from '../../_services-repository/ccpp-repository.service';
import { Key } from 'protractor';
import { KeyValuePipe } from '@angular/common';
import { MatSelect } from '@angular/material/select';

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

interface Departamento {
    id?:          string;
    code:        string;
    description: string;
    provinces?: Observable<ProvinceModel[]>;
}

@Component({
  selector: 'app-edit-asign-internal-user',
  templateUrl: './edit-asign-internal-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditAsignInternalUserComponent implements OnInit, OnDestroy{
    @ViewChild('select') select: MatSelect;
    formGroup: FormGroup;
    internalUser: InternalUser;
    @Input() id: number;
    private subscriptions: Subscription[] = [];
    $_user:UserModel;
    $_roles: Observable<RolesModel[]>;
    $_typesDocument: Observable<TypeDocumentModel[]>;
    $_departament: Observable<DepartamentModel[]>;
    $_getbydepartament :Observable<DepartamentModel[]>
    $_province: Observable<ProvinceModel[]>;
    $_district: Observable<DistrictModel[]>;
    $_getbyprovince :Observable<ProvinceModel[]>
    $_getbydistrict :Observable<DistrictModel[]>
    $_Ccpp: Observable<CcppModel[]>;
    _typeperson:TypePersonModel[];
    provis: number[] = [13, 14];
    removable: boolean = true;
    constructor(
        private departamentService: DepartamentRepositoryService,
        private userService: UserHTTPServiceDomain,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private typopersonService: TypePersonRepositoryService,
        private provinceDomainService: ProvinceHTTPServiceDomain,
        private departamentDomainService: DepartamentHTTPServiceDomain,
        private districtDomainService: DistrictHTTPServiceDomain,
        private ccpDomainService: CcppHTTPServiceDomain,
        private typeDocumentDomainService: TypeDocumentHTTPServiceDomain,
        private provinceService: ProvinceRepositoryService,
        private districtService: DistrictRepositoryService,
        private ccppService: CcppRepositoryService,
    ) { }

    private utcTimeSubject: Subject<string> = new Subject<string>();
    utcTime$ = this.utcTimeSubject.asObservable();
    private utcSubscription: Subscription;

    ngOnInit(): void {
        this.loadInternalUser();
        this.loadUser();
        this.loadTypeperson()
        this.utcSubscription = interval(1000).subscribe(() => this.getUtcTime());
        this.provinceDomainService.getAll();
        this.departamentDomainService.getAll();
        this.districtDomainService.getAll();
        this.ccpDomainService.getAll();
        this.typeDocumentDomainService.getAll();
        this.loadDepartament();
    }

    get departaments(){
        return this.departamentDomainService.departaments;
    }

    get departamentByCode(){
        return this.departamentDomainService.departametByCode;
    }
    
    get provinces(){
        return this.provinceDomainService.provinces;
    }

    get provincesByDepartament(){
        return this.provinceDomainService.provincesByDepartament;
    }

    get districts(){
        return this.districtDomainService.districts;
    }

    get ccpps(){
        return this.ccpDomainService.ccpps;
    }

    get typeDocuments(){
        return this.typeDocumentDomainService.typeDocuments;
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
            dni: [''],
            fullName: [''],
            email: [this.internalUser.email, Validators.compose([Validators.required])]
        });
    }

    provincesRender = [];
    districtsRender = [];
    ccppsRender = [];

    provinceControl = new FormControl();
    provinceGroups: Departamento[] = [];
    districtGroups: ProvinceModel[] = [];
    ccppsGroups: DistrictModel[] = [];
    
    idsDepartaments: any[] = [];
    idsProvinces: any[] = [];
    idsDistricts: any[] = [];

    save(){
        const formValues = this.formGroup.value;
        this.userService.CreateUser(formValues);
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
        });
        this.subscriptions.push(sbUser);
    }

    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
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

    checkDepartament(event){
        for(let item of event.source.selected){
            var n = this.idsDepartaments.includes(item.id)
            if(!n){
                this.idsDepartaments.push(item.id)
            }
        }
        var provinciasEnviadas = event.value;
        var provincesActual = this.provincesRender;
        var y:any;
        var x:any;
        if( event.source.selected.length > provincesActual.length){
            for (let item of provinciasEnviadas) {
                x = provincesActual.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.provincesRender = provinciasEnviadas;
            this.loadByDepartament(y);
        }else if( event.source.selected.length < provincesActual.length){
            for (let item of provincesActual) {
                x = provinciasEnviadas.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.provincesRender = provinciasEnviadas;
            this.provinceGroups = this.provinceGroups.filter(item => item.code !== y);
        }
    }

    loadByDepartament(CodeDepartament){
        const sbDepartamentby = this.departamentService.getByDepartament(CodeDepartament).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_departamentbycode) => {
            this.$_getbydepartament = _departamentbycode.content;
            this.loadPronvince(CodeDepartament+0);
        });
        this.subscriptions.push(sbDepartamentby);
    }

    loadPronvince(codeprovince){
        const sbProvinceby = this.provinceService.getAllProvince(codeprovince).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_pronvince) => {
            this.$_province = _pronvince.content;
            var departamento: Departamento = {
                id: this.$_getbydepartament[0].id,
                code: this.$_getbydepartament[0].code,
                description: this.$_getbydepartament[0].description,
                provinces: this.$_province
            }
            this.provinceGroups.push(departamento);
        });
        this.subscriptions.push(sbProvinceby);
    }

    checkProvince(event){
        for(let item of event.source.selected){
            var n = this.idsProvinces.includes(item.id)
            if(!n){
                this.idsProvinces.push(item.id)
            }
        }
        var distritosEnviados = event.value;
        var distritosActual = this.districtsRender;
        var y:any;
        var x:any;
        if(event.source.selected.length > distritosActual.length){
            for (let item of distritosEnviados) {
                x = distritosActual.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.districtsRender = distritosEnviados;
            this.loadByProvince(y);
        }else if(event.source.selected.length < distritosActual.length){
            for (let item of distritosActual) {
                x = distritosEnviados.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.districtsRender = distritosEnviados;
            this.districtGroups = this.districtGroups.filter(item => item.code !== y);
        }
    }

    loadByProvince(CodeProvince){
        const sbProvinceby = this.provinceService.getByProvince(CodeProvince).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_getbyprovince = response.content;
            this.loadDistrict(CodeProvince+0);
        });
        this.subscriptions.push(sbProvinceby);
    }

    loadDistrict(codeprovince){
        const sbDistrictby = this.districtService.getAllDistrict(codeprovince).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_district = response.content;
            var province: ProvinceModel = {
                id: this.$_getbyprovince[0].id,
                code: this.$_getbyprovince[0].code,
                description: this.$_getbyprovince[0].description,
                districts: this.$_district
            }
            // var province1: ProvinceModel = {
            //     id: this.$_getbyprovince[0].id,
            //     code: this.$_getbyprovince[0].code,
            //     description: this.$_getbyprovince[0].description
            // }
            // var codeDep = province.code.substring(0,2);
            // var posicionInser: number;
           
            // for (let index = 0; index < this.arrayGeneral.length; index++){
            //     if(this.arrayGeneral[index].code == codeDep){
            //         posicionInser = index;
            //     }
            // }
            // this.arrayGeneral[posicionInser].provinces = province1;
            this.districtGroups.push(province);
        });
        this.subscriptions.push(sbDistrictby);
    }

    checkDistrict(event){
        for(let item of event.source.selected){
            
            var n = this.idsDistricts.includes(item.id)
            if(!n){
                this.idsDistricts.push(item.id)
            }
        }
        var ccppsEnviados = event.value;
        var ccppsActual = this.ccppsRender;
        var y:any;
        var x:any;
        if(event.source.selected.length > ccppsActual.length){
            for (let item of ccppsEnviados) {
                x = ccppsActual.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.ccppsRender = ccppsEnviados;
            this.loadByDistrict(y);
        }else if(event.source.selected.length < ccppsActual.length){
            for (let item of ccppsActual) {
                x = ccppsEnviados.includes(item);
                if (!x) {
                    y = item;
                }
            }
            this.ccppsRender = ccppsEnviados;
            this.ccppsGroups = this.ccppsGroups.filter(item => item.code !== y);
        }
    }

    loadByDistrict(CodeDistrict){
        const sbDistrictby = this.districtService.getByDistrict(CodeDistrict).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_getbydistrict = response.content;
            this.loadCcpp();
        });
        this.subscriptions.push(sbDistrictby);
    }

    loadCcpp(){
        const sbDistrictby = this.ccppService.getAllCcpp().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_Ccpp = response.content;
            var district: ProvinceModel = {
                id: this.$_getbydistrict[0].id,
                code: this.$_getbydistrict[0].code,
                description: this.$_getbydistrict[0].description
            }
            this.ccppsGroups.push(district);
        });
        this.subscriptions.push(sbDistrictby);
    }

    removeDepartament(Departament) {
        var idDep = this.provinceGroups.find(element => element.id == Departament);
        this.idsDepartaments = this.idsDepartaments.filter(item => item !== Departament);
        this.provinceGroups = this.provinceGroups.filter(item => item.id !== Departament);
        const toppings = this.provincesRender as string[];
        this.removeFirst(toppings, idDep.code);
        this.provincesRender = toppings;
    }

    removeProvince(Province) {
        var idProv = this.districtGroups.find(element => element.id == Province);
        this.idsProvinces = this.idsProvinces.filter(item => item !== Province);
        this.districtGroups = this.districtGroups.filter(item => item.id !== Province);
        const toppings = this.districtsRender as string[];
        this.removeFirst(toppings, idProv.code);
        this.districtsRender = toppings;
    }

    removeDistrict(District) {
        console.log(District)
        var idsDist = this.ccppsGroups.find(element => element.id == District);
        this.idsDistricts = this.idsDistricts.filter(item => item !== District);
        this.ccppsGroups = this.ccppsGroups.filter(item => item.id !== District);
        const toppings = this.ccppsRender as string[];
        this.removeFirst(toppings, idsDist.code);
        this.ccppsRender = toppings;
    }

    removeFirst<T>(array: T[], toRemove: T): void {
        const index = array.indexOf(toRemove);
        if (index !== -1) {
          array.splice(index, 1);
        }
    }
}