import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiAlgoliaFunctionsComponent } from './ni-algolia-functions.component';

describe('NiAlgoliaFunctionsComponent', () => {
  let component: NiAlgoliaFunctionsComponent;
  let fixture: ComponentFixture<NiAlgoliaFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiAlgoliaFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiAlgoliaFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
