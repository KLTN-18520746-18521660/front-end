/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageConfigService } from './manage-config.service';

describe('Service: ManageConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageConfigService]
    });
  });

  it('should ...', inject([ManageConfigService], (service: ManageConfigService) => {
    expect(service).toBeTruthy();
  }));
});
