import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { TareaModel } from '../../_models/Tarea.model';
import { TaskRepositoryService } from '../../_services-repository/task-repository.service';
import { ModalTaskComponent } from './modal-task/modal-task.component'

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
    isLoading:boolean;
    $_task: Observable<TareaModel[]>;
    constructor(
        private modalService: NgbModal,
        private tasksService: TaskRepositoryService,
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(){
        this.$_task=this.tasksService.getAllTasks().pipe(
            map((_beneficiary)=>_beneficiary.content,
            finalize(()=>this.isLoading=false)
            )
        )
    }

    openModal() {
        this.modalService.open(ModalTaskComponent, { size: 'xl' });
    }

    editTask(task: TareaModel){
        const modalRef = this.modalService.open(ModalTaskComponent, { size: 'xl' }).componentInstance;
        modalRef.passedData = task;
    }
}