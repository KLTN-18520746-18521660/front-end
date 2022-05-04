/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CheckIconComponent } from './check-icon.component';

describe('CheckIconComponent', () => {
  let component: CheckIconComponent;
  let fixture: ComponentFixture<CheckIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
