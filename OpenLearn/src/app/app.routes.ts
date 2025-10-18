import { Routes } from '@angular/router';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage},
    {path: 'login', component: Login},
    {path: '', component: Home}
];
