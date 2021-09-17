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
    templateUrl: './modal-tasks.component.html'
})

export class ModalTaskComponent implements OnInit {
    passedData: TareaModel;
    public isLoadingSearchDni=false;
    public SearchDni: number;
    formGroup: FormGroup;
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
            this.passedData = EMPTY_TASK;
            this.loadForm();
        }else{
            console.log(this.passedData);
            this.loadForm();
        }
    }

    save(){
        const formValues = this.formGroup.value;
    
        console.log(this.passedData.id);
        if (this.passedData.id!=undefined) {
        console.log("actualizar");
        const formValues = this.formGroup.value;
        this.taskService.UpdateTask(formValues);
        } else {
            console.log("create");
            console.log(this.formGroup.value);
            const formValues = this.formGroup.value;
            this.taskService.CreateTask(formValues);
        }
        this.formGroup.reset();
        this.modal.close();
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            user_created: ['', Validators.compose([Validators.required])],
            user_asigned: ['', Validators.compose([Validators.required])],
            title: [this.passedData.title, Validators.compose([Validators.required])],
            description: [this.passedData.description, Validators.compose([Validators.required])],
            expiration: [this.passedData.expiration, Validators.compose([Validators.required])],
            completed: [0, Validators.compose([Validators.required])],
            fl_enabled: [1, Validators.compose([Validators.required])],
            fl_deleted: [0, Validators.compose([Validators.required])],
            asigned_id:[''],
            fullname: [''],
            id: [this.passedData.id],
        });
    }

    mostrar(InputSearchDni){
        console.log(InputSearchDni);
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