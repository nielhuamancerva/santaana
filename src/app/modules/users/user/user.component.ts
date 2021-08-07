
import {Component,OnInit, Inject} from '@angular/core';
import { UserModalComponent } from './components/user-modal/user-modal.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


    animal: string;
    name: string;
  constructor() { }

  ngOnInit(): void {
  }
 

  
}
