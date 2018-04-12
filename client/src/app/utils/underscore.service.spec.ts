import { TestBed, inject } from '@angular/core/testing';

import { UnderscoreService } from './underscore.service';

describe('UnderscoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnderscoreService]
    });
  });

  it('should be created', inject([UnderscoreService], (service: UnderscoreService) => {
    expect(service).toBeTruthy();
  }));
});
