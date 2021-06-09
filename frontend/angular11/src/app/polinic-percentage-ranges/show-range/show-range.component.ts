import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SharedService } from 'src/app/shared.service'
import { AddRangeComponent } from '../add-range/add-range.component';

// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UserService } from 'src/app/user.service';

export interface DialogData {
  RangeId: number;
}

@Component({
  selector: 'app-show-range',
  templateUrl: './show-range.component.html',
  styleUrls: ['./show-range.component.css']
})

export class ShowRangeComponent implements OnInit {

  constructor(private service: SharedService,
              public dialog: MatDialog, 
              private _userService: UserService) { }

  RangeList: any = [];

  displayedColumns: string[] = ['DateOfStart', 'DateOfEnd', 'Options'];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.refreshRangeList();
  }

  refreshRangeList() {
    this.service.getPolinicRanges().subscribe(data => {
      this.RangeList = data;
      this.dataSource = new MatTableDataSource(this.RangeList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  addRange(): void {
    if (this._userService.checkIfStillValid()) {

      const addDialogRef = this.dialog.open(AddRangeComponent, {});

      addDialogRef.afterClosed().subscribe(_ => {
        this.refreshRangeList();
      });

    }
  }


  deleteDialog(item: any): void {
    if (this._userService.checkIfStillValid()) {
      const deleteDialogRef = this.dialog.open(DeleteRangeDialog, {
        data: { RangeId: item.RangeId }
      });
      deleteDialogRef.afterClosed().subscribe(_ => {
        this.refreshRangeList();
      });
    }
  }

  infoDialog(item: any): void {
    if (this._userService.checkIfStillValid()) {
      const infoDialogRef = this.dialog.open(InfoRangeDialog, {
        data: { RangeId: item.RangeId }
      });
      infoDialogRef.afterClosed().subscribe(_ => {
        this.refreshRangeList();
      });
    }
  }
}

@Component({
  selector: 'info-range-dialog',
  templateUrl: 'info-range-dialog.html',
  styleUrls: ['./show-range.component.css']
})
export class InfoRangeDialog {
  constructor(private service: SharedService, 
  public dialogRef: MatDialogRef<InfoRangeDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData, 
  public _snackBar: MatSnackBar) { }

  RangeInfo = []

  DateOfStart:any;
  DateOfEnd:any;

  ngOnInit(){
    this.service.getRangeInformation(this.data.RangeId).subscribe(data => {
      this.DateOfStart = data[0];
      this.DateOfEnd = data[1];
      this.RangeInfo = data.slice(2);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}



@Component({
  selector: 'delete-range-dialog',
  templateUrl: 'delete-range-dialog.html',
})
export class DeleteRangeDialog {
  constructor(private service: SharedService, 
  public dialogRef: MatDialogRef<DeleteRangeDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData, 
  public _snackBar: MatSnackBar) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteDialog() {
    this.service.deletePolinicRange(this.data.RangeId).subscribe();
    this._snackBar.open('Pollinic range deleted succesfully', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 5 * 1000,
    });
    this.dialogRef.close();
  }
}
