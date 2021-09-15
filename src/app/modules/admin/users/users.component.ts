import { HasherUserModalComponent } from './components/hasher-user-modal/hasher-user-modal.component';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ICreateAction, IEditAction, PaginatorState } from "src/app/_metronic/shared/crud-table";
import { UserModel } from "../_models/user.model";
import { UsersService } from "../_services/users.service";
import { EditUserModalComponent } from "./components/edit-user-modal/edit-user-modal.component";



@Component({
    selector: 'app-users-module',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent
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
        public _userService: UsersService
    ) { }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this._userService.fetch();
        this.paginator = this._userService.paginator;
        const sb = this._userService.isLoading$.subscribe(res => this.isLoading = res);
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

        this._userService.patchState({ filter });
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
        this._userService.patchState({ searchTerm });
    }

    searchName(searchAux1: string) {
        this._userService.patchState({ searchAux1 });
    }


    // pagination
    paginate(paginator: PaginatorState) {
        this._userService.patchState({ paginator });
    }

    // form actions
    create() {
        this.edit(undefined);
    }

    edit(id: UserModel) {
        const modalRef = this.modalService.open(EditUserModalComponent, { size: 'lg', backdrop : 'static',
        keyboard : false });
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
            this._userService.fetch(),
            () => { }
        );
    }

    changePassword($_user: UserModel) {
        const modalRef = this.modalService.open(HasherUserModalComponent, { size: 'sm', backdrop : 'static',
        keyboard : false });
        modalRef.componentInstance.$_user = $_user;
        modalRef.result.then(() =>
            this._userService.fetch(),
            () => { }
        );
    }

    enableDisabled($_user: UserModel) {
        const enableDisabled = this._userService.enableDisabled($_user.id, $_user).subscribe(
            response => {
                if (response.success) {
                    this._userService.fetch();
                }
            }
        );

        this.subscriptions.push(enableDisabled);
    }

}
