import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {

  PolenName:string;
  PolenBioName:string;
  clicked:boolean = false;

  constructor(private service: SharedService, public dialogRef: MatDialogRef<AddTypeComponent>,
              public _snackBar: MatSnackBar, public _userService: UserService) { }

  ngOnInit() {}

  AnyInvalidField(): boolean {    
    return this.PolenName == null || this.PolenBioName == null ||
           this.PolenName == ""   || this.PolenBioName == ""   ;
  }

  addType() {
    this.clicked = true;
    var val = {
      PolenId: '',
      Polen_Type_Name: this.PolenName,
      Biological_Name: this.PolenBioName,
      UserId: this._userService.getCacheUser_Id(),
    };

    this.service.addPolenType(val).subscribe(res => {
      if (res.toString() == "Added Successfully") {
        this.dialogRef.close();
        this._snackBar.open('Pollen type added successfully', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 10 * 1000,
        });
      } else {
        this._snackBar.open('Error. Could not add pollen type', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 10 * 1000,
        });
      }
    });
    
  }
  
}

