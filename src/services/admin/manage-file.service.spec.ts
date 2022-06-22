/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageFileService } from './manage-file.service';

describe('Service: ManageFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageFileService]
    });
  });

  it('should ...', inject([ManageFileService], (service: ManageFileService) => {
    expect(service).toBeTruthy();
  }));
});
