import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
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
import { MatOption } from '@angular/material/core';

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
    @ViewChild('MatDepartamento') MatDepartamento: MatSelect;
    @ViewChild('MatProvincia') MatProvincia: MatSelect;
    @ViewChild('MatDistrito') MatDistrito: MatSelect;
    formGroup: FormGroup;
    internalUser: InternalUser;
    @Input() id: number;
    private subscriptions: Subscription[] = [];
    $_user:UserModel;
    $_roles: Observable<RolesModel[]>;
    $_typesDocument: Observable<TypeDocumentModel[]>;
    $_departament: Observable<DepartamentModel[]>;
    $_getbydepartament :Observable<DepartamentModel[]>
    $_province: ProvinceModel[];
    $_district: DistrictModel[];
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

    //es el actual selected del <select> de (departament.code)
    departActual = [];
    proviActual = [];
    distriActual = [];

    departamentos: DepartamentModel[] = [];
    provincias: ProvinceModel[] = [];
    distritos: DistrictModel[] = [];
    
    idsDepartaments: any[] = [];
    idsProvinces: any[] = [];
    idsDistricts: any[] = [];

    arrayGeneral: DepartamentModel[] = [];

    checkDepartament(event){
        var departamentosEnviados = event.value;
        var CodeDepartament: any;
        var existencia: boolean;
        if( event.source.selected.length > this.departActual.length){
            for (let item of departamentosEnviados) {
                existencia = this.departActual.includes(item);
                if (!existencia) {
                    CodeDepartament = item;
                }
            }
            this.departActual = departamentosEnviados;
            this.searchDepartament(CodeDepartament);
        }else if( event.source.selected.length < this.departActual.length){
            for (let item of this.departActual) {
                existencia = departamentosEnviados.includes(item);
                if (!existencia) {
                    CodeDepartament = item;
                }
            }
            this.departActual = departamentosEnviados;
            this.removeDepartament(CodeDepartament);
        }
    }

    searchDepartament(CodeDepartament){
        const sbDepartamentby = this.departamentService.getByDepartament(CodeDepartament).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_getbydepartament = response.content;
            this.getProvincesByDepartament(CodeDepartament);
        });
        this.subscriptions.push(sbDepartamentby);
    }

    getProvincesByDepartament(CodeDepartament){
        const sbProvinceby = this.provinceService.getAllProvince(CodeDepartament+0).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_pronvince) => {
            this.$_province = _pronvince.content;
            var departamento: DepartamentModel = {
                id: this.$_getbydepartament[0].id,
                code: this.$_getbydepartament[0].code,
                description: this.$_getbydepartament[0].description,
                provinces: this.$_province
            }
            var departamento1: DepartamentModel = {
                id: this.$_getbydepartament[0].id,
                code: this.$_getbydepartament[0].code,
                description: this.$_getbydepartament[0].description,
                provinces: []
            }
            this.departamentos.push(departamento);
            this.arrayGeneral.push(departamento1);
        });
        this.subscriptions.push(sbProvinceby);
    }

    checkProvince(event){
        var provinciasEnviados = event.value;
        var CodeProvince: any;
        var existencia: boolean;
        if( event.source.selected.length > this.proviActual.length){
            for (let item of provinciasEnviados) {
                existencia = this.proviActual.includes(item);
                if (!existencia) {
                    CodeProvince = item;
                }
            }
            this.proviActual = provinciasEnviados;
            this.searchProvince(CodeProvince);
        }else if( event.source.selected.length < this.proviActual.length){
            for (let item of this.proviActual) {
                existencia = provinciasEnviados.includes(item);
                if (!existencia) {
                    CodeProvince = item;
                }
            }
            this.proviActual = provinciasEnviados;
            this.removeProvince(CodeProvince);
            // var codeDep = CodeProvince.substring(0,2);
            // var posicionInser: number;
           
            // for (let index = 0; index < this.arrayGeneral.length; index++){
            //     if(this.arrayGeneral[index].code == codeDep){
            //         posicionInser = index;
            //     }
            // }
            // this.provincias = this.provincias.filter(item => item.code !== CodeProvince);
            // this.distritos = this.distritos.filter(item => item.code.substring(0,4) !== CodeProvince);
            // this.distriActual = this.distriActual.filter(item => item.substring(0,4) !== CodeProvince);
            // this.arrayGeneral[posicionInser].provinces = this.arrayGeneral[posicionInser].provinces.filter(item => item.code !== CodeProvince);
            // this.MatProvincia.options.forEach((data: MatOption) => {if(data.value == CodeProvince){data.deselect()}});
            // this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,4)==CodeProvince){data.deselect()}});
        }
    }

    searchProvince(CodeProvince){
        const sbProvinceby = this.provinceService.getByProvince(CodeProvince).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_getbyprovince = response.content;
            this.getDistrictsByProvince(CodeProvince);
        });
        this.subscriptions.push(sbProvinceby);
    }

    getDistrictsByProvince(codeprovince){
        const sbDistrictby = this.districtService.getAllDistrict(codeprovince+0).pipe(
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
            var province1: ProvinceModel = {
                id: this.$_getbyprovince[0].id,
                code: this.$_getbyprovince[0].code,
                description: this.$_getbyprovince[0].description,
                districts: []
            }
            var codeDep = province.code.substring(0,2);
            var posicionInser: number;
           
            for (let index = 0; index < this.arrayGeneral.length; index++){
                if(this.arrayGeneral[index].code == codeDep){
                    posicionInser = index;
                }
            }
            this.arrayGeneral[posicionInser].provinces.push(province1);
            this.provincias.push(province);
        });
        this.subscriptions.push(sbDistrictby);
    }

    checkDistrict(event){
        var distritosEnviados = event.value;
        var CodeDistrict: any;
        var existencia: boolean;
        if( event.source.selected.length > this.distriActual.length){
            for (let item of distritosEnviados) {
                existencia = this.distriActual.includes(item);
                if (!existencia) {
                    CodeDistrict = item;
                }
            }
            this.distriActual = distritosEnviados;
            this.searchDistrict(CodeDistrict);
        }else if( event.source.selected.length < this.distriActual.length){
            for (let item of this.distriActual) {
                existencia = distritosEnviados.includes(item);
                if (!existencia) {
                    CodeDistrict = item;
                }
            }
            this.distriActual = distritosEnviados;
            this.removeDistrict(CodeDistrict);
            console.log(this.arrayGeneral)
            // var codeDep = CodeDistrict.substring(0,2);
            // var codeProv = CodeDistrict.substring(0,4);
            // var indexDep: number;
            // var indexProv: number;
           
            // for (let index = 0; index < this.arrayGeneral.length; index++){
            //     if(this.arrayGeneral[index].code == codeDep){
            //         indexDep = index;
            //     }
            // }
            // for(let index = 0; index < this.arrayGeneral[indexDep].provinces.length; index++){
            //     if(this.arrayGeneral[indexDep].provinces[index].code == codeProv){
            //         indexProv = index;
            //     }
            // }
            
            // this.distritos = this.distritos.filter(item => item.code !== CodeDistrict);
            // this.arrayGeneral[indexDep].provinces[indexProv].districts = this.arrayGeneral[indexDep].provinces[indexProv].districts.filter(item => item.code !== CodeDistrict);
            // this.MatDistrito.options.forEach((data: MatOption) => {if(data.value == CodeDistrict){data.deselect()}});
        }
    }

    searchDistrict(CodeDistrict){
        const sbDistrictby = this.districtService.getByDistrict(CodeDistrict).pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((response) => {
            this.$_getbydistrict = response.content;
            this.getCcppByDistrict();
        });
        this.subscriptions.push(sbDistrictby);
    }

    getCcppByDistrict(){
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
            var district1: ProvinceModel = {
                id: this.$_getbydistrict[0].id,
                code: this.$_getbydistrict[0].code,
                description: this.$_getbydistrict[0].description
            }
            var codeDep = district.code.substring(0,2);
            var codeProv = district.code.substring(0,4);
            var posicionDep: number;
            var posicionProv: number;
           
            for (let index = 0; index < this.arrayGeneral.length; index++){
                if(this.arrayGeneral[index].code == codeDep){
                    posicionDep = index;
                }
            }
            for(let index = 0; index < this.arrayGeneral[posicionDep].provinces.length; index++){
                if(this.arrayGeneral[posicionDep].provinces[index].code == codeProv){
                    posicionProv = index;
                }
            }
            this.arrayGeneral[posicionDep].provinces[posicionProv].districts.push(district1);
            this.distritos.push(district);
        });
        this.subscriptions.push(sbDistrictby);
    }

    removeDepartament(Departament) {
        this.departamentos = this.departamentos.filter(item => item.code !== Departament);
        this.provincias = this.provincias.filter(item => item.code.substring(0,2) !== Departament);
        this.arrayGeneral = this.arrayGeneral.filter(item => item.code !== Departament);
        this.MatDepartamento.options.forEach((data: MatOption) => {if(data.value == Departament){data.deselect()}});
        this.MatProvincia.options.forEach((data: MatOption) => {if(data.value.substring(0,2)==Departament){data.deselect()}});
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,2)==Departament){data.deselect()}});
    }

    removeProvince(Province) {
        var codeDep = Province.substring(0,2);
        var posicionInser: number;
        
        for (let index = 0; index < this.arrayGeneral.length; index++){
            if(this.arrayGeneral[index].code == codeDep){
                posicionInser = index;
            }
        }
        this.provincias = this.provincias.filter(item => item.code !== Province);
        this.distritos = this.distritos.filter(item => item.code.substring(0,4) !== Province);
        this.distriActual = this.distriActual.filter(item => item.substring(0,4) !== Province);
        this.arrayGeneral[posicionInser].provinces = this.arrayGeneral[posicionInser].provinces.filter(item => item.code !== Province);
        this.MatProvincia.options.forEach((data: MatOption) => {if(data.value == Province){data.deselect()}});
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,4)==Province){data.deselect()}});
    }

    removeDistrict(District) {
        var codeDep = District.substring(0,2);
        var codeProv = District.substring(0,4);
        var indexDep: number;
        var indexProv: number;
        
        for (let index = 0; index < this.arrayGeneral.length; index++){
            if(this.arrayGeneral[index].code == codeDep){
                indexDep = index;
            }
        }
        for(let index = 0; index < this.arrayGeneral[indexDep].provinces.length; index++){
            if(this.arrayGeneral[indexDep].provinces[index].code == codeProv){
                indexProv = index;
            }
        }
        this.distritos = this.distritos.filter(item => item.code !== District);
        this.arrayGeneral[indexDep].provinces[indexProv].districts = this.arrayGeneral[indexDep].provinces[indexProv].districts.filter(item => item.code !== District);
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value == District){data.deselect()}});
    }
}