import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component,Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TicketPaymentModalComponent} from './components/ticket-payment-modal/ticket-payment-modal.component'
import { Payment } from '../models/payment.model';

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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit{
  @Input() ss: Number;
  @Input() id: number;
  formGroup: FormGroup;
  span: Boolean;
  @Input() public payment: Payment;
 @Input() textoHijo: Number;


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    throw new Error('Method not implemented.');
  }
 

  ngOnInit(): void {
    this.span = true;
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
      createdDate: [this.payment.createdDate, Validators.compose([Validators.required])],
      createdHour: [this.payment.createdHour, Validators.compose([Validators.required])],
      phonenumber1: [this.payment.phonenumber1, Validators.compose([Validators.required])],
      phonenumber2: [this.payment.phonenumber2, Validators.compose([Validators.required])],
      note: [this.payment.note, Validators.compose([Validators.required])],
      mountToPay: [this.payment.mountToPay, Validators.compose([Validators.required])],
      totalPay: [this.payment.totalPay, Validators.compose([Validators.required])],
      mountToCollect: [this.payment.mountToCollect, Validators.compose([Validators.required])]
    });



  }
  ngDoCheck() {

  }

  save() {

  }





  createModal() {
    this.editModal();
  }

  editModal() {
    const modalRef = this.modalService.open(TicketPaymentModalComponent);
 
    modalRef.componentInstance.payment= this.payment;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });

   modalRef.componentInstance.enviar.subscribe((ss) => {


    })


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
