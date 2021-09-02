import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRepositoryService } from '../../../_services-repository/user-repository.service';
import { TaskHTTPServiceDomain } from '../../../_services/task-domain.service';

@Component({
    selector: 'app-modal-task',
    templateUrl: './modal-task.component.html'
})

export class ModalTaskComponent implements OnInit {
    public isLoadingSearchDni=false;
    public SearchDni: number;
    formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private taskService: TaskHTTPServiceDomain,
        private userService: UserRepositoryService
    ) { }

    ngOnInit(): void {
        this.loadForm();
    }

    save(){
        const formValues = this.formGroup.value;
        this.taskService.CreateTask(formValues);
        console.log("enviando");
        this.formGroup.reset();
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            user_created: ['', Validators.compose([Validators.required])],
            user_asigned: ['753a9458-2e42-4877-9f99-ce79b9dce992', Validators.compose([Validators.required])],
            title: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            expiration: ['20210915', Validators.compose([Validators.required])],
            completed: [0, Validators.compose([Validators.required])],
            fl_enabled: [1, Validators.compose([Validators.required])],
            fl_deleted: [0, Validators.compose([Validators.required])],
            fullname: [''],
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