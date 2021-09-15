import { UserModel } from './../_models/user.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ICreateAction, IEditAction, PaginatorState } from "src/app/_metronic/shared/crud-table";
import { AgentsService } from "../_services/agents.service";
import { EditAgentModalComponent } from "./components/edit-agent-modal/edit-agent-modal.component";
import { HasherAgentModalComponent } from './components/hasher-agent-modal/hasher-agent-modal.component';



@Component({
    selector: 'app-agents-module',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
})
export class AgentsComponent
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
        public _agentService: AgentsService
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this._agentService.fetch();
        this.paginator = this._agentService.paginator;
        const sb = this._agentService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    filterForm() {
        this.filterGroup = this.fb.group({
            state: ['']
        });
        this.subscriptions.push(
            this.filterGroup.controls.state.valueChanges.subscribe(() =>
                this.filter()
            )
        );
    }

    filter() {
        const filter = {};
        const state = this.filterGroup.get('state').value;
        if (state) {
            filter['state'] = state;
        }

        this._agentService.patchState({ filter });
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            docnum: [''],
            name: [''],
        });

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

    searchDocNum(searchTerm: string) {
        this._agentService.patchState({ searchTerm });
    }

    searchName(searchAux1: string) {
        this._agentService.patchState({ searchAux1 });
    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._agentService.patchState({ paginator });
    }

    // form actions
    create() {
        this.edit(undefined);
    }

    edit(id: UserModel) {
        const modalRef = this.modalService.open(EditAgentModalComponent, { size: 'xl', backdrop : 'static',
        keyboard : false });
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
            this._agentService.fetch(),
            () => { }
        );
    }

    changePassword($_user: UserModel) {
        const modalRef = this.modalService.open(HasherAgentModalComponent, { size: 'sm', backdrop : 'static',
        keyboard : false });
        modalRef.componentInstance.$_user = $_user;
        modalRef.result.then(() =>
            this._agentService.fetch(),
            () => { }
        );
    }

    enableDisabled($_user: UserModel) {
        const enableDisabled = this._agentService.enableDisabled($_user.id, $_user).subscribe(
            response => {
                if (response.success) {
                    this._agentService.fetch();
                }
            }
        );

        this.subscriptions.push(enableDisabled);
    }

}
