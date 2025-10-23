import { Routes } from '@angular/router';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyCourses } from './pages/my-courses/my-courses';
import { CoursesList } from './pages/courses-list/courses-list';
import { CreateCourse } from './pages/create-course/create-course';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage},
    {path: 'login', component: Login},
    {path: 'mycourses', component: MyCourses},
    {path:'courses', component: CoursesList},
    {path: '', component: Home},
    {path: 'addCourse', component: CreateCourse}
];
