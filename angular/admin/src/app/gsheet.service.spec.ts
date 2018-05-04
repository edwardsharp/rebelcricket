import { TestBed, inject } from '@angular/core/testing';

import { GsheetService } from './gsheet.service';

describe('GsheetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GsheetService]
    });
  });

  it('should be created', inject([GsheetService], (service: GsheetService) => {
    expect(service).toBeTruthy();
  }));
});
