import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MealsComponent } from './pages/dashboard/meals/meals.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home/dashboard-home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'home', component: DashboardHomeComponent},
    { path: 'meals', component: MealsComponent},
];


