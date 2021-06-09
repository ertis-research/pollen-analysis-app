import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { SharedService } from '../../shared.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-add-range',
  templateUrl: './add-range.component.html',
  styleUrls: ['./add-range.component.css'],
})
export class AddRangeComponent implements OnInit {

  polenListControl = new FormControl([]);
  polenTypeValues = {};
  polenList: any[];
  RangeList: any = [];

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  clicked:boolean = false;

  constructor(private service: SharedService, public dialogRef: MatDialogRef<AddRangeComponent>,
              public _snackBar: MatSnackBar, public _userService: UserService) { }

  ngOnInit() {
    this.refreshRangeList();
    this.refreshPolenTypeList();
  }

  isInsidePollenList(pollen: string): boolean {
    let pollens = this.polenListControl.value as string[];
    return pollens.includes(pollen);
  }

  onPolenRemoved(pollen: string) {
    const pollens = this.polenListControl.value as string[];
    this.removeFirst(pollens, pollen);
    this.polenListControl.setValue(pollens); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  refreshRangeList() {
    this.service.getPolinicRanges().subscribe(data => {
      this.RangeList = data;
    });
  }

  refreshPolenTypeList() {
    this.service.getPolenTypeList().subscribe(data => {
      this.polenList = data;
    });
  }

  myFilter = (d: Date): boolean => {
    let ret: boolean = true;
    this.RangeList.forEach(function (range:any) {
      let startDat: Date = new Date(range.DateOfStart);
      let endDat: Date = new Date(range.DateOfEnd);
      if (d >= startDat && d <= endDat) {
        ret = false;
      }
    });
    return ret;
  }

  AllPercentagesSum100(): boolean {
    let percentageValue = 0;
    for (var pt in this.polenTypeValues){
      if(this.polenTypeValues[pt] != null){
        percentageValue += Math.trunc(this.polenTypeValues[pt]);
      }
    }
    return percentageValue == 100;
  }


  AnyInvalidField(): boolean {
    let res:boolean = false;
    for (var pt in this.polenTypeValues){
      if(this.polenTypeValues[pt] < 0 || this.polenTypeValues[pt] > 100){
        res = true;
        break;
      }
    }
    return res;
  }

  AnyDateIsNull(): boolean{
    return this.dateRange.value.start == null || this.dateRange.value.end == null ;
  }


  addRange() {
    this.clicked = true;
    let retStartDate = new Date(this.dateRange.value.start);
    let retEndDate = new Date(this.dateRange.value.end);

    let polenTypesValuesList = [];

    for (var pt in this.polenTypeValues){
      if(this.polenTypeValues[pt] != null && Math.trunc(this.polenTypeValues[pt]) != 0){
        let polenItem = {}
        polenItem['PolenTypeId'] = pt;
        polenItem['value'] = Math.trunc(this.polenTypeValues[pt]);
        polenTypesValuesList.push(polenItem)
      }
    }

    var val = {
      RangeId: '',
      DateOfStart: retStartDate.toISOString().slice(0, 10),
      DateOfEnd: retEndDate.toISOString().slice(0, 10),
      UserId: this._userService.getCacheUser_Id(),
      PolenTypeValues: polenTypesValuesList
    };

    this.service.addPolinicRange(val).subscribe(res => {
      if (res.toString() == "Added Successfully") {
        this.dialogRef.close();
        this._snackBar.open('Pollinic Range added successfully', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 10000,
        });
      } else {
        this._snackBar.open('Error. Could not add pollinic range', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 10000,
        });
      }
    });
    
  }
  
}
