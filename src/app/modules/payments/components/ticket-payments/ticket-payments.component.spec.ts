import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPaymentsComponent } from './ticket-payments.component';

describe('TicketPaymentsComponent', () => {
  let component: TicketPaymentsComponent;
  let fixture: ComponentFixture<TicketPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
