import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { User } from '../../../models/user.model';


const EMPTY_USER: User ={
    id: undefined,
    firstName: '',
    lastName: '',
    firstApellido: '',
    lastApellido: '',
    businessName: '',
    documentType: '',
    document: '',
    firstPhone: '',
    secondPhone: '',
    email: '',
    ubigeo: '',
    address: '',
    latitude: '',
    longitude: '',
    userName: ''
};

interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})

export class EditUserModalComponent implements OnInit {
  @Input() id: number;

  file: File;
  photoSelected1:  String | ArrayBuffer;
  photoSelected2:  String | ArrayBuffer;
  photoSelected3:  String | ArrayBuffer;
  photoSelected4:  String | ArrayBuffer;
  photoSelected5:  String | ArrayBuffer;
  isRucSelected: Boolean;
  isDniSelected: Boolean;
  formGroup: FormGroup;
  user: User;
  userName: String = 'royer';
  
  constructor(
    private fb: FormBuilder, 
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }
  
  loadUser() {
    if (!this.id) {
      this.user = EMPTY_USER;
      this.loadForm();
    }  
  }

  asignUserNamePartOne(){
    if(this.user.firstName.length > 3){
      let texto = this.user.firstName.substr(0,3);
      this.userName = texto;
    }
  }

  asignUserNamePartTwo(){
    if(this.user.lastName.length > 3){
      console.log("ejecuta la 2da parte")
      let texto = this.user.lastName.substr(0,3);
      this.userName = this.userName + texto;
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      firstName: [this.user.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.user.lastName, Validators.compose([Validators.required])],
      firstApellido: [this.user.firstApellido, Validators.compose([Validators.required])],
      lastApellido: [this.user.lastApellido, Validators.compose([Validators.required])],
      businessName: [this.user.businessName, Validators.compose([Validators.required])],
      document: [this.user.document, Validators.compose([Validators.required])],
      firstPhone: [this.user.firstPhone, Validators.compose([Validators.required])],
      secondPhone: [this.user.secondPhone, Validators.compose([Validators.required])],
      email: [this.user.email, Validators.compose([Validators.required])],
      ubigeo: [this.user.ubigeo, Validators.compose([Validators.required])],
      address: [this.user.address, Validators.compose([Validators.required])],
      longitude: [this.user.longitude, Validators.compose([Validators.required])],
      latitude: [this.user.latitude, Validators.compose([Validators.required])],
      userName: [this.user.userName, Validators.compose([Validators.required])]
    });
  }

  desactivar(e){
    let valor = e.currentTarget.value;
    if(valor == '6'){
      this.isRucSelected = true;
      this.isDniSelected = false;
    }else if(valor == '1'){
      this.isDniSelected = true;
      this.isRucSelected = false;
    }else if(valor != '1' || valor != '6'){
      this.isDniSelected = false;
      this.isRucSelected = false;
    }
    console.log(this.isRucSelected);
  }
  
  getPic() {
    // if (!this.user.pic) {
       return `url('./assets/media/users/100_1.jpg')`;
   //  }
 
   //  return `url('${this.user.pic}')`;
   }
 
  deletePic() {
   //  this.user.pic = '';
  }

save()
{
  
}

  btn1(event:HtmlInputEvent): void{
    if(event.target.files && event.target.files[0])
    {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload= e => this.photoSelected1 =reader.result;
      reader.readAsDataURL(this.file);
    }
  }
  btn2(event:HtmlInputEvent): void{
    if(event.target.files && event.target.files[0])
    {
        this.file = <File>event.target.files[0];
        const reader = new FileReader();
        reader.onload= e => this.photoSelected2 =reader.result;
        reader.readAsDataURL(this.file);
      }
  }
  btn3(event:HtmlInputEvent): void{
    if(event.target.files && event.target.files[0])
    {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload= e => this.photoSelected3=reader.result;
      reader.readAsDataURL(this.file);
    }
  }
  btn4(event:HtmlInputEvent): void{
    if(event.target.files && event.target.files[0])
    {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload= e => this.photoSelected4 =reader.result;
      reader.readAsDataURL(this.file);
    }
  }
  btn5(event:HtmlInputEvent): void{
    if(event.target.files && event.target.files[0])
    {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload= e => this.photoSelected5 =reader.result;
      reader.readAsDataURL(this.file);
    
    }
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
}
