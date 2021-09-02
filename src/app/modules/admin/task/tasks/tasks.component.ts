import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TareaModel } from '../../_models/Tarea.model';
import { TaskRepositoryService } from '../../_services-repository/task-repository.service';
import { ModalTaskComponent } from './modal-task/modal-task.component'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
    $_task:TareaModel;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        private tasksService: TaskRepositoryService,
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }
    loadTasks(){
        const sbTaks = this.tasksService.getAllTasks().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_task) => {
    
            this.$_task = _task;
            console.log(this.$_task);
        });
        this.subscriptions.push(sbTaks);
  }

    openModal() {
        this.modalService.open(ModalTaskComponent, { size: 'xl' });
    }
}
