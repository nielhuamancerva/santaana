import { BoxSquareModel } from './../_models/boxsquare.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PaginatorState } from "src/app/_metronic/shared/crud-table";
import { DateModel } from "../_models/date.model";
import { BoxSquaresService } from "../_services/boxsquares.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditBoxSquareModalComponent } from './components/edit-boxsquare-modal.component';


@Component({
    selector: 'app-boxsquares-module',
    templateUrl: './boxsquares.component.html',
    styleUrls: ['./boxsquares.component.scss'],
})
export class BoxSquaresComponent
    implements
    OnInit,
    OnDestroy {
    paginator: PaginatorState;
    isLoading: boolean;
    searchGroup: FormGroup;
    dateIni: DateModel;
    dateFin: DateModel;
    private subscriptions: Subscription[] = []; 

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public _boxSquaresService: BoxSquaresService,
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.searchForm();
        this._boxSquaresService.fetch();
        this.paginator = this._boxSquaresService.paginator;
        const sb = this._boxSquaresService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            state: [''],
            agent: [''],
            dateIn: [''],
            dateFn: [''],
        });

        
        const searchState = this.searchGroup.controls.state.valueChanges
        .pipe(
            debounceTime(150),
            distinctUntilChanged()
        )
        .subscribe((val) => this.searchState(val));

        this.subscriptions.push(searchState);

        const searchBeneficiary = this.searchGroup.controls.agent.valueChanges
        .pipe(
            debounceTime(150),
            distinctUntilChanged()
        )
        .subscribe((val) => this.searchAgent(val));

        this.subscriptions.push(searchBeneficiary);

        const searchDateIn = this.searchGroup.controls.dateIn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateIn);

        const searchDateFn = this.searchGroup.controls.dateFn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateFn);
    }

    searchState(searchAux10: string) {
        this._boxSquaresService.patchState({ searchAux10 });
    }

    searchAgent(searchTerm: string) {
        this._boxSquaresService.patchState({ searchTerm });
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
            this._boxSquaresService.patchState({ searchAux3, searchAux4 });
        }

    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._boxSquaresService.patchState({ paginator });
    }

 
    edit(boxSquare: BoxSquareModel) {
        const modalRef = this.modalService.open(EditBoxSquareModalComponent, { size: 'lg', backdrop : 'static',
        keyboard : false });
        modalRef.componentInstance.$_boxSquare = boxSquare;
        modalRef.result.then(() =>
            this._boxSquaresService.fetch(),
            () => { }
        );
    }





}
