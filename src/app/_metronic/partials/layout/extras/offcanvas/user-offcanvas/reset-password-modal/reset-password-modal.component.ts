import { Component, OnInit } from '@angular/core';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService, UserModel, ConfirmPasswordValidator } from '../../../../../../../modules/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent implements OnInit {

  formGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

   loadForm() {
     this.formGroup = this.fb.group({
       currentPassword: ['hola'],
       password: ['', Validators.compose([Validators.required])],
       cPassword: ['', Validators.compose([Validators.required])]
     }, {
       validator: ConfirmPasswordValidator.MatchPassword
     });
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
  showLeftBar(){
    var el = document.getElementById('kt_quick_user');
    el.classList.add("offcanvas-on");
  }
}
