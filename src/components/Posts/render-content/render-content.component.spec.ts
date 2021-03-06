/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RenderContentComponent } from './render-content.component';

describe('RenderContentComponent', () => {
  let component: RenderContentComponent;
  let fixture: ComponentFixture<RenderContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
