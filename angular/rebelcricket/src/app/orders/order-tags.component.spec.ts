import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTagsComponent } from './order-tags.component';

describe('OrderTagsComponent', () => {
  let component: OrderTagsComponent;
  let fixture: ComponentFixture<OrderTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
