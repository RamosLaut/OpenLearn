import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';
import { forkJoin, Observable, of } from 'rxjs'; // Import forkJoin and of
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe if needed later

@Component({
  selector: 'app-my-courses',
  imports: [RouterLink, CommonModule],
  templateUrl: './my-courses.html',
  styleUrls: ['./my-courses.css']
})
export class MyCourses implements OnInit {
  memberTeachingCourses: Course[] = [];
  isLoadingTeaching: boolean = true;

  constructor(
    private cService: CourseService,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    const currentMember = this.auth.getUser();
    console.log(currentMember?.fullName)
    if (currentMember && currentMember.createdCourses && currentMember.createdCourses.length > 0) {
      this.isLoadingTeaching = true;
      const courseObservables: Observable<Course>[] = currentMember.createdCourses.map(courseId =>
        this.cService.getById(courseId)
      );
      forkJoin(courseObservables).subscribe({
        next: (courses) => {
          this.memberTeachingCourses = courses;
          this.isLoadingTeaching = false; 
          console.log('Teaching courses loaded:', this.memberTeachingCourses);
        },
        error: (err) => {
          console.error('Error fetching teaching courses:', err);
          this.isLoadingTeaching = false;
        }
      });
      
    } else {
      this.isLoadingTeaching = false;
      this.memberTeachingCourses = [];
    }
  }
}