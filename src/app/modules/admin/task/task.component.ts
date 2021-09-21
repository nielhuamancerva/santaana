import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { TaskHTTPServiceDomain } from '../_domain/task-domain.service';
import { DateModel } from '../_models/date.model';
import { TareaModel } from '../_models/Taks.model';
import { TasksService } from '../_services/tasks.service';
import { ModalTaskComponent } from './components/modal-tasks.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {

    isLoading:boolean;
    dateIni: DateModel;
    dateFin: DateModel;
    $_task: Observable<TareaModel[]>;
    searchGroup: FormGroup;
    paginator: PaginatorState;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        public _tasksService: TasksService,
    ) { }

    ngOnInit(): void {
        this.searchForm();
        this._tasksService.fetch();
        this.paginator = this._tasksService.paginator;
        const sb = this._tasksService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
 
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            title: [''],
            user: [''],
            dateIn: [''],
            dateFn: [''],
        });

        const searchDateIn = this.searchGroup.controls.dateIn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateIn);


        const searchDateFn = this.searchGroup.controls.dateFn.valueChanges
        .subscribe(() => this.searchDate());

        this.subscriptions.push(searchDateFn);

        const searchTitle = this.searchGroup.controls.title.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchTitle(val));

        this.subscriptions.push(searchTitle);

        const searchUser = this.searchGroup.controls.user.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchUser(val));
            
        this.subscriptions.push(searchUser);
    }

    searchDate() {
        this.dateIni = this.searchGroup.get('dateIn').value;
        this.dateFin = this.searchGroup.get('dateFn').value;

        if (this.dateIni && this.dateFin) {
            let searchAux2 = (this.dateIni.day.toString().length > 1 ? this.dateIni.day : ("0" + this.dateIni.day))+"/"+(this.dateIni.month.toString().length > 1 ? this.dateIni.month : ("0" + this.dateIni.month))+"/"+this.dateIni.year;
            let searchAux3 = (this.dateFin.day.toString().length > 1 ? this.dateFin.day : ("0" + this.dateFin.day))+"/"+(this.dateFin.month.toString().length > 1 ? this.dateFin.month : ("0" + this.dateFin.month))+"/"+this.dateFin.year;
            this._tasksService.patchState({ searchAux2, searchAux3 });
        }

    }

    searchUser(searchTerm: string) {
        this._tasksService.patchState({ searchTerm });
    }

    searchTitle(searchAux1: string) {
        this._tasksService.patchState({ searchAux1 });
    }

    paginate(paginator: PaginatorState) {
        this._tasksService.patchState({ paginator });
    }

    openModal() {
        this.editTask(undefined);
    }

    editTask(task: TareaModel) {
        const modalRef = this.modalService.open(ModalTaskComponent, { size: 'xl' })
        modalRef.componentInstance.passedData = task;
        modalRef.result.then(() =>
            this._tasksService.fetch(),
            () => { }
        );
    }
}