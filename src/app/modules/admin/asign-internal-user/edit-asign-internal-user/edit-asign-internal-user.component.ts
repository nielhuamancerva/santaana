import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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

interface Pokemon {
    value: string;
    viewValue: string;
}

interface PokemonGroup {
    disabled?: boolean;
    name: string;
    pokemon: Pokemon[];
}

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
        public dialog: MatDialog,
        private fb: FormBuilder,
        private typopersonService: TypePersonRepositoryService,
        private provinceDomainService: ProvinceHTTPServiceDomain,
        private departamentDomainService: DepartamentHTTPServiceDomain,
        private districtDomainService: DistrictHTTPServiceDomain,
        private ccpDomainService: CcppHTTPServiceDomain,
        private typeDocumentDomainService: TypeDocumentHTTPServiceDomain,
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
    }

    get departaments(){
        return this.departamentDomainService.departaments;
    }
    
    get provinces(){
        return this.provinceDomainService.provinces;
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

    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
    pokemonControl = new FormControl();
    pokemonGroups: PokemonGroup[] = [
        {
        name: 'Grass',
        pokemon: [
            {value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
            {value: 'oddish-1', viewValue: 'Oddish'},
            {value: 'bellsprout-2', viewValue: 'Bellsprout'}
        ]
        },
        {
        name: 'Water',
        pokemon: [
            {value: 'squirtle-3', viewValue: 'Squirtle'},
            {value: 'psyduck-4', viewValue: 'Psyduck'},
            {value: 'horsea-5', viewValue: 'Horsea'}
        ]
        },
        {
        name: 'Fire',
        disabled: true,
        pokemon: [
            {value: 'charmander-6', viewValue: 'Charmander'},
            {value: 'vulpix-7', viewValue: 'Vulpix'},
            {value: 'flareon-8', viewValue: 'Flareon'}
        ]
        },
        {
        name: 'Psychic',
        pokemon: [
            {value: 'mew-9', viewValue: 'Mew'},
            {value: 'mewtwo-10', viewValue: 'Mewtwo'},
        ]
        }
    ];


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
}