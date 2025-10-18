import { Routes } from '@angular/router';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage},
    {path: 'login', component:RegisterFormPage},
    {path: '', component: Home}
];
