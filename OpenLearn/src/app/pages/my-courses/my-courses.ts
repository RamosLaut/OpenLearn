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

  memberSubscribedCourses: Course[] = [];
  isLoadingSubscribed: boolean = false;
  isUnsubscribing: string | null = null;

  currentSortTeaching: string = 'date-created';
  currentSortEnrolled: string = 'date-new';

  initialCourseLimit: number = 2;
  courseIncrement: number = 2;
  currentTeachingLimit: number = this.initialCourseLimit;
  currentSubscribedLimit: number = this.initialCourseLimit;

  isDeleteModalVisible = false;
  courseToDelete: Course | null = null;

  searchTerm: string = '';

  constructor(
    private cService: CourseService,
    private auth: Auth,
    private mService: MemberService
  ) { }


  loadMoreTeachingCourses() {
    this.currentTeachingLimit += this.courseIncrement;
  }

  loadMoreSubscribedCourses() {
    this.currentSubscribedLimit += this.courseIncrement;
  }

  loadSubscribedCourses(userId: string): void {
    this.isLoadingSubscribed = true;
    
    this.cService.getSubscribedCourses(userId).subscribe({
      next: (subscriptions) => {

        if (!subscriptions || subscriptions.length === 0) {
          this.memberSubscribedCourses = [];
          this.isLoadingSubscribed = false;
          return;
        }

        const courseIds = subscriptions.map(sub => sub.courseId);

        const courseObservables: Observable<Course>[] = courseIds.map(courseId => this.cService.getById(courseId));

        forkJoin(courseObservables).subscribe({
          next: (courses) => {
            this.memberSubscribedCourses = courses;
            this.applyEnrolledSorting();
            this.isLoadingSubscribed = false;
          }, 
          error: (err) => {
            console.error("Error fetching details for subscribed courses: ", err);
            this.isLoadingSubscribed = false;
          },
        });
      },
      error: (err) => {
        console.error("Error fetching subscriptions list:", err);
        this.isLoadingSubscribed = false;
      }
    });
  }

  ngOnInit(): void {
    const currentMember = this.auth.CurrentUserValue;

    console.log('MyCoursesComponent OnInit - Current Member:', currentMember);

    if (currentMember && currentMember.id) {

      this.loadSubscribedCourses(currentMember.id);

      if (currentMember && currentMember.createdCourses && currentMember.createdCourses.length > 0) {
        this.isLoadingTeaching = true;
        const courseObservables: Observable<Course>[] = currentMember.createdCourses.map(courseId =>
          this.cService.getById(courseId)
        );
        forkJoin(courseObservables).subscribe({
          next: (courses) => {
            this.memberTeachingCourses = courses;
            this.applyTeachingSorting();

            this.currentTeachingLimit = this.initialCourseLimit;

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

    } else {
        this.isLoadingTeaching = false;
        this.memberTeachingCourses = [];
        this.isLoadingSubscribed = false; 
        this.memberSubscribedCourses = []; 
      }

    }

  applyEnrolledSorting(){
    switch(this.currentSortEnrolled) {
      case 'name-asc':
        this.memberSubscribedCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        this.memberSubscribedCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-new':
        this.memberSubscribedCourses.sort((a, b) => {
          const dateA = new Date(a.publishedDate).getTime();
          const dateB = new Date(b.publishedDate).getTime();
          return dateB - dateA;
        });
      break;
      default:
        break;
    }
    this.memberSubscribedCourses = [...this.memberSubscribedCourses];
  }


  applyTeachingSorting(): void {
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

  unsubscribe(courseId : string): void {
    if(this.isUnsubscribing) return;

    const currentUser = this.auth.CurrentUserValue;
    if (!currentUser || !currentUser.id) {

      console.error("User not found, cannot unsubscribe.");
      return; 
    }

    const userId = currentUser.id;
    this.isUnsubscribing = courseId;

    this.cService.getSubscription(userId, courseId).subscribe({
      next: (subscriptions) => {
        if (subscriptions.length === 0) {
          console.error("Subscription not found, cannot unsubscribe.");
          this.isUnsubscribing = null;
          return;
        }

        const subscriptionId = subscriptions[0].id;

        if (!subscriptionId) {
          console.error("Subscription ID is missing or invalid, cannot unsubscribe.");
          this.isUnsubscribing = null;
          return;
        }

        this.cService.unSubscribeUserToCourse(subscriptionId).subscribe({
          next: () => {
            alert("Successfully unsubscribed!");

            this.memberSubscribedCourses = this.memberSubscribedCourses.filter(
              course => course.id !== courseId
            );

            this.isUnsubscribing = null;
          }, 
          error: (err)  => {
            console.error("Error finding subscription: ", err);
            alert("Failed to find subscription. Please try again.");
            this.isUnsubscribing = null;
          },
        })
      }
    })
  }

  isTeachingCourse(courseId: string): boolean {
    return this.memberTeachingCourses.some(c => c.id === courseId);
  }

  get allCourses(): Course[] {
    const term = this.searchTerm.toLowerCase();

    if(!term) {
      return [];
    }

    const teachingResults = this.memberTeachingCourses.filter(course => 
      course.title.toLowerCase().includes(term) ||
      course.category.toLowerCase().includes(term) ||
      course.difficultyLevel.toLowerCase().includes(term)
    );

    const subscribedResults = this.memberSubscribedCourses.filter(course =>
      course.title.toLowerCase().includes(term) ||
      course.category.toLowerCase().includes(term) ||
      course.difficultyLevel.toLowerCase().includes(term)
    );

    const combinedResults = [...teachingResults, ...subscribedResults];

    return combinedResults;
  }
}