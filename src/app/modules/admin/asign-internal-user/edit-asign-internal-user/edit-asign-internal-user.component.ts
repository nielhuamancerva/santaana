import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { catchError, finalize, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { of, interval, Subject, Subscription, Observable } from 'rxjs';
import { InternalUser } from '../../internal-users/models/internal-user.model';
import { DepartamentModel } from '../../_models/Departament.model';
import { ProvinceModel } from '../..//_models/Province.model';
import { DistrictModel } from '../../_models/District.model';
import { CcppModel } from '../../_models/Ccpp.model';
import { ProvinceHTTPServiceDomain } from '../../_services/province-domain.service';
import { DepartamentHTTPServiceDomain } from '../../_services/departament-domain.service';
import { DistrictHTTPServiceDomain } from '../../_services/district-domain.service';
import { CcppHTTPServiceDomain } from '../../_services/ccpp-domain.service';
import { DepartamentRepositoryService } from '../../_services-repository/departament-repository.service';
import { ProvinceRepositoryService } from '../../_services-repository/province-repository.service';
import { DistrictRepositoryService } from '../../_services-repository/distric-repository.service';
import { CcppRepositoryService } from '../../_services-repository/ccpp-repository.service';
import { MatOption } from '@angular/material/core';
import { UserRepositoryService } from '../../_services-repository/user-repository.service';
import { UserAsignHTTPServiceDomain } from '../../_services/asign-domain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAsingModel } from '../../_models/UserAsign.model';
import * as moment from 'moment'

const EMPTY_ASIGN_INTERNAL_USER: UserAsingModel<DepartamentModel> ={
    id: undefined,
    roleCode: '',
    roleDescription: '',
    typePersonCode: '',
    typePersonDescription: '',
    typeDocumentCode: '',
    typeDocumentDescription: '',
    districtCode: '',
    populatedCenterCode: '',
    documentNumber: 0,
    name: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    phone1: 0,
    phone2: 0,
    referentialAddress: '',
    latitude: '',
    longitude: '',
    frontDocument: '',
    reverseDocument: '',
    lastPage: '',
    evidence: '',
    userName: '',
    email: '',
    enable: true,
    data: []
};

@Component({
    selector: 'app-edit-asign-internal-user',
    templateUrl: './edit-asign-internal-user.component.html',
    styleUrls: ['./edit-asign-internal-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditAsignInternalUserComponent implements OnInit, OnDestroy{
    @ViewChild('MatDepartamento') MatDepartamento: MatSelect;
    @ViewChild('MatProvincia') MatProvincia: MatSelect;
    @ViewChild('MatDistrito') MatDistrito: MatSelect;
    isLoading:boolean;
    formGroup: FormGroup;
    _user_dni:string;
    id: string;
    private subscriptions: Subscription[] = [];
    public SearchDni: number;
    $_departament: Observable<DepartamentModel[]>;
    $_getbydepartament : Observable<DepartamentModel[]>;
    appleStreamMapped$ :Observable<DepartamentModel[]>;
    $_province: ProvinceModel[];
    $_district: DistrictModel[];
    $_getbyprovince :Observable<ProvinceModel[]>
    $_getbydistrict :Observable<DistrictModel[]>
    $_Ccpp: Observable<CcppModel[]>;
    removable: boolean = true;
    errorMessage = '';
    public isLoadingSearchDni=false;
    previous: DepartamentModel;
    ubigeo: UserAsingModel<DepartamentModel>;
    fecha_actual: String;
    selectedDepartaments = [];
    selectedProvinces = [];
    selectedDistricts = [];
    departamentosObs: Observable<any>;
    //es el actual selected del <select> de (departament.code)
    departActual = [];
    proviActual = [];
    distriActual = [];

    departamentos: DepartamentModel[] = [];
    provincias: ProvinceModel[] = [];
    distritos: DistrictModel[] = [];

    arrayGeneral: DepartamentModel[] = [];

    constructor(
        private departamentService: DepartamentRepositoryService,
        private userService: UserRepositoryService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private provinceDomainService: ProvinceHTTPServiceDomain,
        public departamentDomainService: DepartamentHTTPServiceDomain,
        private districtDomainService: DistrictHTTPServiceDomain,
        private ccpDomainService: CcppHTTPServiceDomain,
        private provinceService: ProvinceRepositoryService,
        private districtService: DistrictRepositoryService,
        private ccppService: CcppRepositoryService,
        private asignUserService:UserAsignHTTPServiceDomain,
        private route: ActivatedRoute,
        private router: Router,
        public UserAsignServiceDomain: UserAsignHTTPServiceDomain,
    ) { }

    ngOnInit(): void {
        this.UserAsignServiceDomain.fetch();
        this.fecha_actual = moment(new Date()).format('YYYY-MM-DD');
        this.departamentDomainService.getAll();
        this.provinceDomainService.getAll();
        this.districtDomainService.getAll();
        this.ccpDomainService.getAll();
        this.loadInternalUser();
        const sb = this.UserAsignServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.loadApiDepartamentos();
    }

    ngOnDestroy() {
    }

    

    loadInternalUser() {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                this.id = params.get('id');
                if (this.id) {
                    return this.asignUserService.getItemById(this.id);
                }
                this.ubigeo = EMPTY_ASIGN_INTERNAL_USER;
                return of(EMPTY_ASIGN_INTERNAL_USER);
            }),
            catchError((errorMessage) => {
                this.errorMessage = errorMessage;
                return of(undefined);
            }),
        ).subscribe((res) => {
            if(res.data.id){
                this.arrayGeneral = res.data.data;
                
                this.ubigeo = res.data;
                
                for(let dep of res.data.data){
                    this.selectedDepartaments.push(dep);
                    this.searchDepartament(dep.code);
                    this.departActual.push(dep.code);

                    for(let prov of dep.provinces){
                        this.selectedProvinces.push(prov);
                        this.searchProvince(prov.code);
                        this.proviActual.push(prov.code);

                        for(let distri of prov.districts){
                            this.selectedDistricts.push(distri)
                            this.searchDistrict(distri.code);
                            this.distriActual.push(prov.code);
                        }
                    }
                }
                this.isLoading=true;
            }
            this.previous = Object.assign({}, res);
            this.loadForm();
        });
        this.subscriptions.push(sb);
        
    }

    loadForm() {
        this.formGroup = this.fb.group({
            dni: [this.ubigeo.documentNumber],
            fullName: [this.ubigeo.name],
            email: [this.ubigeo.email, Validators.compose([Validators.required])]
        });
        this.formDniChange()
    }

    formDniChange(){
        this.formGroup.get("dni").valueChanges.subscribe(selectedValue => {
            this.isLoadingSearchDni=true;
            if(selectedValue == ''){
                this.isLoadingSearchDni=false;
            }else{
                this.userService.getByDocumentUser(selectedValue).pipe(
                    catchError((errorMessage) => {
                        return of(errorMessage);
                    })
                ).subscribe((response) => {
                        this.SearchDni = response.content;
                });
            }
        })
    }

    save(){
        var x= "royer";
        this.asignUserService.postEditAsingUser(x,this.arrayGeneral);
    }

    ApiDepartamentos: Observable<DepartamentModel[]>;
    loadApiDepartamentos(){
        this.ApiDepartamentos = this.departamentDomainService.getAll();
    }
 
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
        const sbDepartamentby = this.departamentService.getByDepartament(CodeDepartament)
        .pipe(
            catchError((errorMessage) => {
                return of(errorMessage);
            })
        ).subscribe((response) => {
            console.log(CodeDepartament);
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
                id: departamento.id,
                code: departamento.code,
                description: departamento.description,
                provinces: []
            }
            console.log(this.departamentos.length);
            console.log(departamento);
            if(this.departamentos.findIndex(x => x.code == departamento.code) === -1){
                console.log("agregando al array")
                
                this.departamentos.push(departamento);
            };
            if(this.arrayGeneral.findIndex(x => x.code == departamento1.code) === -1){
                this.arrayGeneral.push(departamento1)
            };
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
            var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
            if(this.arrayGeneral[indexDep].provinces.findIndex(x => x.code == province.code) === -1){
                this.arrayGeneral[indexDep].provinces.push(province1);
            }
            if(this.provincias.findIndex(x => x.code == province.code) === -1){
                this.provincias.push(province);
            };
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
            var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
            var indexProv = this.arrayGeneral[indexDep].provinces.findIndex(x => x.code == codeProv);

            if(this.arrayGeneral[indexDep].provinces[indexProv].districts.findIndex(x => x.code == district.code) === -1){
                this.arrayGeneral[indexDep].provinces[indexProv].districts.push(district1);
            }
            if(this.distritos.findIndex(x => x.code == district.code) === -1){
                this.distritos.push(district);
            };
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
        var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
        this.provincias = this.provincias.filter(item => item.code !== Province);
        this.distritos = this.distritos.filter(item => item.code.substring(0,4) !== Province);
        this.distriActual = this.distriActual.filter(item => item.substring(0,4) !== Province);
        this.arrayGeneral[indexDep].provinces = this.arrayGeneral[indexDep].provinces.filter(item => item.code !== Province);
        this.MatProvincia.options.forEach((data: MatOption) => {if(data.value == Province){data.deselect()}});
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,4)==Province){data.deselect()}});
    }

    removeDistrict(District) {
        var codeDep = District.substring(0,2);
        var codeProv = District.substring(0,4);
        var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
        var indexProv = this.arrayGeneral[indexDep].provinces.findIndex(x => x.code == codeProv);
        this.distritos = this.distritos.filter(item => item.code !== District);
        this.arrayGeneral[indexDep].provinces[indexProv].districts = this.arrayGeneral[indexDep].provinces[indexProv].districts.filter(item => item.code !== District);
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value == District){data.deselect()}});
    }

    selectBeneficiary(item){
        this._user_dni=item.id;
        this.formGroup.patchValue({
            fullName: item.name+item.secondName+item.lastName+item.secondLastName,
            dni: item.documentNumber
        });
        this.isLoadingSearchDni=false;
    }

    comparer(o1: any, o2: any): boolean {
        return o1 && o2 ? o1 == o2.code : o2 === o2;
    }

    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
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
}