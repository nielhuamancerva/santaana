import { ImageModel } from './../_models/Image.model';
import { PaymentService } from './../_services/payment.service';
import { DocumentModel } from './../_models/Document.model';
import { BeneficiaryModel } from './../_models/Beneficiary.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map,debounceTime,distinctUntilChanged, startWith, switchMap  } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BeneficiariesService } from '../_services/beneficiaries.service';
import { TicketPaymentModalComponent } from './components/ticket-payment-modal.component';
import { PaymentHeaderModel } from '../_models/payment.header.model';
import * as moment from 'moment'
import { DocumentsService } from '../_services/documents.service';
import { Router } from '@angular/router';

export interface DataImagen extends ImageModel {
    url: string | ArrayBuffer;
    edit: boolean;
    delete: boolean;
    show: boolean,

}


@Component({
    selector: 'app-payment-component',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit, OnDestroy{

    private subscriptions: Subscription[] = [];
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    beneficiary: BeneficiaryModel;
    payment: PaymentHeaderModel;
    $_documentsForPay: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);
    $_filteredBeneficiaries: Observable<BeneficiaryModel[]>;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    formGroup: FormGroup;
    uuid: string;
    returned: number = 0;
    qimg: number = 1;
    imagenInicial: DataImagen = {url: './assets/media/users/blank.png', delete: false, edit: true, show: true};
    $_urls: BehaviorSubject<DataImagen[]> = new BehaviorSubject<DataImagen[]>([]); 
    images = [];
    constructor(
        private fb: FormBuilder,
        private _paymentService: PaymentService,
        private modalService: NgbModal,
        public _beneficiariesService: BeneficiariesService,
        public _documentsService: DocumentsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.uuid = uuid.v4();
        this.loadFormGroup();
        this.payment = {
            beneficiary: {},
            files: [],
            documents: []
        };
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    displayFn(beneficiary?: BeneficiaryModel): string | undefined {
        return beneficiary ? beneficiary.completeName : undefined;
    }

    uploadFile(){
        document.getElementById('fileUploader').click();
    }
    

    loadFormGroup() {
        this.formGroup = this.fb.group({
            beneficiary: ['', Validators.compose([Validators.required])],
            document_code: ['',],
            note:['', ],
            totalPaid: ['', ],
            received: ['', Validators.compose([Validators.required])],
            toPaid: ['', Validators.compose([Validators.required, Validators.min(8)])],
            fileSource: ['', Validators.compose([Validators.required])]
        });


        this.$_filteredBeneficiaries = this.formGroup.controls.beneficiary.valueChanges
        .pipe(
          startWith(''),
          debounceTime(50),
          distinctUntilChanged(),
          switchMap(val => {
            return this.searchBeneficiary(val || '')
          })       
        );

        this.subscriptions.push(
            this.formGroup.controls.beneficiary.valueChanges.subscribe(() =>
                this.beneficiarySelect()
            )
        );

        this.subscriptions.push(
            this.formGroup.controls.received.valueChanges.subscribe(() =>
                this.changesReceived()
            )
        );

        this.subscriptions.push(
            this.formGroup.controls.toPaid.valueChanges.subscribe(() =>
                this.changesToPaid()
            )
        );

        this.subscriptions.push(
            this.formGroup.controls.fileSource.valueChanges.subscribe((value) =>
                this.$_urls.next(value)
            )
        );
    }

    changesReceived() {
        let received = this.formGroup.get('received').value;
        let totalPaid = this.formGroup.get('totalPaid').value;

        if (received > totalPaid) {
            this.returned = received - totalPaid;
        } else if (received < totalPaid) {
            this.returned = 0;
        } 
    }

    changesToPaid() {
        let received = this.formGroup.get('received').value;
        let totalPaid = this.formGroup.get('totalPaid').value;
        let toPaid = this.formGroup.get('toPaid').value;

        if (received > totalPaid && totalPaid > toPaid) {
            this.returned = received - toPaid;
        } else if (received < totalPaid && received > toPaid) {
            this.returned = received - toPaid;
        } else if (received > totalPaid && toPaid > totalPaid) {
            this.returned = received - totalPaid;
        }


        if (toPaid > totalPaid) {
            this.formGroup.get('toPaid').patchValue(totalPaid);
        }
        
    }
    
    beneficiarySelect() {
        this.beneficiary = this.formGroup.get('beneficiary').value;
        if (this.beneficiary) {
            const $_documentSearch = this._documentsService.getDocumentsForPay(0, 1, null, this.beneficiary.id, null, null).subscribe( _document => {

                var total = 0;
                _document.data.content.forEach(item => {   
                    total += item.pending;
                });
                
                this.formGroup.get('totalPaid').patchValue(total);
                this.formGroup.get('received').patchValue(0);
                this.formGroup.get('toPaid').patchValue(total);
                this.$_documentsForPay.next(_document.data.content);
                }
            );
            this.subscriptions.push($_documentSearch);
        }
        
    }

    searchBeneficiary(beneficiary: string): Observable<BeneficiaryModel[]> {
        return this._beneficiariesService.getAllBeneficiaryForPay(0, 5, beneficiary, beneficiary, beneficiary)
         .pipe(
           map(response => response.data.content
           ));
    } 

    openDialog() {

        if(this.beneficiary) {
            const modalRef = this.modalService.open(TicketPaymentModalComponent, { size: 'lg', backdrop : 'static',
            keyboard : false });
            modalRef.componentInstance._beneficiary = this.beneficiary;
            modalRef.componentInstance._documents =  this.$_documentsForPay.getValue();
            modalRef.result.then( result => {
                    if(result) {
                        var total = 0;
                        result.forEach( element => {
                            total += element.pending;
                        });

                        this.$_documentsForPay.next(result);
                        this.formGroup.get('totalPaid').patchValue(total);
                        this.formGroup.get('toPaid').patchValue(total);
                    }
                },
                () => { }
            );
        }

    }

    save() {
        const $_formData = this.formGroup.value;
        this.prepareInternalUser();

        const formData: FormData = new FormData();
        const fileJson = new File([JSON.stringify(this.payment)] , "payment.json", {type: "application/json"});
        const _files = this.$_urls.getValue();
        
        formData.append('payment', fileJson);
        
        _files.forEach(file => {
            let upload = new File([file.file], file.name, {type: file.type});
            formData.append('files', upload);
        });

               
        
        const registerPayment = this._paymentService.register(formData).subscribe( response  => {
            if(response.success) {
                console.log("Pago registrado");
                this.router.navigateByUrl('/admin/payments');
            } else {
                console.log("No se registro pago");
            }
        });
        
        
        this.subscriptions.push(registerPayment);
    }

    private prepareInternalUser() {
        const formData = this.formGroup.value;
        const currentItems = this.$_documentsForPay.getValue();
        this.payment.beneficiary = this.beneficiary;
        this.payment.payments = this.$_documentsForPay.getValue();
        this.payment.received = formData.received;
        this.payment.paid = formData.toPaid;
        this.payment.returned = this.returned;
        this.payment._payDate = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        this.payment.note = formData.note;
        this.payment.canal = "ANGULAR";
        this.payment.canalCode = this.uuid;
        this.payment.version = "version 1.0.0";
        this.payment.latitude = "";
        this.payment.longitude = "";
        this.payment.documents = [];
        currentItems.forEach(item => {
            this.payment.documents.push(item.id);
        });
    }

    remove(document :DocumentModel): void {

        const currentItems = this.$_documentsForPay.getValue();
        
        const itemsWithoutDeleted = currentItems.filter( item => document.id !== item.id);
        
        var total = 0;
        itemsWithoutDeleted.forEach(item => {   
            total += item.pending;
        });

        this.$_documentsForPay.next(itemsWithoutDeleted);
        
        this.formGroup.get('totalPaid').patchValue(total);
        this.formGroup.get('received').patchValue(0);
        this.formGroup.get('toPaid').patchValue(total);
    }

   
    onFileChange(event) {
        const _urls = this.$_urls.getValue();
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                    var reader = new FileReader();   
                    var document: DataImagen = {url: '', edit: false, delete: true, show: true};
                    reader.onload = (event:any) => {
                       document.url = event.target.result;
                       _urls.push(document);
                       this.formGroup.patchValue({
                          fileSource: _urls
                       });
                    }
                    document.name = event.target.files[i].name;
                    document.type = event.target.files[i].type;
                    document.file = event.target.files[i];
                    reader.readAsDataURL(event.target.files[i]);
            }
        }
    }

    eliminar(event) {
        
        let _urls = this.$_urls.getValue();

        var id = event.currentTarget.id;
        var el = document.getElementById(id);
        el.remove();
        _urls = _urls.filter(value => {
                return value.url !== id; 
        });

        this.formGroup.patchValue({
            fileSource: _urls
         });
      
        this.$_urls.next(_urls);
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