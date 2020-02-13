import { TestBed } from '@angular/core/testing';

import { NiAlgoliaService } from './ni-algolia-functions.service';

describe('NiAlgoliaFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiAlgoliaService = TestBed.get(NiAlgoliaService);
    expect(service).toBeTruthy();
  });
});
