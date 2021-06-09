import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-polentype',
  templateUrl: './polentype.component.html',
  styleUrls: ['./polentype.component.css']
})

export class PolenTypeComponent implements OnInit {

  
  constructor(public _userService: UserService) { }

  ngOnInit(): void {
    this._userService.checkIfStillValid()
  }

}

