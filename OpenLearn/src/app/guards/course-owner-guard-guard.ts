import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const courseOwnerGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  let courseId = route.paramMap.get('id')
  let currentMember = auth.getUser()
  const isOwner = currentMember?.createdCourses?.includes(courseId || '');
  if (isOwner) {
    return true; 
  } else {
    console.warn('Acceso denegado: El usuario no es el propietario de este curso.');
    return router.createUrlTree(['/mycourses']); 
  }
};
