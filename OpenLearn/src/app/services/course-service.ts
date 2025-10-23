import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, Section } from '../models/Course';
import { CourseCreationsData } from '../models/courseCreations';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  readonly API_URL="http://localhost:3000/courses"

  constructor(private http: HttpClient){
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

  create(courseData: CourseCreationsData){

    const totalDuration = this.calculateTotalDuration(courseData.sections);

    
  }


  
}
