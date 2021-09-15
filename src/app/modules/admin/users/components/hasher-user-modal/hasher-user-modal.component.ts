import { UserModel } from './../../../_models/user.model';
import { UsersService } from '../../../_services/users.service';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';


import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-hasher-user-modal',
  templateUrl: './hasher-user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HasherUserModalComponent implements OnInit, OnDestroy {
 
    @Input() $_user: UserModel;
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
        
    constructor(public modal: NgbActiveModal,
                private userService: UsersService,
                private fb: FormBuilder) { }

    ngOnInit(): void {
        this.loadFormWithOutInfo();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }



    loadFormWithOutInfo() {
        this.formGroup = this.fb.group({
            hasher: ['', [Validators.required, Validators.minLength(4)]],
            confirmHasher: ['', [Validators.required]],
        });

        this.formGroup.setValidators(this.passwordConfirming())

    }

    passwordConfirming(): ValidatorFn {
        return (group: FormGroup): ValidationErrors => {
            const control1 = group.controls['hasher'];
            const control2 = group.controls['confirmHasher'];
            if (control1.value !== control2.value) {
               control2.setErrors({notEquivalent: true});
            } else {
               control2.setErrors(null);
            }
            return;
      };
    }



    save() {
        const formData = this.formGroup.value;
        const httpResult$ = this.userService.changeHasherRoot(this.$_user.id, formData.hasher, this.$_user).subscribe( response  => {
            if(response.success) {
                this.modal.close();
            }   
        });
        
        this.subscriptions.push(httpResult$);
    }

    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

}