import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, Section } from '../models/Course';
import { CourseCreationsData } from '../models/courseCreations';
import { Auth } from './auth';
import Subscription  from '../models/subscription';
import { MemberService } from './member-service';
import Member from '../models/member';



@Injectable({
  providedIn: 'root'
})
export class CourseService {

  readonly API_URL = "http://localhost:3000/courses";
  readonly SUB_API_URL = "http://localhost:3000/subscriptions";

  courses: Course[];

  constructor(private http: HttpClient, private authService: Auth, private mService: MemberService){
    this.courses= [];
  }

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API_URL);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(this.API_URL + "/" + id);
  }
  private calculateTotalDuration(sections: Section[]): number {
    let totalMinutes = 0;

    sections.forEach(section => {
      section.content.forEach(c => {
      });
    });

    return parseFloat((totalMinutes / 60).toFixed(2));
  }

  create(courseData: CourseCreationsData): Observable<Course> {

    const totalDuration = this.calculateTotalDuration(courseData.sections);

    const currentUser = this.authService.CurrentUserValue;

    if (!currentUser) {
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
      numberOfReviews: 0,
      ratings: []
    };

    return this.http.post<Course>(this.API_URL, newCourse);

  }

  update(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(this.API_URL + "/" + id, course);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.API_URL + "/" + id)
  }

  subscribeUserToCourse(courseId: string, userId: string): Observable<Subscription>{
    let member: Member
    this.mService.getById(userId).subscribe({
      next: (m) => {member = m
        member.enrolledCourses.push(courseId)
        this.mService.put(member.id, member).subscribe({
          next: (data) => {
            console.log("Course ID added to member enrolled courses")
            this.authService.updateCurrentUser(data as Member)
          }
        })
      }
    })
    const body: { userId: string, courseId: string} = {
      courseId: courseId,
      userId: userId
    };

    return this.http.post<Subscription>(this.SUB_API_URL, body);

  }

  getSubscribedCourses(userId: string): Observable<Subscription[]>{

    const url = `http://localhost:3000/subscriptions?userId=${userId}&_expand=course`;

    return this.http.get<Subscription[]>(url);
  }

  getSubscription(userId: string, courseId:string): Observable<Subscription[]>{

    const url = `${this.SUB_API_URL}?userId=${userId}&courseId=${courseId}`;

    return this.http.get<Subscription[]>(url);

  }
  unSubscribeUserToCourse(subscriptionId: number): Observable<void>{

    const url = `${this.SUB_API_URL}/${subscriptionId}`;

    return this.http.delete<void>(url);

  }

}
