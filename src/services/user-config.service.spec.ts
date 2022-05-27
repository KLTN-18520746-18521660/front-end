/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserConfigService } from './user-config.service';

describe('Service: UserConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserConfigService]
    });
  });

  it('should ...', inject([UserConfigService], (service: UserConfigService) => {
    expect(service).toBeTruthy();
  }));
});
