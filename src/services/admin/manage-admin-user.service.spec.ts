/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageAdminUserService } from './manage-admin-user.service';

describe('Service: ManageAdminUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageAdminUserService]
    });
  });

  it('should ...', inject([ManageAdminUserService], (service: ManageAdminUserService) => {
    expect(service).toBeTruthy();
  }));
});
