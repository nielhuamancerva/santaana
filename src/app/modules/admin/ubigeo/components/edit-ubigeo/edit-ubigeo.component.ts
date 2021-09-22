import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { of, interval, Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { DepartamentModel } from '../../../_models/Departament.model';
import { ProvinceModel } from '../../../_models/Province.model';
import { DistrictModel } from '../../../_models/District.model';
import { CcppModel } from '../../../_models/Ccpp.model';
import { UserAsingModel } from '../../../_models/UserAsign.model';
import { DepartamentRepositoryService } from '../../../_services/departament-repository.service';
import { ProvinceRepositoryService } from '../../../_services/province-repository.service';
import { DistrictRepositoryService } from '../../../_services/distric-repository.service';
import { UserDomainService } from '../../../_domain/user-domain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { UsersService } from '../../../_services/users.service';
import { DepartamentDomainService } from '../../../_domain/departament-domain.service';
import { UbigeoHTTPServiceDomain } from '../../../_domain/ubigeo-domain.service';
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
    selector: 'app-ubigeo',
    templateUrl: './edit-ubigeo.component.html',
    styleUrls: ['./edit-ubigeo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditUbigeoComponent implements OnInit, OnDestroy{
    @ViewChild('MatDepartamento') MatDepartamento: MatSelect;
    @ViewChild('MatProvincia') MatProvincia: MatSelect;
    @ViewChild('MatDistrito') MatDistrito: MatSelect;
    formGroup: FormGroup;
    _user_dni:string;
    id: string;
    private subscriptions: Subscription[] = [];
    public SearchDni: number;
    $_getbydistrict :Observable<DistrictModel[]>
    $_Ccpp: Observable<CcppModel[]>;
    removable: boolean = true;
    errorMessage = '';
    public isLoadingSearchDni=false;
    previous: DepartamentModel;
    ubigeo: UserAsingModel<DepartamentModel>;
    selectedDepartaments: DepartamentModel[]=[];
    selectedProvinces : ProvinceModel[]=[];
    selectedDistricts : DistrictModel[]=[];
    prueba: boolean = true;
    public _UbigeoGeneral$ = new BehaviorSubject<DepartamentModel[]>([]);
    public _visor$ = new BehaviorSubject<DepartamentModel[]>([]);
    public _visorproviActual$= new BehaviorSubject<ProvinceModel[]>([]);
    public ApiDepartamentos= new BehaviorSubject<DepartamentModel[]>([]);
    public arrMaster2 = new BehaviorSubject<DepartamentModel[]>([]);
    public _isApiLoading$ = new BehaviorSubject<boolean>(false);
    constructor(
        private departamentService: DepartamentRepositoryService,
        private userService: UsersService,
        public departamentDomainService: DepartamentDomainService,
        private provinceService: ProvinceRepositoryService,
        private districtService: DistrictRepositoryService,
        private route: ActivatedRoute,
        private ubigeoService: UbigeoHTTPServiceDomain,
        private fb: FormBuilder,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.loadApiDepartamentos();
        this.ubigeo = EMPTY_ASIGN_INTERNAL_USER;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    comparerDep(o1: any, o2: any): boolean {
        return o1 && o2 ? o1 == o2.code : o1.code == o2.code;
    }

    comparerProv(o1: any, o2: any): boolean {
        return o1 && o2 ? o1 === o2 : o1.code == o2.code;
    }

    comparerDist(o1: any, o2: any): boolean {
        return (o1 && o2) ? o1 === o2 : false;
    }

    loadApiDepartamentos(){
        this.ApiDepartamentos.asObservable();
        this.departamentDomainService.getAll2().subscribe(respo => this.ApiDepartamentos.next(respo.content));
        this.departamentDomainService.getAll2().subscribe(respo => {
            this.arrMaster = respo.content;
            this.loadInternalUser();
        });
    }

    loadInternalUser() {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                this.id = params.get('id');
                if (this.id) {
                    return this.ubigeoService.getItemById(this.id);
                }
                this.ubigeo = EMPTY_ASIGN_INTERNAL_USER;
                return of(EMPTY_ASIGN_INTERNAL_USER);
            }),
            switchMap((res) =>{
                console.log(res.data)
                this.arrayGeneral = res.data.information;
                this.arrMaster2.asObservable();
                this.arrMaster2.next(this.arrayGeneral);
                
                this.ubigeo = res.data;

                for(let dep of res.data.information){
                    this.selectedDepartaments.push(dep);
                    this.searchDepartament(dep.code);
                    this.departActual.push(dep.code);

                    for(let prov of dep.provinces){
                        if(prov.code){
                            this.selectedProvinces.push(prov.code);
                            this.searchProvince(prov.code);
                            this.proviActual.push(prov.code);

                            for(let distri of prov.districts){
                                this.selectedDistricts.push(distri.code)
                                this.searchDistrict(distri.code);
                                this.distriActual.push(distri.code);
                            }
                        }
                        
                    }
                    
                }
                this.previous = Object.assign({}, res);
                
                return of(EMPTY_ASIGN_INTERNAL_USER);
            }),
            catchError((errorMessage) => {
                this.errorMessage = errorMessage;
                return of(undefined);
            }),
        ).subscribe((res) => {
            this.loadForm();
            this._isApiLoading$.asObservable();
            this._isApiLoading$.next(true);
        });
        this.subscriptions.push(sb);
        
    }

    loadForm() {
        this.formGroup = this.fb.group({
            dni: [this.ubigeo.documentNumber, Validators.compose([Validators.required])],
            fullName: [this.ubigeo.name, Validators.compose([Validators.required])],
            email: [this.ubigeo.email, Validators.compose([Validators.required])],
            departamentos: [this.selectedDepartaments],
            provincias: [this.selectedProvinces],
            distritos: [this.selectedDistricts],
        });
    }

    mostrar(InputSearchDni){
        this.isLoadingSearchDni=true;
        if(InputSearchDni == ''){
            this.isLoadingSearchDni=false;
        }else{
            this.userService.getByDocumentUser(InputSearchDni).pipe(
                debounceTime(150),
                distinctUntilChanged(),
                catchError((errorMessage) => {
                    return of(errorMessage);
                })
            ).subscribe((response) => {
                    this.SearchDni = response.content;
            });
        }
    }

    save(){
        const sbUpdate = this.ubigeoService.postEditAsingUser(this.ubigeo.id,this.arrayGeneral).pipe(
            tap(() => this.router.navigate(['/admin/ubigeo'])),
            catchError((errorMessage) => {
                console.error('UPDATE ERROR', errorMessage);
                return of(this.arrayGeneral);
            })
        ).subscribe();
        this.subscriptions.push(sbUpdate);;
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
    
    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }


    //es el actual selected del <select> de (departament.code)
    departActual = [];
    proviActual = [];
    distriActual = [];

    departamentos: DepartamentModel[] = [];
    provincias: ProvinceModel[] = [];
    distritos: DistrictModel[] = [];

    arrMaster: DepartamentModel[] = [];

    arrayGeneral: DepartamentModel[];
 
    checkDepartament(event){
        let departamentosEnviados = event.value;
        let CodeDepartament: any;
        let existencia: boolean;
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
            switchMap(departamento => {
                
                if(this.arrayGeneral.findIndex(x => x.code == CodeDepartament) === -1){
                    this.arrayGeneral.push({
                        id: departamento.id, 
                        code: departamento.code, 
                        description: departamento.description, 
                        provinces: []
                    });
                };
                if(this.departamentos.findIndex(x => x.code == CodeDepartament) === -1){
                    this.departamentos.push({
                        id: departamento.id, 
                        code: departamento.code, 
                        description: departamento.description, 
                        provinces: []
                    });

                };
                return this.provinceService.getAllProvince(CodeDepartament+0);
            })
        ).subscribe((allProvince) => {
            let indexDep = this.arrMaster.findIndex(x => x.code == CodeDepartament);
            
            this.arrMaster[indexDep].provinces = allProvince.content;
            this.ApiDepartamentos.next(this.arrMaster)
            this.arrMaster2.next(this.arrayGeneral);
        });
        this.subscriptions.push(sbDepartamentby);
        
    }

    checkProvince(event){
        let provinciasEnviados = event.value;
        let CodeProvince: any;
        let existencia: boolean;
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
            switchMap(province => {
                const newProv: ProvinceModel = {
                    id: province.content[0].id,
                    code: province.content[0].code,
                    description: province.content[0].description,
                    districts: []
                }
                const newProv1: ProvinceModel = {
                    id: province.content[0].id,
                    code: province.content[0].code,
                    description: province.content[0].description,
                    districts: []
                }
                let codeDep = CodeProvince.substring(0,2);
                
                var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
                if(this.arrayGeneral[indexDep].provinces.findIndex(x => x.code == CodeProvince) === -1){
                    this.arrayGeneral[indexDep].provinces.push(newProv1);
                }
                if(this.provincias.findIndex(x => x.code == CodeProvince) === -1){
                    this.provincias.push(newProv);
                };
                return this.districtService.getAllDistrict(CodeProvince+0);
            })
        ).subscribe((allDistricts) => {

            let codeDep = CodeProvince.substring(0,2)
            let indexDep = this.arrMaster.findIndex(x => x.code == codeDep);
            let indexProv = this.arrMaster[indexDep].provinces.findIndex(x => x.code == CodeProvince);
            this.arrMaster[indexDep].provinces[indexProv].districts = allDistricts.content;
            this.ApiDepartamentos.next(this.arrMaster)
            this.arrMaster2.next(this.arrayGeneral)



            // let indexDep = this.arrMaster.findIndex(x => x.code === CodeDepartament);
            // this.arrMaster[indexDep].provinces = allProvince.content;
            // this.arrMaster2.next(this.arrayGeneral);
        });
        this.subscriptions.push(sbProvinceby);
        
    }

    checkDistrict(event){
        let distritosEnviados = event.value;
        let CodeDistrict: any;
        let existencia: boolean;
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
        ).subscribe((district) => {
            this.$_getbydistrict = district.content;
            let codeDep = CodeDistrict.substring(0,2);
            let codeProv = CodeDistrict.substring(0,4);
            var indexDep = this.arrayGeneral.findIndex(x => x.code == codeDep);
            var indexProv = this.arrayGeneral[indexDep].provinces.findIndex(x => x.code == codeProv);
            if(this.arrayGeneral[indexDep].provinces[indexProv].districts.findIndex(x => x.code == CodeDistrict) === -1){
                this.arrayGeneral[indexDep].provinces[indexProv].districts.push(district.content[0]);
            }
            if(this.distritos.findIndex(x => x.code == CodeDistrict) === -1){
                this.distritos.push(district.content[0]);
            };

            
        });
        this.subscriptions.push(sbDistrictby);
        this.arrMaster2.next(this.arrayGeneral)
    }

    removeDepartament(Departament) {
        let indexDepArr = this.arrMaster.findIndex(x => x.code == Departament);
        this.departamentos = this.departamentos.filter(item => item.code !== Departament);
        this.provincias = this.provincias.filter(item => item.code.substring(0,2) !== Departament);
        this.arrayGeneral = this.arrayGeneral.filter(item => item.code !== Departament);
        this.arrMaster[indexDepArr].provinces = null;
        this.MatDepartamento.options.forEach((data: MatOption) => {if(data.value == Departament){data.deselect()}});
        this.MatProvincia.options.forEach((data: MatOption) => {if(data.value.substring(0,2)==Departament){data.deselect()}});
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,2)==Departament){data.deselect()}});
        this.arrMaster2.next(this.arrayGeneral);
        this.ApiDepartamentos.next(this.arrMaster);
    }

    removeProvince(Province) {
        let codeDep = Province.substring(0,2);
        let posicionInser: number;
        
        for (let index = 0; index < this.arrayGeneral.length; index++){
            if(this.arrayGeneral[index].code == codeDep){
                posicionInser = index;
            }
        }
        let indexDepArr = this.arrMaster.findIndex(x => x.code == codeDep);
        let indexProvArr = this.arrMaster[indexDepArr].provinces.findIndex(x => x.code == Province);
        this.provincias = this.provincias.filter(item => item.code !== Province);
        this.distritos = this.distritos.filter(item => item.code.substring(0,4) !== Province);
        this.distriActual = this.distriActual.filter(item => item.substring(0,4) !== Province);
        this.arrayGeneral[posicionInser].provinces = this.arrayGeneral[posicionInser].provinces.filter(item => item.code !== Province);
        this.arrMaster[indexDepArr].provinces[indexProvArr].districts = null;
        
        this.MatProvincia.options.forEach((data: MatOption) => {if(data.value == Province){data.deselect()}});
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value.substring(0,4)==Province){data.deselect()}});
        this.arrMaster2.next(this.arrayGeneral);
        this.ApiDepartamentos.next(this.arrMaster);
    }

    removeDistrict(District) {
        
        let codeDep = District.substring(0,2);
        let codeProv = District.substring(0,4);
        let indexDep: number;
        let indexProv: number;
        
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

        var indexDepArr = this.arrMaster.findIndex(x => x.code == codeDep);
        let indexProvArr = this.arrMaster[indexDepArr].provinces.findIndex(x => x.code == District.substring(0,4));
        this.distritos = this.distritos.filter(item => item.code !== District);
        this.arrayGeneral[indexDep].provinces[indexProv].districts = this.arrayGeneral[indexDep].provinces[indexProv].districts.filter(item => item.code !== District);
        
        
        this.MatDistrito.options.forEach((data: MatOption) => {if(data.value == District){data.deselect()}});
        this.arrMaster2.next(this.arrayGeneral);
        this.ApiDepartamentos.next(this.arrMaster);
    }

    selectBeneficiary(item){
        this._user_dni=item.id;
        this.formGroup.patchValue({
        fullName: item.name+item.secondName+item.lastName+item.secondLastName,
        dni: item.documentNumber,
           
        });
        this.isLoadingSearchDni=false;
    }
}