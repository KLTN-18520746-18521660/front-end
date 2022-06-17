/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PostTimlineComponent } from './post-timline.component';

describe('PostTimlineComponent', () => {
  let component: PostTimlineComponent;
  let fixture: ComponentFixture<PostTimlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTimlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTimlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
