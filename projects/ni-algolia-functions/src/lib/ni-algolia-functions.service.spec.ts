import { TestBed } from '@angular/core/testing';

import { NiAlgoliaFunctionsService } from './ni-algolia-functions.service';

describe('NiAlgoliaFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiAlgoliaFunctionsService = TestBed.get(NiAlgoliaFunctionsService);
    expect(service).toBeTruthy();
  });
});
