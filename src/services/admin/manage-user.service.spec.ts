/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageUserService } from './manage-user.service';

describe('Service: ManageUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageUserService]
    });
  });

  it('should ...', inject([ManageUserService], (service: ManageUserService) => {
    expect(service).toBeTruthy();
  }));
});
