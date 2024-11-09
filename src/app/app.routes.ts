import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MealsComponent } from './pages/dashboard-components/meals/meals.component';
import { DashboardHomeComponent } from './pages/dashboard-components/dashboard-home/dashboard-home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProgressComponent } from './pages/dashboard-components/progress/progress.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/dashboard-components/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { ModalComponent } from './pages/modal/modal.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent, children:[
        { path:'home',pathMatch:"prefix", component: DashboardHomeComponent, },
        { path: "meals", component: MealsComponent},
        { path: "progress", component: ProgressComponent},
        { path: "profile", component: ProfileComponent},
    ]}, 
    { path: "about", component: AboutComponent},
    { path: "modal", component: ModalComponent},

    
];



