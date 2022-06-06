/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateEditRightComponent } from './create-edit-right.component';

describe('CreateEditRightComponent', () => {
  let component: CreateEditRightComponent;
  let fixture: ComponentFixture<CreateEditRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
