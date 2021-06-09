import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SharedService } from 'src/app/shared.service'

// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UserService } from 'src/app/user.service';
import { AddTypeComponent } from '../add-type/add-type.component';

export interface DialogData {
  PolenId: number;
}

@Component({
  selector: 'app-show-type',
  templateUrl: './show-type.component.html',
  styleUrls: ['./show-type.component.css']
})
export class ShowTypeComponent implements OnInit {

  constructor(private service: SharedService,
    public dialog: MatDialog,
    private _userService: UserService) { }

  PolenTypeList: any = [];

  displayedColumns: string[] = ['Pollen Type Name', 'Biological Pollen Name', 'Options'];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.refreshPolenTypeList();
  }

  refreshPolenTypeList() {
    this.service.getPolenTypeList().subscribe(data => {
      this.PolenTypeList = data;
      this.dataSource = new MatTableDataSource(this.PolenTypeList);
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


  addType(): void {
    if (this._userService.checkIfStillValid()) {

      const addDialogRef = this.dialog.open(AddTypeComponent, {});

      addDialogRef.afterClosed().subscribe(_ => {
        this.refreshPolenTypeList();
      });

    }

  }

  deleteDialog(item: any): void {
    if (this._userService.checkIfStillValid()) {
      const deleteDialogRef = this.dialog.open(DeleteTypeDialog, {
        data: { PolenId: item.PolenId }
      });
      deleteDialogRef.afterClosed().subscribe(_ => {
        this.refreshPolenTypeList();
      });
    }
  }

}

@Component({
  selector: 'delete-type-dialog',
  templateUrl: 'delete-type-dialog.html',
})
export class DeleteTypeDialog {
  constructor(private service: SharedService, 
  public dialogRef: MatDialogRef<DeleteTypeDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData, 
  public _snackBar: MatSnackBar) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteDialog() {
    this.service.deletePolenTypes(this.data.PolenId).subscribe();
    this._snackBar.open('Polen type deleted succesfully', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 5 * 1000,
    });
    this.dialogRef.close();
  }
}
