import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-ticket-payment-modal',
  templateUrl: './ticket-payment-modal.component.html',
  styleUrls: ['./ticket-payment-modal.component.scss']
})
export class TicketPaymentModalComponent implements OnInit {
  @Output() enviar: EventEmitter<any> = new EventEmitter<any>();

textoHijo: Number; 
@Input() ss:Number;
@Input() public payment;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,public modal: NgbActiveModal) {this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10); }

  ngOnInit(): void {
    console.log(this.payment);
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  add(e){

    if(e.currentTarget.checked==true)
    {
      this.payment.totalPay=Number(e.currentTarget.value)+Number(this.payment.totalPay);
  
       
    }
    else{
      this.payment.totalPay=Number(this.payment.totalPay)-Number(e.currentTarget.value);
 
      
    }
     
 
   
  }

  botonClick() {
  

    this.enviar.emit(this.payment);
    this.modal.close(this.payment);
 
  }


  ///validaciones ///
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
