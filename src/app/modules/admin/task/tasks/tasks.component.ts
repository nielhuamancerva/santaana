import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { TareaModel } from '../../_models/Tarea.model';
import { TaskRepositoryService } from '../../_services-repository/task-repository.service';
import { TaskHTTPServiceDomain } from '../../_services/task-domain.service';
import { ModalTaskComponent } from './modal-task/modal-task.component'

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
    isLoading:boolean;
    $_task: Observable<TareaModel[]>;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        public tasksService: TaskRepositoryService,
        public tasksServiceDomain: TaskHTTPServiceDomain,
        
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