import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ICreateAction, IEditAction, PaginatorState } from "src/app/_metronic/shared/crud-table";
import { UserModel } from "../_models/user.model";
import { BeneficiariesService } from "../_services/beneficiaries.service";

@Component({
    selector: 'app-beneficiaries-module',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class BeneficiariesComponent
    implements
    OnInit,
    OnDestroy,
    ICreateAction,
    IEditAction {
    paginator: PaginatorState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = []; 

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public _beneficiesService: BeneficiariesService
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this._beneficiesService.fetch();
        this.paginator = this._beneficiesService.paginator;
        const sb = this._beneficiesService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    filterForm() {}

    filter() {}

    searchForm() {
        this.searchGroup = this.fb.group({
            code: [''],
            docnum: [''],
            name: [''],
        });

        const searchCode = this.searchGroup.controls.code.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchCode(val));

        this.subscriptions.push(searchCode);


        const searchDocnum = this.searchGroup.controls.docnum.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchDocNum(val));

        this.subscriptions.push(searchDocnum);

        const searchName = this.searchGroup.controls.name.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchName(val));
            
        this.subscriptions.push(searchName);
    }

    searchCode(searchTerm: string) {
        this._beneficiesService.patchState({ searchTerm });
    }

    searchDocNum(searchAux1: string) {
        this._beneficiesService.patchState({ searchAux1 });
    }

    searchName(searchAux2: string) {
        this._beneficiesService.patchState({ searchAux2 });
    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._beneficiesService.patchState({ paginator });
    }

    // form actions
    create() {
        this.edit(undefined);
    }

    edit(id: UserModel) {
       
    }

    changePassword($_user: UserModel) {
        
    }

    enableDisabled($_user: UserModel) {
        
    }

}
