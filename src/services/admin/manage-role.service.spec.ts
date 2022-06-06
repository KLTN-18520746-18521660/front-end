/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageRoleService } from './manage-role.service';

describe('Service: ManageRole', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageRoleService]
    });
  });

  it('should ...', inject([ManageRoleService], (service: ManageRoleService) => {
    expect(service).toBeTruthy();
  }));
});
