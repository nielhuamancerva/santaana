import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';

import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserModel>;

  constructor(
    private layout: LayoutService, 
    private auth: AuthService,
    private modalService: NgbModal
    ) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  openEditProfileModal() {
    this.editProfile(undefined);
    this.cerrarLeftSideBar();
  }

  editProfile(id: number) {
    const modalRef = this.modalService.open(EditProfileModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;

  }

  openResetPasswordModal() {
    this.editPassword(undefined);
    this.cerrarLeftSideBar();
  }

  editPassword(id: number) {
    const modalRef = this.modalService.open(ResetPasswordModalComponent, { size: 'sm' });
    modalRef.componentInstance.id = id;
  }

  cerrarLeftSideBar(){
    var el = document.getElementById('kt_quick_user_close');
    el.click();
    var user = document.getElementById('kt_quick_user');
    user.classList.remove("offcanvas-on");
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
