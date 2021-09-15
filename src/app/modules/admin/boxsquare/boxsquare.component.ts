import { BoxSquareModel } from './../_models/boxsquare.model';
import { PaymentService } from './../_services/payment.service';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";
import { DataImagen } from "../payment/payment.component";
import { BoxSquaresService } from "../_services/boxsquares.service";
import { PaymentHeaderModel } from '../_models/payment.header.model';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment'
import { Router } from '@angular/router';


@Component({
    selector: 'app-boxsquare-component',
    templateUrl: './boxsquare.component.html',
    styleUrls: ['./boxsquare.component.scss']
})
export class BoxSquareComponent implements OnInit, OnDestroy {

    formGroup: FormGroup;
    $_urls: BehaviorSubject<DataImagen[]> = new BehaviorSubject<DataImagen[]>([]); 
    private subscriptions: Subscription[] = [];
    $_paymentsForBoxSquare: BehaviorSubject<PaymentHeaderModel[]> = new BehaviorSubject<PaymentHeaderModel[]>([]);
    _boxSquare: BoxSquareModel = {};
    uuid: string;

    constructor(
        private fb: FormBuilder,
        public _boxSquaresService: BoxSquaresService,
        public _paymentService: PaymentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.uuid = uuid.v4();
        this.loadFormGroup();
        const $_paymentsForBoxSquare = this._paymentService.getPaymentsForBoxSquare().subscribe( _document => {
                this.$_paymentsForBoxSquare.next(_document.data);

                const sum = _document.data.filter(item => item.paid)
                            .reduce((sum, current) => sum + current.paid, 0);

                const comission = _document.data.length * 2    

                this.formGroup.patchValue({
                    totalcharged: sum ,
                    commission: comission,
                    totalpay: sum - comission
                });
                }
            );
        this.subscriptions.push($_paymentsForBoxSquare);        
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    loadFormGroup() {
        this.formGroup = this.fb.group({

            note:['', ],
            totalcharged: ['', Validators.compose([Validators.required])],
            commission: ['', Validators.compose([Validators.required])],
            totalpay: ['', Validators.compose([Validators.required])],
            fileSource: ['', Validators.compose([Validators.required])]
        });

        this.subscriptions.push(
            this.formGroup.controls.fileSource.valueChanges.subscribe((value) =>
                this.$_urls.next(value)
            )
        );
    }

    uploadFile(){
        document.getElementById('fileUploader').click();
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

    private prepareInternalUser() {
        const formData = this.formGroup.value;
        const currentItems = this.$_paymentsForBoxSquare.getValue();
        this._boxSquare.totalcharged = formData.totalcharged;
        this._boxSquare.totalpay = formData.totalpay;
        this._boxSquare.commission = formData.commission;
        this._boxSquare._squareDate = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        this._boxSquare.note = formData.note;
        this._boxSquare.canal = "ANGULAR";
        this._boxSquare.canalCode = this.uuid;
        this._boxSquare.version = "version 1.0.0";
        this._boxSquare.latitude = "";
        this._boxSquare.longitude = "";
        this._boxSquare.documents = [];
        currentItems.forEach(item => {
            this._boxSquare.documents.push(item.canalCode);
        });
    }

    save() {
        const $_formData = this.formGroup.value;
        this.prepareInternalUser();

        const formData: FormData = new FormData();
        const fileJson = new File([JSON.stringify(this._boxSquare)] , "boxsquare.json", {type: "application/json"});
        const _files = this.$_urls.getValue();
        
        formData.append('boxsquare', fileJson);
        
        _files.forEach(file => {
            let upload = new File([file.file], file.name, {type: file.type});
            formData.append('files', upload);
        });

               
        
        const registerBoxSquare = this._boxSquaresService.register(formData).subscribe( response  => {
            if(response.success) {
                console.log("Cierre registrado");
                this.router.navigateByUrl('/admin/boxsquareme');
            } else {
                console.log("No se registro cierre");
            }
        });
        
        
        this.subscriptions.push(registerBoxSquare);
    }

}