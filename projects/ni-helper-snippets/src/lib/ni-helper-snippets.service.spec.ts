import { TestBed } from '@angular/core/testing';

import { NiHelperSnippetsService } from './ni-helper-snippets.service';

describe('NiHelperSnippetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiHelperSnippetsService = TestBed.get(NiHelperSnippetsService);
    expect(service).toBeTruthy();
  });
});
