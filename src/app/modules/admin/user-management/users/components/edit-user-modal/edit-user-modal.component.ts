import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TypeDocumentModel } from 'src/app/modules/admin/_models/TypeDocument.model';
import { TypeDocumentRepositoryService } from 'src/app/modules/admin/_services-repository/typedocument-repository.service';
import { User } from '../../../models/user.model';
import { TypePersonRepositoryService } from 'src/app/modules/admin/_services-repository/typeperson-repository.service';
import { TypePersonModel } from 'src/app/modules/admin/_models/TypePerson.model';
import { CollectionAgentHTTPServiceDomain } from '../../../../_services/collectionAgent-domain.service';
import { RolesModel } from 'src/app/modules/admin/_models/Roles.model';
import { Observable } from 'rxjs';
import { RoleRepositoryService } from 'src/app/modules/admin/_services-repository/role-repository.service';

const EMPTY_USER: User ={
    id: undefined,
    firstName: '',
    lastName: '',
    firstApellido: '',
    lastApellido: '',
    businessName: '',
    documentType: '',
    document: '',
    firstPhone: '',
    secondPhone: '',
    email: '',
    ubigeo: '',
    address: '',
    latitude: '',
    longitude: '',
    nota: '',
    personType: ''
};

interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
}
@Component({
    selector: 'app-edit-user-modal',
    templateUrl: './edit-user-modal.component.html'
})

export class EditUserModalComponent implements OnInit {
    @Input() id: number;
    private subscriptions: Subscription[] = [];
    _typedocument: TypeDocumentModel[];
    _typeperson:TypePersonModel[];
    file: File;
    photoSelected1:  String | ArrayBuffer;
    photoSelected2:  String | ArrayBuffer;
    photoSelected3:  String | ArrayBuffer;
    photoSelected4:  String | ArrayBuffer;
    photoSelected5:  String | ArrayBuffer;
    isRucSelected: Boolean;
    isDniSelected: Boolean;
    formGroup: FormGroup;
    user: User;
    userName: String = '';
    $_roles: Observable<RolesModel[]>;
    
    constructor(
        private collectionAgentService: CollectionAgentHTTPServiceDomain,
        public rolesService: RoleRepositoryService,
        private fb: FormBuilder, 
        public modal: NgbActiveModal,
        private typodocumentService: TypeDocumentRepositoryService,
        private typopersonService: TypePersonRepositoryService,
    ) { }

    ngOnInit(): void {
        this.loadRoles();
        console.log(this.loadRoles());
        this.loadUser();
        this.loadTypeperson();
        this.loadTypedocument();
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

  loadTypedocument() {
    const sbTypedocument = this.typodocumentService.getAllTypedocument().pipe(
        catchError((errorMessage) => {
        return of(errorMessage);
        })
    ).subscribe((_typedocument) => {
        this._typedocument = _typedocument.content;
    });
    this.subscriptions.push(sbTypedocument);
}
  
    loadTypeperson() {
        const sbTypeperson = this.typopersonService.getAllTypeperson().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_typeperson) => {
            this._typeperson = _typeperson.content;
           // console.log(this._typeperson);
        });
        this.subscriptions.push(sbTypeperson);
    }
    
    loadUser() {
        if (!this.id) {
        this.user = EMPTY_USER;
        this.loadForm();
        }  
    }

    asignUserNamePartOne(){
        if(this.user.firstName.length > 3){
            let texto = this.user.firstName.substr(0,3);
            this.userName = texto;
        }
    }

    asignUserNamePartTwo(){
        if(this.user.lastName.length > 3){
            console.log("ejecuta la 2da parte")
            let texto = this.user.lastName.substr(0,3);
            this.userName = this.userName + texto;
        }
    }

    loadForm() {
        this.formGroup = this.fb.group({
            name: [this.user.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            secondName: [this.user.lastName, Validators.compose([Validators.required])],
            lastName: [this.user.firstApellido, Validators.compose([Validators.required])],
            secondLastName: [this.user.lastApellido, Validators.compose([Validators.required])],
            businessName: [this.user.businessName, Validators.compose([Validators.required])],
            documentNumber: [this.user.document, Validators.compose([Validators.required])],
            phone1: [this.user.firstPhone, Validators.compose([Validators.required])],
            phone2: [this.user.secondPhone, Validators.compose([Validators.required])],
            email: [this.user.email, Validators.compose([Validators.required])],
            ubigeo: [this.user.ubigeo, Validators.compose([Validators.required])],
            address: [this.user.address, Validators.compose([Validators.required])],
            longitude: [this.user.longitude, Validators.compose([Validators.required])],
            latitude: [this.user.latitude, Validators.compose([Validators.required])],
            nota: [this.user.nota, Validators.compose([Validators.required])],
            typePersonCode: ['', Validators.compose([Validators.required])],
            typeDocumentCode: ['', Validators.compose([Validators.required])],
            roleCode: ['', Validators.compose([Validators.required])],
            userName: ['', Validators.compose([Validators.required])],
            foto1: [null],
            foto2: [null],
            foto3: [null],
            foto4: [null]
        });
    }

    desactivar(e){
        let valor = e.currentTarget.value;
        if(valor == '6'){
        this.isRucSelected = true;
        this.isDniSelected = false;
        }else if(valor == '1'){
        this.isDniSelected = true;
        this.isRucSelected = false;
        }else if(valor != '1' || valor != '6'){
        this.isDniSelected = false;
        this.isRucSelected = false;
        }
        console.log(this.isRucSelected);
    }
    
    getPic() {
        // if (!this.user.pic) {
        return `url('./assets/media/users/100_1.jpg')`;
    //  }
    
    //  return `url('${this.user.pic}')`;
    }
    
    deletePic() {
    //  this.user.pic = '';
    }

    save(){
        console.log(this.formGroup.value);
        const formValues = this.formGroup.value;
        this.collectionAgentService.CreateCollectionAgent(formValues);
    }

    btn1(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
            this.file = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.photoSelected1 =reader.result;
            reader.readAsDataURL(this.file);
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
            reader.onload= e => this.photoSelected2 =reader.result;
            reader.readAsDataURL(this.file);
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
            this.formGroup.patchValue({
                foto4: this.file
            });
        }
    }
    btn5(event:HtmlInputEvent): void{
        if(event.target.files && event.target.files[0])
        {
        this.file = <File>event.target.files[0];
        const reader = new FileReader();
        reader.onload= e => this.photoSelected5 =reader.result;
        reader.readAsDataURL(this.file);
        
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
}