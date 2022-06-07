/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RightFormComponent } from './right-form.component';

describe('RightFormComponent', () => {
  let component: RightFormComponent;
  let fixture: ComponentFixture<RightFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
