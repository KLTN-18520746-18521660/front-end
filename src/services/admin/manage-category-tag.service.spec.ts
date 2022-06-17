/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageCategoryTagService } from './manage-category-tag.service';

describe('Service: ManageCategoryTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageCategoryTagService]
    });
  });

  it('should ...', inject([ManageCategoryTagService], (service: ManageCategoryTagService) => {
    expect(service).toBeTruthy();
  }));
});
