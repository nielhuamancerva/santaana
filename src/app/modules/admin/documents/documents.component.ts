import { DocumentModel } from './../_models/Document.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ICreateAction, IEditAction, PaginatorState } from "src/app/_metronic/shared/crud-table";
import { DateModel } from "../_models/date.model";
import { UserModel } from "../_models/user.model";
import { DocumentsService } from "../_services/documents.service";

@Component({
    selector: 'app-documents-module',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent
    implements
    OnInit,
    OnDestroy,
    ICreateAction,
    IEditAction {
    paginator: PaginatorState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    dateIni: DateModel;
    dateFin: DateModel;
    private subscriptions: Subscription[] = []; 

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public _documentsService: DocumentsService
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.searchForm();
        this._documentsService.fetch();
        this.paginator = this._documentsService.paginator;
        const sb = this._documentsService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            numDoc: [''],
            beneficiary: [''],
            dateIn: [''],
            dateFn: [''],
            pending: [''],
        });

        const searchNumDoc = this.searchGroup.controls.numDoc.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchNumDoc(val));

        this.subscriptions.push(searchNumDoc);


        const searchBeneficiary = this.searchGroup.controls.beneficiary.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchBeneficiary(val));

        this.subscriptions.push(searchBeneficiary);

        const searchDateIn = this.searchGroup.controls.dateIn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateIn);


        const searchDateFn = this.searchGroup.controls.dateFn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateFn);

        const searchPending = this.searchGroup.controls.pending.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchPending(val));
            
        this.subscriptions.push(searchPending);
    }

    searchNumDoc(searchTerm: string) {
        this._documentsService.patchState({ searchTerm });
    }

    searchBeneficiary(searchAux1: string) {
        this._documentsService.patchState({ searchAux1 });
    }

    searchDate() {
        this.dateIni = this.searchGroup.get('dateIn').value;
        this.dateFin = this.searchGroup.get('dateFn').value;

        if (this.dateIni && this.dateFin) {
            let searchAux2 = this.dateIni.year + "-" + 
            (this.dateIni.month.toString().length > 1 ? this.dateIni.month : ("0" + this.dateIni.month)) + "-" + 
            (this.dateIni.day.toString().length > 1 ? this.dateIni.day : ("0" + this.dateIni.day)) ;
            let searchAux3 =    this.dateFin.year + "-" + 
            (this.dateFin.month.toString().length > 1 ? this.dateFin.month : ("0" + this.dateFin.month)) + "-" + 
            (this.dateFin.day.toString().length > 1 ? this.dateFin.day : ("0" + this.dateFin.day));
            this._documentsService.patchState({ searchAux2, searchAux3 });
        }

    }

    searchPending(searchAux4: string) {
        this._documentsService.patchState({ searchAux4 });
    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._documentsService.patchState({ paginator });
    }

    // form actions
    create() {
        this.edit(undefined);
    }

    edit($_document: DocumentModel) {
       
    }

    changePassword($_document: DocumentModel) {
        
    }

    enableDisabled($_document: DocumentModel) {
        
    }

}
