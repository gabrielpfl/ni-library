import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiComponentsComponent } from './ni-components.component';

describe('NiComponentsComponent', () => {
  let component: NiComponentsComponent;
  let fixture: ComponentFixture<NiComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
