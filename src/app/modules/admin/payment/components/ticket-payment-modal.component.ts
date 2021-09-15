import { DocumentsService } from './../../_services/documents.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DateModel } from '../../_models/date.model';
import { DocumentModel } from '../../_models/Document.model';
import { BeneficiaryModel } from '../../_models/Beneficiary.model';
import { D } from '@angular/cdk/keycodes';


@Component({
    selector: 'app-ticket-payment-modal',
    templateUrl: './ticket-payment-modal.component.html',
    styleUrls: ['./ticket-payment-modal.component.scss']
})

export class TicketPaymentModalComponent implements OnInit, OnDestroy {

    @Input()  _beneficiary: BeneficiaryModel;
    @Input()  _documents: DocumentModel[];
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = []; 
    dateIni: DateModel;
    dateFin: DateModel;
    documentsForPay: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

    constructor(
        public modal: NgbActiveModal,
        private fb: FormBuilder,
        public _documentsService: DocumentsService
    ) { }

    ngOnInit(): void {
        this.searchForm();
        this.search();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    searchDocuments(beneficiary: string, dateIn?: string, dateFn?: string): Observable<DocumentModel[]> {
        return this._documentsService.getDocumentsForPay(0, 50, null, beneficiary, dateIn, dateFn)
         .pipe(
           map(response => response.data.content
           ));
    }


    search(dateIn?: string, dateFn?: string) {
        const searchDocument = this.searchDocuments(this._beneficiary.id, dateIn, dateFn).subscribe(documents => {
             documents.forEach( item => {
                    this._documents.forEach( base => {
                        if (item.id == base.id) {
                            item.checked = true;
                        } 
                    })
                }
            )

            this.documentsForPay.next(documents);
        });
        this.subscriptions.push(searchDocument);
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            dateIn: [''],
            dateFn: ['']
        });


        const searchDateIn = this.searchGroup.controls.dateIn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateIn);


        const searchDateFn = this.searchGroup.controls.dateFn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateFn);

    }

    searchDate() {
        this.dateIni = this.searchGroup.get('dateIn').value;
        this.dateFin = this.searchGroup.get('dateFn').value;

        if (this.dateIni && this.dateFin) {
            let searchDateIni = this.dateIni.year + "-" + 
            (this.dateIni.month.toString().length > 1 ? this.dateIni.month : ("0" + this.dateIni.month)) + "-" + 
            (this.dateIni.day.toString().length > 1 ? this.dateIni.day : ("0" + this.dateIni.day)) ;
            let searchDateFin =    this.dateFin.year + "-" + 
            (this.dateFin.month.toString().length > 1 ? this.dateFin.month : ("0" + this.dateFin.month)) + "-" + 
            (this.dateFin.day.toString().length > 1 ? this.dateFin.day : ("0" + this.dateFin.day));
           
            this.search(searchDateIni, searchDateFin);
        }

    }


    eventCheck( document ){
        
        this._documents = this._documents.filter(item => document.value !== item.id)

        if (document.checked) {
            const currentItems = this.documentsForPay.getValue();
            currentItems.forEach( item => {
                    if (item.id == document.value){
                        this._documents.push(item);
                    }
                }
            )
        } 
    }

    closeDialog() {
        this.modal.close(this._documents);
    }


}