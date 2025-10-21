import { Routes } from '@angular/router';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyCourses } from './pages/my-courses/my-courses';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage},
    {path: 'login', component: Login},
    {path: 'mycourses', component: MyCourses},
    {path: '', component: Home}
];
