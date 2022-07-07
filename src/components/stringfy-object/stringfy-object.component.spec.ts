/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StringfyObjectComponent } from './stringfy-object.component';

describe('StringfyObjectComponent', () => {
  let component: StringfyObjectComponent;
  let fixture: ComponentFixture<StringfyObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringfyObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringfyObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
