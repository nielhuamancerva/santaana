import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component,Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import {TicketPaymentModalComponent} from './components/ticket-payment-modal/ticket-payment-modal.component'
import { Payment } from '../models/payment.model';
import * as moment from 'moment'

import {MatDialog} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
}


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit{

public deuda: Deuda []= [{
  Codigo_Factura:'C001',
  Periodo:'01/08/2021',
  Fecha_Vencimiento:'01/08/2021',
  Monto_Total:40.00,
  Monto_Pagado:20.00,
  Monto_Apagar:20.00,
  Checked:"false"
},{
  Codigo_Factura:'C002',
  Periodo:'01/08/2021',
  Fecha_Vencimiento:'01/08/2021',
  Monto_Total:60.00,
  Monto_Pagado:10.00,
  Monto_Apagar:50.00,
  Checked:"false"
},{
  Codigo_Factura:'C003',
  Periodo:'01/08/2021',
  Fecha_Vencimiento:'01/08/2021',
  Monto_Total:60.00,
  Monto_Pagado:10.00,
  Monto_Apagar:50.00,
  Checked:"false"
}
 
];

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
  id: any;
  
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.span = true;
    this.fecha_actual = moment(new Date()).format('YYYY-MM-DD');
    this.hora_actual = new Date();
    setInterval(() => {
      this.hora_actual = new Date();
    }, 1000);
    this.loadPayment();

  }

  loadPayment() {
    if (!this.id) {
      this.payment = EMPTY_PAYMENT;
      this.loadForm();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      invoiceCode: [this.payment.invoiceCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      beneficiaryDni: [this.payment.beneficiaryDni, Validators.compose([Validators.required])],
      VINCode: [this.payment.VINCode, Validators.compose([Validators.required])],
      createdUser: [this.payment.createdUser, Validators.compose([Validators.required])],
      phonenumber1: [this.payment.phonenumber1, Validators.compose([Validators.required])],
      phonenumber2: [this.payment.phonenumber2, Validators.compose([Validators.required])],
      note: [this.payment.note, Validators.compose([Validators.required])],
      mountToPay: [this.payment.mountToPay, Validators.compose([Validators.required])],
      totalPay: [this.payment.totalPay, Validators.compose([Validators.required])],
      mountToCollect: [this.payment.mountToCollect, Validators.compose([Validators.required])]
    });



  }


  save() {

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
   // event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
  
      for (let numero of this.deuda){
        if(numero.Codigo_Factura==fruit.name){
         numero.Checked="false";
        }
      }
    }
  }

  createModal() {
    
    const dialogRef = this.dialog.open(TicketPaymentModalComponent, {
      width:'max-width',
      data: {
        deuda: this.deuda
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          console.log("cerrado:", data)
          for (let numero of data.deuda){
            if(numero.Checked=="true" && !this.fruits.find( fruta => fruta.name === numero.Codigo_Factura )){
              this.fruits.push({name: numero.Codigo_Factura});
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
}
