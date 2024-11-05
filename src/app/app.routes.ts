import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MealsComponent } from './pages/dashboard-components/meals/meals.component';
import { DashboardHomeComponent } from './pages/dashboard-components/dashboard-home/dashboard-home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProgressComponent } from './pages/dashboard-components/progress/progress.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent }, 
    { path: 'home', component: DashboardHomeComponent},
    { path: "meals", component: MealsComponent},
    { path: "progress", component: ProgressComponent,},
];


