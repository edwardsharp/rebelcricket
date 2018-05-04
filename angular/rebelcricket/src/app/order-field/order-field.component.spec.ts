import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFieldComponent } from './order-field.component';

describe('OrderFieldComponent', () => {
  let component: OrderFieldComponent;
  let fixture: ComponentFixture<OrderFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
