/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageRightService } from './manage-right.service';

describe('Service: ManageRight', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageRightService]
    });
  });

  it('should ...', inject([ManageRightService], (service: ManageRightService) => {
    expect(service).toBeTruthy();
  }));
});
