import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { TaskHTTPServiceDomain } from '../_domain/task-domain.service';
import { TareaModel } from '../_models/Taks.model';
import { TaskRepositoryService } from '../_services/tasks.service';
import { ModalTaskComponent } from './components/modal-tasks.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {

    isLoading:boolean;
    $_task: Observable<TareaModel[]>;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        public tasksService: TaskRepositoryService,
        public tasksServiceDomain: TaskHTTPServiceDomain
        
    ) { }

    ngOnInit(): void {
        this.loadTasks();
        const sb = this.tasksServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.tasksServiceDomain.fetch();


        const sbtask = this.tasksService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sbtask);
        this.tasksService.AllTaks();
 
    }

    loadTasks(){
        this.isLoading=true;
        
        this.$_task=this.tasksService.getAllTasks().pipe(
            map((_beneficiary)=>_beneficiary.content,
            finalize(()=>this.isLoading=false)
            )
        )
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