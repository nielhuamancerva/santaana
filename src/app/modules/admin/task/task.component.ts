import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { TaskHTTPServiceDomain } from '../_domain/task-domain.service';
import { TareaModel } from '../_models/Taks.model';
import { TasksService } from '../_services/tasks.service';
import { ModalTaskComponent } from './components/modal-tasks.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {

    isLoading:boolean;
    $_task: Observable<TareaModel[]>;
    searchGroup: FormGroup;
    paginator: PaginatorState;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        public _tasksService: TasksService,
        public tasksServiceDomain: TaskHTTPServiceDomain
        
    ) { }

    ngOnInit(): void {
        this.searchForm();
        this.tasksServiceDomain.fetch();
        this.paginator = this._tasksService.paginator;
        const sb = this.tasksServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
 
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            title: [''],
            user: [''],
        });

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

    searchUser(searchTerm: string) {
        this._tasksService.patchState({ searchTerm });
    }

    searchTitle(searchAux1: string) {
        this._tasksService.patchState({ searchAux1 });
    }

    paginate(paginator: PaginatorState) {
        
    }


    openModal() {
        const modalRef = this.modalService.open(ModalTaskComponent, { size: 'xl' });
        modalRef.result.then(() =>
      //this.tasksService.getAllTasks(),
    this.tasksServiceDomain.fetch(),
        () => { }
      );

      console.log(this.$_task);
    }

    editTask(task: TareaModel){
        const modalRef = this.modalService.open(ModalTaskComponent, { size: 'xl' })
        modalRef.componentInstance.passedData = task;
        modalRef.result.then(() =>
            //this.tasksService.getAllTasks(),
            this.tasksServiceDomain.fetch(),
            () => { }
        );
    }
}