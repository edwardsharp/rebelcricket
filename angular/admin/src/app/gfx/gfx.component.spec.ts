import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GfxComponent } from './gfx.component';

describe('GfxComponent', () => {
  let component: GfxComponent;
  let fixture: ComponentFixture<GfxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GfxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
