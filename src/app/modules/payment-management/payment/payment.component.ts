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
import { BeneficiaryRepositoryService } from '../../auth/_services/auth-repository/beneficiary-repository.service';
import { finalize, map,debounceTime,distinctUntilChanged, catchError  } from 'rxjs/operators';
import { BeneficiaryModel } from '../../auth/_models/Beneficiary.model';
import { SalesModel } from '../../auth/_models/Sales.model';
import { SalesRepositoryService } from '../../auth/_services/auth-repository/sales-repository.service';
import { PaymentHTTPServiceDomain } from '../../auth/_services/auth-domain/payment-domain.service';
const EMPTY_PAYMENT: Payment ={
  id: undefined,
  invoiceCode: '',
  beneficiaryDni: '',
  VINCode: '',
  createdUser: '',
  createdDate: '',
  createdHour: '',
  phonenumber1: '',
  phonenumber2: '',
  note: '',
  totalPay: 0,
  mountToPay: 0,
  mountToCollect: 0
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

export interface Fruit {
  name: string;
  monto: number;
  numberr: string;
  id:string
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
public code$:any;
private subscriptions: Subscription[] = [];
_beneficiary:BeneficiaryModel[];
vuelto:number;
  date:Date;
  hours:any;
  minutes:any;
  seconds:any;
  currentLocale: any;
  imagenInicial: DataImagen = {url: './assets/media/users/blank.png', delete: false, edit: true, show: true};
  urls: DataImagen[] = [this.imagenInicial];

  isTwelveHrFormat:false;
  test:any;

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [
  ];
  
  formGroup: FormGroup;
  span: Boolean;
  public payment: Payment;
  fecha_actual: String;
  hora_actual: Date;
  hora_imprimir: String = new Date().toISOString();
  id: any;
  
  constructor(
    private paymnentService: PaymentHTTPServiceDomain,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public beneficiaryService: BeneficiaryRepositoryService,
    public salesService: SalesRepositoryService,
  ) { 
    
  }
  private utcTimeSubject: Subject<string> = new Subject<string>();
  utcTime$ = this.utcTimeSubject.asObservable();

  
  ngOnInit(): void {
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
      beneficiary_code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      beneficiaryDni: [this.payment.beneficiaryDni, Validators.compose([Validators.required])],
      VINCode: [this.payment.VINCode, Validators.compose([Validators.required])],
      boleta: [this.fruits, Validators.compose([Validators.required])],
      createdDate:[this.fecha_actual],
      createdHour:[this.hora_imprimir],
      phonenumber1: [this.payment.phonenumber1, Validators.compose([Validators.required])],
      phonenumber2: [this.payment.phonenumber2, Validators.compose([Validators.required])],
      note: [this.payment.note, Validators.compose([Validators.required])],
      mountToPay: [this.payment.mountToPay, Validators.compose([Validators.required])],
      amount_received: [this.payment.totalPay, Validators.compose([Validators.required])],
      mountToCollect: [this.payment.mountToCollect, Validators.compose([Validators.required])],
      document_code: [null]
    });
  }
  

  save() {
    
    var ids = [];
    for (let numero of this.fruits){
      ids.push(numero.id)
    }
    console.log(this.code$);
    this.formGroup.patchValue({
      document_code: ids
    });
    const formValues = this.formGroup.value;
    this.paymnentService.CreatePayment(formValues,this.urls);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

   
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
  
      for (let numero of this.sales$){
        if(numero.id_currency==fruit.name){
         numero.Checked="false";
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
          console.log("cerrado:", data)
          console.log("cerrado:", data.deuda)
          for (let numero of data.deuda){
            if(numero.Checked=="true" && !this.fruits.find( fruta => fruta.name === numero.serie )){
              this.fruits.push({name: numero.serie,numberr:numero.number, monto: numero.total, id: numero.id});
            }
            else(numero.Checked=="false")
            {
              
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
          //console.log(this.urls);
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

  busqueda(event){
    console.log(event);
this.isLoading=true;
this.data$=this.beneficiaryService.getAllBeneficiary(event).pipe(
  map((_beneficiary)=>_beneficiary.content[0].tx_document_number),
  distinctUntilChanged(),
  debounceTime(100000),
  finalize(()=>this.isLoading=false)
)
this.name$=this.beneficiaryService.getAllBeneficiary(event).pipe(
  map((_beneficiary)=>_beneficiary.content[0].tx_names +" "+ _beneficiary.content[0].tx_first_last_name +" "+ _beneficiary.content[0].tx_second_last_name),
  distinctUntilChanged(),
  debounceTime(100000),
  finalize(()=>this.isLoading=false)
)
this.code$=this.beneficiaryService.getAllBeneficiary(event).pipe(
  map((_beneficiary)=>_beneficiary.content[0].id),
  distinctUntilChanged(),
  debounceTime(100000),
  finalize(()=>this.isLoading=false)
)
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

  vueltorecibido(recivido){
    this.isLoading=true;
    console.log(recivido);
var a = 0;
    for (let numero of this.fruits){
      a+=numero.monto
    }

    this.vuelto=a-recivido;
  }
}
