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
import { ForgotPasswordComponent } from './components/forgot-password-component/forgot-password-component';
import { authGuard } from './guards/auth-guard-guard';
import { guestGuard } from './guards/guest-guard-guard';
import { courseOwnerGuardGuard } from './guards/course-owner-guard-guard';
import { canAccessCourseGuard } from './guards/can-access-course-guard-guard';
import { ResetPassword } from './components/reset-password/reset-password';

export const routes: Routes = [
    {path: 'registration', component:RegisterFormPage, canActivate: [guestGuard]},
    {path: 'login', component: Login, canActivate: [guestGuard]},
    {path: 'mycourses', component: MyCourses, canActivate: [authGuard]},
    {path: 'courses', component: Courses},
    {path: 'courses/new', component: CreateCourse, canActivate: [authGuard]},
    {path: 'course/details/:id', component: CourseDetails},
    {path: 'course/:id', component: CoursePage, canActivate: [canAccessCourseGuard]},
    {path: 'course/:courseId/quiz/:contentId', component: Quiz },
    {path: 'edit-course/:id', component: CreateCourse, canActivate: [authGuard, courseOwnerGuardGuard]},
    {path: 'profile', component: Profile, canActivate: [authGuard]},
    {path: 'profile/edit/:id', component: EditProfile, canActivate: [authGuard]},
    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard]},
    {path: 'reset-password', component: ResetPassword, canActivate: [guestGuard]},
    {path: '', component: Home}
];
