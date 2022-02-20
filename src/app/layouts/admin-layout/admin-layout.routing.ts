import { ReportListComponent } from './../../pages/report-list/report-list.component';
import { Routes } from "@angular/router";

import { MapComponent } from "../../pages/map/map.component";
import { DisplayReportComponent } from 'src/app/pages/display-report/display-report.component';

export const AdminLayoutRoutes: Routes = [
  { path: "report-list", component: ReportListComponent },
  { path: "maps", component: MapComponent },
  {path: "display-report", component: DisplayReportComponent}
];
