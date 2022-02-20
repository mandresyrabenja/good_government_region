import { DisplayReportComponent } from 'src/app/pages/display-report/display-report.component';
import { ReportListComponent } from './../../pages/report-list/report-list.component';
import { MapComponent } from './../../pages/map/map.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    MapComponent,
    ReportListComponent,
    DisplayReportComponent
  ]
})
export class AdminLayoutModule {}
