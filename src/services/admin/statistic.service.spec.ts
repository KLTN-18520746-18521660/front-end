/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StatisticService } from './statistic.service';

describe('Service: Statistic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatisticService]
    });
  });

  it('should ...', inject([StatisticService], (service: StatisticService) => {
    expect(service).toBeTruthy();
  }));
});
