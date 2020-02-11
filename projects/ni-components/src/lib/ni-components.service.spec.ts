import { TestBed } from '@angular/core/testing';

import { NiComponentsService } from './ni-components.service';

describe('NiComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiComponentsService = TestBed.get(NiComponentsService);
    expect(service).toBeTruthy();
  });
});
