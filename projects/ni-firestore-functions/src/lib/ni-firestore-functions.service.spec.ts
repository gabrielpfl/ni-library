import { TestBed } from '@angular/core/testing';

import { NiFirestoreService } from './ni-firestore-functions.service';

describe('NiFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiFirestoreService = TestBed.get(NiFirestoreService);
    expect(service).toBeTruthy();
  });
});
