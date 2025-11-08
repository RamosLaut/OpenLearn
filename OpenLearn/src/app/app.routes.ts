import { Routes } from '@angular/router';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyCourses } from './pages/my-courses/my-courses';
import { Courses } from './pages/courses/courses';
import { Profile } from './pages/profile/profile';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { CreateCourse } from './pages/create-course/create-course';
import { CourseDetails } from './pages/course-details/course-details';
import { CoursePage } from './pages/course-page/course-page';
import { Quiz } from './pages/quiz/quiz';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage},
    {path: 'login', component: Login},
    {path: 'mycourses', component: MyCourses},
    {path: 'courses', component: Courses},
    {path: 'courses/new', component: CreateCourse},
    {path: 'course/details/:id', component: CourseDetails},
    {path: 'course/:id', component: CoursePage},
    {path: 'course/:courseId/quiz/:contentId', component: Quiz },
    {path: 'edit-course/:id', component: CreateCourse},
    {path: 'profile', component: Profile},
    {path: 'profile/edit/:id', component: EditProfile},
    {path: '', component: Home}
];
