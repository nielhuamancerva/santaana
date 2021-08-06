import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPaymentModalComponent } from './ticket-payment-modal.component';

describe('TicketPaymentModalComponent', () => {
  let component: TicketPaymentModalComponent;
  let fixture: ComponentFixture<TicketPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
