import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-polinic-percentage-ranges',
  templateUrl: './polinic-percentage-ranges.component.html',
  styleUrls: ['./polinic-percentage-ranges.component.css']
})
export class PolinicPercentageRangesComponent implements OnInit {

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this._userService.checkIfStillValid()
  }

}
