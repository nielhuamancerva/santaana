import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TareaModel } from '../../../_models/Tarea.model';
import { UserRepositoryService } from '../../../_services-repository/user-repository.service';
import { TaskHTTPServiceDomain } from '../../../_services/task-domain.service';

const EMPTY_TASK: TareaModel = {
    id:undefined,
    user_created: '',
    user_asigned: '',
    title: '',
    description: '',
    expiration: '',
    completed: 0,
    fl_enabled: 1,
    fl_deleted: 0
};

@Component({
    selector: 'app-modal-task',
    templateUrl: './modal-task.component.html'
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
        private userService: UserRepositoryService,
    ) { }

    ngOnInit(): void {
        this.loadTaks();
    }

    loadTaks() {
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
            const formValues = this.formGroup.value;
            this.taskService.CreateTask(formValues);
     
          }
           
        this.formGroup.reset();
    }

    buildMyForm() {
        
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            user_created: ['', Validators.compose([Validators.required])],
            user_asigned: [this.passedData.user_asigned, Validators.compose([Validators.required])],
            title: [this.passedData.title, Validators.compose([Validators.required])],
            description: [this.passedData.description, Validators.compose([Validators.required])],
            expiration: [this.passedData.expiration, Validators.compose([Validators.required])],
            completed: [0, Validators.compose([Validators.required])],
            fl_enabled: [1, Validators.compose([Validators.required])],
            fl_deleted: [0, Validators.compose([Validators.required])],
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
        fullname: item.name+" "+item.secondName+" "+item.lastName+" "+item.secondLastName,
        user_asigned: item.id,
           
        });
        this.isLoadingSearchDni=false;
    }
}