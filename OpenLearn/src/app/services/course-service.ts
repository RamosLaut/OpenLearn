import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, Section } from '../models/Course';
import { CourseCreationsData } from '../models/courseCreations';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  readonly API_URL="http://localhost:3000/courses"

  courses: Course[];

  constructor(private http: HttpClient, private authService: Auth){
    this.courses= [];
  }

  getAll(): Observable<Course[]>{
    return this.http.get<Course[]>(this.API_URL);
  }

  getById(id: number): Observable<Course>{
    return this.http.get<Course>(this.API_URL + "/" + id);
  }
  private calculateTotalDuration(sections: Section[]): number{
    let totalMinutes = 0;

    sections.forEach(section => {
      section.lessons.forEach(lesson => {
        totalMinutes += lesson.durationInMinutes;
      });
    });

    return parseFloat((totalMinutes / 60 ).toFixed(2));
  }

  create(courseData: CourseCreationsData): Observable<Course>{

    const totalDuration = this.calculateTotalDuration(courseData.sections);

    const currentUser = this.authService.CurrentUserValue;

    if(!currentUser){
      throw new Error('No user logged in to create a course.');
    }

    const newCourse: Omit<Course, 'id'> = {
      ...courseData,
      instructorId: currentUser.id,
      instructorName: currentUser.fullName,
      publishedDate: new Date(),
      status: 'draft',
      totalDurationInHours: totalDuration,
      averageRating: 0,
      numberOfReviews: 0
    };

    return this.http.post<Course>(this.API_URL, newCourse);
    
  }

  update(id: number, course:Course): Observable<Course>{
    return this.http.put<Course>(this.API_URL + "/" + id, course);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(this.API_URL + "/" + id)
  }
  
}
