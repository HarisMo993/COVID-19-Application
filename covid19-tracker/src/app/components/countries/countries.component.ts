import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from 'src/app/models/golobal-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[] | undefined;
  countries: any = [];
  totalConfirmated: any = 0;
  totalActive: any = 0;
  totalDeaths: any = 0;
  totalRecovered: any = 0;
  selectedCountryDate: any;
  dateWiseData: any ;
  loading = true;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  }

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country);
        });
      }))
    ).subscribe({
      complete: () => {
        this.updateValues('US');
        this.loading = false;
      }
    });

  }

  updateChart() {
    let dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryDate?.forEach((cs: { cases: any; date: any; }) => {
      dataTable.push([cs.date , cs.cases]);
    });

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      options: {
        height: 500,
        animations: {
          duration: 1000,
          easing: 'out',
          },
        },
      };
    }

      updateValues(country : any){
        console.log(country);
        this.data?.forEach(cs=>{
          if(cs.country == country){
            this.totalActive = cs.active
            this.totalDeaths = cs.deaths
            this.totalRecovered = cs.recovered
            this.totalConfirmated = cs.confirmed
          }
        })
    
        this.selectedCountryDate  = this.dateWiseData[country]
        // console.log(this.selectedCountryData);
        this.updateChart();
        
      }

}
