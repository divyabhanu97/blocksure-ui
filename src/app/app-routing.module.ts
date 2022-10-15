import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './component/admin/admin.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { LandingComponent } from './component/landing/landing.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home', component: LandingComponent
  },
  {
    path: 'kyc', component: HomeComponent
  },
  {
    path: 'admin', component: AdminComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
