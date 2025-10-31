import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';
import { forkJoin, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Member from '../../models/member';
import { MemberService } from '../../services/member-service';

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

  initialCourseLimit: number = 2;
  courseIncrement: number = 2;
  currentCourseLimit: number = this.initialCourseLimit;

  isDeleteModalVisible = false;
  courseToDelete: Course | null = null;

  constructor(
    private cService: CourseService,
    private auth: Auth,
    private mService: MemberService
  ) { }


  loadMoreCourses() {
    this.currentCourseLimit += this.courseIncrement;
  }

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
          this.applySorting();

          this.currentCourseLimit = this.initialCourseLimit;

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
    switch (this.currentSortTeaching) {
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

  openDeleteConfirm(course: Course): void {
    this.courseToDelete = course;
    this.isDeleteModalVisible = true;
  }

  closeDeleteConfirm(): void {
    this.isDeleteModalVisible = false;
    this.courseToDelete = null;
  }
  confirmDelete(): void {
    if (!this.courseToDelete) return;

    const courseIdToDelete = this.courseToDelete.id;
    const currentUser = this.auth.CurrentUserValue;

    this.cService.delete(this.courseToDelete.id).subscribe({
      next: () => {
        this.memberTeachingCourses = this.memberTeachingCourses.filter(
          course => course.id !== this.courseToDelete?.id
        );
        if (currentUser) {
          const updatedCreatedCourses = currentUser.createdCourses.filter(
            id => id !== courseIdToDelete
          );
          const updatedMember: Member = {
            ...currentUser,
            createdCourses: updatedCreatedCourses
          };
          this.mService.put(updatedMember.id, updatedMember).subscribe({
            next: (savedMember) => {
              this.auth.updateCurrentUser(savedMember);
              console.log('Member updated successfully after course deletion');
            },
            error: (err) => console.error('Failed to update member after course deletion', err)
          });
        }
        this.closeDeleteConfirm();
      },
      error: (err) => {
        console.error('Error deleting course', err);
        this.closeDeleteConfirm();
      }
    });
  }

}