import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/Course';
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

  create(courseData: CourseCreationsData){

  }
  
}
