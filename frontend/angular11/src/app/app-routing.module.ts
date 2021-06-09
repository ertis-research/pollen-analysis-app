import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PolencounterComponent} from './polencounter/polencounter.component';
import {StatisticsComponent} from './statistics/statistics.component'
import { PolinicPercentageRangesComponent } from './polinic-percentage-ranges/polinic-percentage-ranges.component'
import { PolenTypeComponent } from './polentype/polentype.component';


const routes: Routes = [
 {path: 'polen',component:PolencounterComponent},
 {path: 'stats',component:StatisticsComponent},
 {path: 'ranges',component:PolinicPercentageRangesComponent},
 {path: 'types',component:PolenTypeComponent},
 {path: '',component:PolencounterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
