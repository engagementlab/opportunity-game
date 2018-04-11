import { TestBed, inject } from '@angular/core/testing';

import { JsonService } from './tool.service';

describe('JsonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonService]
    });
  });

  it('should be created', inject([JsonService], (service: JsonService) => {
    expect(service).toBeTruthy();
  }));
});
