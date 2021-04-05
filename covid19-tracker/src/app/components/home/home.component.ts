import { HashLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/golobal-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmated = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[] | undefined;
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };

  constructor(private dataService: DataServiceService) {}

  initChart(caseType: string) {

    let dataTable: any = [];
    dataTable.push(["Country", "Cases"]);

    this.globalData?.forEach(cs => {
      let value: any;
      if (caseType == 'c')
        if(cs.confirmed >20000)
          value = cs.confirmed

          if (caseType == 'a')
          if(cs.active >20000)
            value = cs.active

            if (caseType == 'd')
            if(cs.deaths >20000)
              value = cs.deaths

              if (caseType == 'r')
              if(cs.recovered >20000)
                value = cs.recovered

      dataTable.push([
        cs.country , value
      ]);
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500,
        animations: {
          duration: 1000,
          easing: 'out',
          },
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result: any) => {
        console.log(result);
        this.globalData = result;

        this.globalData = result;

        result.forEach((cs: { active: number; confirmed: number; deaths: number; }) => {
          if(!Number.isNaN(cs.confirmed)) {
          this.totalActive += cs.active;
          this.totalConfirmated += cs.confirmed;
          this.totalDeaths += cs.deaths;
          this.totalRecovered += cs.active;
          }
        })

        this.initChart('c');

      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

}
