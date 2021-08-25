import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {TicketPaymentModalComponent} from './components/ticket-payment-modal/ticket-payment-modal.component'
import { Payment } from '../models/payment.model';
import * as moment from 'moment'
import {interval, of, Subject, Subscription} from 'rxjs';

import {Observable} from 'rxjs/internal/Observable'
import {MatDialog} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { BeneficiaryRepositoryService } from '../../_services-repository/beneficiary-repository.service';
import { finalize, map,debounceTime,distinctUntilChanged, catchError, first  } from 'rxjs/operators';
import { BeneficiaryModel } from '../../../admin/_models/Beneficiary.model';
import { SalesModel } from '../../../admin/_models/Sales.model';
import { SalesRepositoryService } from '../../_services-repository/sales-repository.service';
import { PaymentHTTPServiceDomain } from '../../_services/payment-domain.service';
import { PaymentModel } from '../../../admin/_models/Payment.model';
import { v4 as uuid } from 'uuid';
var EMPTY_PAYMENTS: BeneficiaryModel ={
        tx_external_code:'',
        tx_zone:'',
        id_department: '',
        id_province: '',
        id_district: '',
        id_ccpp: '',
        tx_annex: '',
        tx_east_wgs84: '',
        tx_north_wgs84: '',
        tx_east_psad56: '',
        tx_north_psad56: '',
        tx_zone_utm:'',
        tx_long_wgs84: '',
        tx_lat_wgs84: '',
        tx_long_psad56: '',
        tx_lat_psad56:'',
        tx_first_last_name:'',
        tx_second_last_name:'',
        tx_names:'',
        tx_document_number: '',
        tx_status:'',
        tx_distributor:'',
        tx_region:'',
        tx_region2: '',
        tx_rer:'',
        tx_data1:'',
        tx_data2: '',
        tx_data3: '',
        tx_ie:'',
        tx_ie_address:'',
        tx_month_block: '',
        tx_block:'',
        tx_type_document:'',
        tx_n_type_document: '',
        tx_serie:'',
        tx_number: '',
        int_period: 0,
        tx_upf:'',
        id:undefined
    };
const EMPTY_PAYMENT: Payment ={
    id: undefined,
    beneficiary_code: '',
    beneficiaryfullname: '',
    document_code:[],
    canal: 'WEB',
    canal_code:uuid(),
    version:'1',
    note: '',
    currency:'SOL',
    amount_received:0
};

export interface Deuda {
    Codigo_Factura:string,
    Periodo:string,
    Fecha_Vencimiento:string,
    Monto_Total:number,
    Monto_Pagado:number,
    Monto_Apagar:number,
    Checked:string
}

export interface DataImagen {
    url: string;
    edit: boolean;
    delete: boolean;
    show: boolean
}

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaymentComponent implements OnInit,OnDestroy{

    private utcSubscription: Subscription;
    public isLoading=false;
    public isLoading1=false;
    public src: string;
    public src1: string;
    public data$:any;
    public sales$:SalesModel[];
    public name$:any;
    private subscriptions: Subscription[] = [];
    _beneficiary:BeneficiaryModel;
    BENEFICIARIO:BeneficiaryModel;
    vuelto:number=0;
    date:Date;
    hours:any;
    minutes:any;
    seconds:any;
    currentLocale: any;
    imagenInicial: DataImagen = {url: './assets/media/users/blank.png', delete: false, edit: true, show: true};
    urls: DataImagen[] = [this.imagenInicial];
    tx_document_number:string;
    isTwelveHrFormat:false;
    test:any;

    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    formGroup: FormGroup;
    span: Boolean;
    public payment: Payment;
    fecha_actual: String;
    hora_actual: Date;
    hora_imprimir: String = new Date().toISOString();
    id: any;
    prueba: any;
    prueba2: any;
  
    constructor(
        private paymnentService: PaymentHTTPServiceDomain,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public beneficiaryService: BeneficiaryRepositoryService,
        public salesService: SalesRepositoryService,
    ) { }
    private utcTimeSubject: Subject<string> = new Subject<string>();
    utcTime$ = this.utcTimeSubject.asObservable();

    ngOnInit(): void {
        this.BENEFICIARIO = EMPTY_PAYMENTS;
        this.tx_document_number='';
        this.span = true;
        this.vuelto=0;
        this.fecha_actual = moment(new Date()).format('YYYY-MM-DD');
        this.hora_actual = new Date();
        setInterval(() => {
            this.hora_actual = new Date();
        }, 1000);
        this.loadPayment();
        const contador= interval(1000);
        this.loadSales()
        contador.subscribe((n)=>{
            this.reloj();
        })
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

    loadPayment() {
        if (!this.id) {
            this.payment = EMPTY_PAYMENT;
            this.loadForm();
        }
    }
  
    reloj(){
        this.hora_actual = new Date();
        this.hora_imprimir = this.hora_actual.getHours() + ":" + this.hora_actual.getMinutes() + ":" + this.hora_actual.getSeconds();
    }

    loadForm() {
        this.formGroup = this.fb.group({
        beneficiary_code: [this.payment.beneficiary_code, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        beneficiaryDni: [this.payment.beneficiaryfullname, Validators.compose([Validators.required])],
        canal:[this.payment.canal, Validators.compose([Validators.required])],
        canal_code:[this.payment.canal_code],
        version: [this.payment.version, Validators.compose([Validators.required])],
        note: [this.payment.note, Validators.compose([Validators.required])],
        amount_received: [this.payment.amount_received, Validators.compose([Validators.required])],
        currency: [this.payment.currency, Validators.compose([Validators.required])],
        document_code: [this.payment.document_code],
        prueba2: ['']
        });
    }

    save() {
        const formValues = this.formGroup.value;
        this.paymnentService.CreatePayment(formValues,this.urls);
    }

    remove(payment:string): void {
        console.log("removiendo");
        const index = this.payment.document_code.indexOf(payment);
        console.log(index);
        if (index >= 0) {
            for (let paymenteids of this.payment.document_code){
                if(paymenteids == payment){
                    this.payment.document_code.splice(index, 1);
                }
            }
            for (let numero of this.sales$){
                if(payment == numero.id){
                    numero.Checked = "false";
                    this.vuelto = this.vuelto - numero.total;
                } 
            }
        }
    }

    createModal() {
        const dialogRef = this.dialog.open(TicketPaymentModalComponent, {
            width:'max-width',
            data: {
                deuda: this.sales$
            }
        });

        dialogRef.afterClosed().subscribe(
            data => {
                if(data){
                    for (let numero of data.deuda){
                        if(numero.Checked=="true" && !this.payment.document_code.find( fruta => fruta == numero.id )){
                            this.payment.document_code.push(numero.id);
                            this.vuelto += numero.total;
                        }
                        else if(numero.Checked=="false"){
                        }
                    }
                }
            }
        );
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

    onSelectFile(event) {
        if (event.target.files && event.target.files[0] && this.urls.length < 4) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                var element: DataImagen ={
                url: '',
                edit: false,
                delete: true,
                show: true
                };
                reader.onload = (event:any) => {
                element.url = event.target.result;
                this.urls.push(element);
                if(this.urls.length > 3){
                    this.urls[0].show = false
                }
                }
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }

    eliminar(event){
        var id = event.currentTarget.id;
        var el = document.getElementById(id);
        if(this.urls.length > 3){
        this.urls[0].show = true;
        }
        el.remove();
        var cars = this.urls.filter(function(car) {
        return car.url !== id; 
        });
        this.urls = cars;
        console.log(this.urls)
    }

    busqueda(hyhy){
        if(hyhy == ''){
            this.isLoading=false;
            this.formGroup.patchValue({
                beneficiaryDni: ''
            });
            this.BENEFICIARIO.tx_document_number = '';
            this.BENEFICIARIO.tx_names = '';
            return;
        }else{
            this.isLoading=true;
            this.data$=this.beneficiaryService.getAllBeneficiary(hyhy).pipe(
                map((_beneficiary)=>
                
                this.BENEFICIARIO=_beneficiary.content[0],
                console.log(this._beneficiary)),
                
                distinctUntilChanged(),
                debounceTime(100000),
                finalize(()=>this.isLoading=false)
            )
        }
    }

    loadSales(){
        const sbSales = this.salesService.getAllSales().pipe(
            catchError((errorMessage) => {
                return of(errorMessage);
            })
        ).subscribe((_sales) => {
            this.sales$ = _sales.content;
            console.log(this.sales$);
        });
            this.subscriptions.push(sbSales);
    }

    vueltorecibido(importe){
        console.log(importe.value);
        this.vuelto=this.vuelto-importe.value;
    }

    mostrar(prueba:string){
        this.isLoading=true;
        if(prueba == ''){
            this.isLoading=false;
        }else{
            this.beneficiaryService.getAllBeneficiary(prueba).pipe(
         
                catchError((errorMessage) => {
                    return of(errorMessage);
                })
            ).subscribe((response) => {
                this.tx_document_number=response.content[0].tx_document_number;
                    this.prueba = response.content;
            });
        }
    }

    selectBeneficiary(event){
        var _beneficiary_code = event.srcElement.firstElementChild.innerHTML;
        this.formGroup.patchValue({
            beneficiaryDni: event.target.firstChild.data,
            beneficiary_code: _beneficiary_code,
           
        });
        this.isLoading=false;
    }
}