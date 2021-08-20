import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInternalUserComponent } from './list-internal-user.component';

describe('ListInternalUserComponent', () => {
  let component: ListInternalUserComponent;
  let fixture: ComponentFixture<ListInternalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInternalUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInternalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
