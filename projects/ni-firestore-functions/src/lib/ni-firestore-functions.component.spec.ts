import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiFirestoreFunctionsComponent } from './ni-firestore-functions.component';

describe('NiFirestoreFunctionsComponent', () => {
  let component: NiFirestoreFunctionsComponent;
  let fixture: ComponentFixture<NiFirestoreFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiFirestoreFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiFirestoreFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
