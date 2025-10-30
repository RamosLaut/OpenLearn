import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';
import { forkJoin, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-courses',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './my-courses.html',
  styleUrls: ['./my-courses.css']
})
export class MyCourses implements OnInit {
  memberTeachingCourses: Course[] = [];
  isLoadingTeaching: boolean = true;
  currentSortTeaching: string = 'date-created';

  constructor(
    private cService: CourseService,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    const currentMember = this.auth.getUser();
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


  applySorting(): void {

    switch(this.currentSortTeaching) {
      case 'name-asc':
        this.memberTeachingCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'name-desc':
        this.memberTeachingCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'date-created':
        this.memberTeachingCourses.sort((a, b) => {
          const dateA = new Date(a.publishedDate).getTime();
          const dateB = new Date(b.publishedDate).getTime();

          return dateB - dateA;
        });
        break;

        default:
          break;
    }
    this.memberTeachingCourses = [...this.memberTeachingCourses];
  }


}