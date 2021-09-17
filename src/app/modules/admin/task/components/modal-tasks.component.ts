import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskHTTPServiceDomain } from '../../_domain/task-domain.service';
import { TareaModel } from '../../_models/Taks.model';
import { UsersService } from '../../_services/users.service';

const EMPTY_TASK: TareaModel = {
    id:undefined,
    user_created: undefined,
    user_asigned: undefined,
    title: '',
    description: '',
    expiration: '',
    completed: 0,
    fl_enabled: 1,
    fl_deleted: 0,
    asigned_id:''
};

@Component({
    selector: 'app-modal-task',
    templateUrl: './modal-tasks.component.html',
    styleUrls: ['./modal-tasks.component.scss'],
})

export class ModalTaskComponent implements OnInit {
    passedData: TareaModel;
    public isLoadingSearchDni=false;
    public SearchDni: number;
    formGroup: FormGroup;
    fullname: string;
    constructor(
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private taskService: TaskHTTPServiceDomain,
        private userService: UsersService,
    ) { }

    ngOnInit(): void {
        this.loadTask();
    }

    loadTask() {
        if(this.passedData == undefined){
            console.log("aqui if")
            this.passedData = EMPTY_TASK;
            this.fullname = '';
            this.loadForm();
        }else{
            console.log("aqui else")
            console.log(this.passedData)
            this.fullname = this.passedData.user_asigned.name + ' ' + this.passedData.user_asigned.lastName;
            this.loadForm();
        }
    }

    save(){
        const formValues = this.formGroup.value;
        console.log(formValues)
        if (this.passedData.id!=undefined) {
            return this.taskService.UpdateTask(formValues).subscribe((response) => {
                this.formGroup.reset(),
                this.modal.close()
            });
        } else {
            this.taskService.CreateTask(formValues).subscribe((response) => {
                this.formGroup.reset(),
                this.modal.close()
            });
        }
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            user_created: [this.passedData.user_created, Validators.compose([Validators.required])],
            user_asigned: [this.passedData.user_asigned, Validators.compose([Validators.required])],
            title: [this.passedData.title, Validators.compose([Validators.required])],
            description: [this.passedData.description, Validators.compose([Validators.required])],
            expiration: [this.passedData.expiration, Validators.compose([Validators.required])],
            completed: [0, Validators.compose([Validators.required])],
            fl_enabled: [1, Validators.compose([Validators.required])],
            fl_deleted: [0, Validators.compose([Validators.required])],
            fullname: [this.fullname],
            id: [this.passedData.id]
        });
    }

    mostrar(InputSearchDni){
        this.isLoadingSearchDni=true;
        if(InputSearchDni == ''){
            this.isLoadingSearchDni=false;
        }else{
            this.userService.getByDocumentUser(InputSearchDni).pipe(
         
                catchError((errorMessage) => {
                    return of(errorMessage);
                })
            ).subscribe((response) => {
                    this.SearchDni = response.content;
            });
        }
    }
    selectBeneficiary(item){
        this.formGroup.patchValue({
        fullname: item.name+" "+item.lastName,
        user_asigned: item,
        user_created: item,
        asigned_id: item.id,
        });
        this.isLoadingSearchDni=false;
    }
}