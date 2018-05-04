import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorGoodsDialogComponent } from './vendor-goods-dialog.component';

describe('VendorGoodsDialogComponent', () => {
  let component: VendorGoodsDialogComponent;
  let fixture: ComponentFixture<VendorGoodsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorGoodsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorGoodsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
