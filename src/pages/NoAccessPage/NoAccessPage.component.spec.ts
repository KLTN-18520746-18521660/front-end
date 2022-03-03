/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoAccessPageComponent } from './NoAccessPage.component';

describe('NoAccessPageComponent', () => {
  let component: NoAccessPageComponent;
  let fixture: ComponentFixture<NoAccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
