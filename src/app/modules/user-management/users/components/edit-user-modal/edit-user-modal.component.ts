import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, tap } from 'rxjs/operators';
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
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {

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

}
