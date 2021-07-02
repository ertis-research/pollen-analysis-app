import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private service: SharedService,
              private _formBuilder: FormBuilder,
              public _userService: UserService) {
  }

  ngOnInit() {
    this.refreshSixMonthData();
    this.dateFormGroup = this._formBuilder.group({
      dateCtrl: [{ value: null, disabled: true }, Validators.required]
    });
    this._userService.checkIfStillValid();
  }

  // Bar Plot

  analysisData: any = []

  colorSchemeBarPlot = {
    domain: ['#3f51b5', '#cc45c3', '#ff4081']
  };


  refreshSixMonthData() {
    this.service.getSixMonthData().subscribe(data => {
      this.analysisData = data;
    });
  }

  /* ------------------------------------------------------------------------------------------------ */

  // Pie Chart Plot
  colorSchemePiePlot = {
    domain: ['#3f51b5', '#cc45c3', '#ff4081']
  };

  dateFormGroup: FormGroup;
  dayData: any;
  pieChartData: any[];
  graphActive: boolean;
  alert: string;
  alertActive: boolean;

  onChange() {
    let dateAux: Date = new Date(this.dateFormGroup.value.dateCtrl._d);
    dateAux.setTime(dateAux.getTime() + 12 * 3600 * 1000);
    var ret = {
      dateToCheck: dateAux.toISOString().slice(0, 10)
    }
    this.service.getDestributedPolenValues(ret).subscribe((data: any) => {
      if (data.toString() == "Failed: No data for that day" || 
          data.toString() == "Failed: No percentages found for this data and date") {
        this.alert = data.toString();
        this.alertActive = true;
        this.graphActive = false;
        this.dayData = null;
        this.pieChartData = [];
      } else {
        this.alert = "";
        this.alertActive = false;
        this.graphActive = true;
        this.dayData = data[0]
        this.pieChartData = data[1];
      }
    })
  }

  getColorPalette() {
    // Implementar una función que dependiendo del valor, pinte verde amarillo naranja rojo, según su criticidad
    return this.colorSchemePiePlot;
  }

}
