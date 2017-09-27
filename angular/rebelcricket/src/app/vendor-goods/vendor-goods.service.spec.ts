import { TestBed, inject } from '@angular/core/testing';

import { VendorGoodsService } from './vendor-goods.service';

describe('VendorGoodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorGoodsService]
    });
  });

  it('should be created', inject([VendorGoodsService], (service: VendorGoodsService) => {
    expect(service).toBeTruthy();
  }));
});
