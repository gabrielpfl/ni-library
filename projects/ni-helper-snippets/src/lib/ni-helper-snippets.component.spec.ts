import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiHelperSnippetsComponent } from './ni-helper-snippets.component';

describe('NiHelperSnippetsComponent', () => {
  let component: NiHelperSnippetsComponent;
  let fixture: ComponentFixture<NiHelperSnippetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiHelperSnippetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiHelperSnippetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
