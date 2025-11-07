import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
export const canAccessCourseGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(Auth);
  const router = inject(Router);
  const courseId = route.paramMap.get('id');
  const currentMember = auth.getUser();

  if (!courseId || !currentMember) {
    return router.createUrlTree(['/login']); 
  }

  const isOwner = currentMember.createdCourses?.includes(courseId);
  const isSubscribed = currentMember.enrolledCourses?.includes(courseId);

  if (isOwner || isSubscribed) {
    return true;
  } else {
    console.warn('Acceso denegado: El usuario no es el propietario ni está suscrito a este curso.');
    return router.createUrlTree(['/mycourses']);
  }
};