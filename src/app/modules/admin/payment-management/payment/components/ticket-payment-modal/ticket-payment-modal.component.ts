import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Inject } from '@angular/core';
import {NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { PaymentComponent } from '../../payment.component';

@Component({
    selector: 'app-ticket-payment-modal',
    templateUrl: './ticket-payment-modal.component.html',
    styleUrls: ['./ticket-payment-modal.component.scss']
})

export class TicketPaymentModalComponent implements OnInit {

    @Output() enviar: EventEmitter<any> = new EventEmitter<any>();
    textoHijo: Number; 
    @Input() ss:Number;
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any
        , public dialogRef: MatDialogRef<PaymentComponent>
        ,public formatter: NgbDateParserFormatter
    ) { }

    ngOnInit(): void {
        console.log(this.data);
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
        if(e.currentTarget.checked==true){
            console.log(e.currentTarget.value);
            for (let numero of this.data.deuda){
                console.log(numero);
                if(numero.id==e.currentTarget.value){
                numero.Checked="true";
                }
            }
        }
        else{
            for (let numero of this.data.deuda){
                if(numero.id==e.currentTarget.value){
                    numero.Checked="false";
                }
            }
        }
    }

    BotonClose() {
        this.dialogRef.close(this.data);
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }
}