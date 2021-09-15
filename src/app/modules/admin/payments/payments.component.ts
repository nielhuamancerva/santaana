import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ICreateAction, IEditAction, PaginatorState } from "src/app/_metronic/shared/crud-table";
import { EditUserModalComponent } from "../users/components/edit-user-modal/edit-user-modal.component";
import { HasherUserModalComponent } from "../users/components/hasher-user-modal/hasher-user-modal.component";
import { DateModel } from "../_models/date.model";
import { UserModel } from "../_models/user.model";
import { PaymentsService } from "../_services/payments.service";


@Component({
    selector: 'app-payments-module',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent
    implements
    OnInit,
    OnDestroy {
    paginator: PaginatorState;
    isLoading: boolean;
    searchGroup: FormGroup;
    dateIni: DateModel;
    dateFin: DateModel;
    private subscriptions: Subscription[] = []; 
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    constructor(
        private fb: FormBuilder,
        public _paymentsService: PaymentsService,
        private router: Router
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.searchForm();
        this._paymentsService.fetch();
        this.paginator = this._paymentsService.paginator;
        const sb = this._paymentsService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            beneficiary: [''],
            dateIn: [''],
            dateFn: [''],
        });

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
    }

    searchBeneficiary(searchTerm: string) {
        this._paymentsService.patchState({ searchTerm });
    }

    searchDate() {
        this.dateIni = this.searchGroup.get('dateIn').value;
        this.dateFin = this.searchGroup.get('dateFn').value;

        if (this.dateIni && this.dateFin) {
            let searchAux3 = this.dateIni.year + "-" + 
            (this.dateIni.month.toString().length > 1 ? this.dateIni.month : ("0" + this.dateIni.month)) + "-" + 
            (this.dateIni.day.toString().length > 1 ? this.dateIni.day : ("0" + this.dateIni.day)) ;
            let searchAux4 =    this.dateFin.year + "-" + 
            (this.dateFin.month.toString().length > 1 ? this.dateFin.month : ("0" + this.dateFin.month)) + "-" + 
            (this.dateFin.day.toString().length > 1 ? this.dateFin.day : ("0" + this.dateFin.day));
            this._paymentsService.patchState({ searchAux3, searchAux4 });
        }

    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._paymentsService.patchState({ paginator });
    }

 
    create() {
        this.router.navigateByUrl('/admin/payment');
    }





}
