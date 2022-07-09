import { addDay } from 'utils/commonFunction';
import { minusDay, getDiffDay, formatDate, getWeekOfDay, getFirstDayOfWeek } from 'utils/commonFunction';
import { ApiParams } from 'models/api.model';
import { StatisticService } from 'services/admin/statistic.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import _ from 'lodash';

export interface ChartPost {
  created?: number;
  approved?: number;
}

export interface ChartPostData {
  [key: string]: ChartPost;
}

@Component({
  selector: 'app-StatisticPostPage',
  templateUrl: './StatisticPostPage.component.html',
  styleUrls: ['./StatisticPostPage.component.scss']
})
export class StatisticPostPageComponent implements OnInit {

  getChartSubscription: Subscription;

  data: ChartPostData;

  dataChart: any;

  rangeDates: Date[];

  range: number;

  maxDate: Date = new Date();

  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  isLoading: boolean = false;

  type: 'line' | 'bar' = 'bar';
  types = ['bar', 'line'];

  view: 'day' | 'week' | 'month' | 'year' = 'day';
  views = ['day', 'week', 'month', 'year'];

  constructor(
    private statisticService: StatisticService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.rangeDates = [minusDay(14), new Date()];

    //get date bettween 2 value in rangeDates
    this.range = getDiffDay(this.rangeDates[0], this.rangeDates[1], false);

    this.getChartData();
  }

  getChartData() {
    this.data = {};
    this.dataChart = {};
    this.isLoading = true;
    if (this.getChartSubscription) {
      this.getChartSubscription.unsubscribe();
    }

    const params: ApiParams = {
      start_date: formatDate(this.rangeDates[0], 'DD/MM/YYYY'),
      end_date: formatDate(this.rangeDates[1], 'DD/MM/YYYY'),
    };

    this.getChartSubscription = this.statisticService.getStatisticPostChart(params).subscribe(
      (res) => {
        if (_.isEmpty(res.data.chart)) {
          this.messageService.add({
            severity: 'warn',
            summary: 'No data in this range',
            detail: 'Please select another range',
          });
        }
        this.data = res.data.chart;
        this.isLoading = false;
        this.dataChart = this.convertToDataChart(this.data);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error,
          detail: err.message
        });
        this.isLoading = false;
      }
    );
  }

  convertToDataChart(data: any) {
    // group by date, week, month, year
    let dataChart: ChartPostData = {};
    if (this.view === 'day') {
      dataChart = data;
    }
    else {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          const arr = key.split('/');
          const date = new Date(+arr[2], +arr[1] - 1, +arr[0]);
          let dateKey = '';
          switch (this.view) {
            case 'month':
              dateKey = `M${date.getMonth() + 1}/${date.getFullYear()}`;
              break;
            case 'week':
              // dateKey = `W${getWeekOfDay(date)}/${date.getFullYear()}`;
              const dateWeek = getFirstDayOfWeek(getWeekOfDay(date), date.getFullYear());
              dateKey = `${formatDate(dateWeek, 'D/M')}-${formatDate(addDay(6, dateWeek), 'D/M/YYYY')}`;
              break;
            case 'year':
              dateKey = `${date.getFullYear()}`;
              break;
            default:
              break;
          }

          if (!dataChart[dateKey]) {
            dataChart[dateKey] = {
              created: element.created,
              approved: element.approved,
            };
          }
          else {
            dataChart[dateKey].created += element.created;
            dataChart[dateKey].approved += element.approved;
          }
        }
      }
      // rename key dataChart for week view
      // if (this.view === 'week') {
      //   for (const key in dataChart) {
      //     const split = key.substring(0, 1).split('/');
      //     const dateWeek = getFirstDayOfWeek(+split[0], +split[1]);
      //     const newKey = `${formatDate(dateWeek, 'DD/MM')}-${formatDate(addDay(6, dateWeek), 'DD/MM/YYYY')}`;
      //     delete Object.assign(dataChart, { [newKey]: dataChart[key] })[key];
      //   }
      // }
    }

    let temp = {
      labels: [...Object.keys(dataChart)],
      datasets: [
        {
          label: 'Created',
          backgroundColor: '#00bcd4',
          borderColor: '#00bcd4',
          fill: false,
          data: Object.values(dataChart).map((item: ChartPost) => item.created),
        },
        {
          label: 'Approved',
          backgroundColor: '#ff9800',
          borderColor: '#ff9800',
          fill: false,
          data: Object.values(dataChart).map((item: ChartPost) => item.approved),
        }
      ]
    };
    return temp;
  }

  onSelectRange(event) {
    this.range = getDiffDay(this.rangeDates[0], this.rangeDates[1], false);
  }

  onChangeType(event) {
    this.dataChart = this.convertToDataChart(this.data);
  }

  groupBy(event) {
    this.dataChart = this.convertToDataChart(this.data);
  }

  onClickView() {
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.range = getDiffDay(this.rangeDates[0], this.rangeDates[1], false);
      this.getChartData();
    }
  }

  ngOnDestroy() {
    if (this.getChartSubscription) {
      this.getChartSubscription.unsubscribe();
    }
  }

}
