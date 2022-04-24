/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManagePostService } from './manage-post.service';

describe('Service: ManagePost', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagePostService]
    });
  });

  it('should ...', inject([ManagePostService], (service: ManagePostService) => {
    expect(service).toBeTruthy();
  }));
});
