import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorGoodsImportComponent } from './vendor-goods-import.component';

describe('VendorGoodsImportComponent', () => {
  let component: VendorGoodsImportComponent;
  let fixture: ComponentFixture<VendorGoodsImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorGoodsImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorGoodsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
