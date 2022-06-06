/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateEditRoleComponent } from './create-edit-role.component';

describe('CreateEditRoleComponent', () => {
  let component: CreateEditRoleComponent;
  let fixture: ComponentFixture<CreateEditRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
