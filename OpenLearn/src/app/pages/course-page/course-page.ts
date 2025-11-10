import { Component, OnInit } from '@angular/core';
import { Content, Course, QuizContent } from '../../models/Course';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Announcement } from '../../models/Announcement';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-page',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './course-page.html',
  styleUrl: './course-page.css'
})
export class CoursePage implements OnInit {
  backendBaseUrl = 'http://localhost:8080';
  course!: Course;
  isCourseInstructor: boolean = false;
  isEnrolled: boolean = false;
  userRating: number = 0;
  hoverRating: number = 0;

  announcementForm!: FormGroup;
  announcementEdition: Announcement | null = null;
  isCreationMode: boolean = false;

  

  constructor(
    private route: ActivatedRoute,
    private cService: CourseService,
    private auth: Auth,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['id']
    const currentUserId = this.auth.CurrentUserValue?.id;
    const currentUser = this.auth.getUser();

    this.cService.getById(courseId).subscribe(c => {
      this.course = c;

      if (c.instructorId === currentUserId) {
        this.isCourseInstructor = true;
      }

      if (!this.course.announcements) {
        this.course.announcements = [];
      }
      if (currentUser && courseId && currentUser.enrolledCourses?.includes(courseId)) {
        this.isEnrolled = true;
      }
      this.course.announcements.forEach(a => a.isExpanded = false);

    });
  }

  toggleAccordeon(announcement: Announcement): void {
    announcement.isExpanded = !announcement.isExpanded;
  }

  startCreation(): void {
    this.announcementEdition = null;
    this.isCreationMode = true;
    this.announcementForm.reset();
  }

  onEdit(announcement: Announcement): void {
    this.isCreationMode = false;
    this.announcementEdition = { ...announcement };

    this.announcementForm.patchValue({
      title: announcement.title,
      content: announcement.content
    });

    this.course.announcements?.forEach(a => a.isExpanded = false);
  }

  onDelete(announcementId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      const updatedAnnouncements = this.course.announcements?.filter(a => a.id !== announcementId);
      this.course.announcements = updatedAnnouncements;
      this.announcementEdition = null;

      this.cService.update(this.course.id, this.course).subscribe({
        next: (data) => { console.log('Actualizado correctamente.') },
        error: (err) => { console.log('There is an error') }
      });
    }
  }

  onFormSubmit(): void {
    if (this.announcementForm.invalid) return;

    const formValue = this.announcementForm.value;

    if (this.announcementEdition) {

      const updatedAnnouncement: Announcement = {
        ...this.announcementEdition,
        title: formValue.title,
        content: formValue.content
      };

      const index = this.course.announcements?.findIndex(a => a.id === updatedAnnouncement.id);
      if (index !== undefined && index !== -1) {
        this.course.announcements![index] = updatedAnnouncement;
      }
      this.announcementEdition = null;

    } else {
      const newAnnouncement: Announcement = {
        ...formValue,
        publishedDate: new Date(),
        isExpanded: false
      };

      this.course.announcements?.unshift(newAnnouncement);
      this.isCreationMode = false;
    }
    this.cService.update(this.course.id, this.course).subscribe({
      next: (data) => { console.log('Actualizado correctamente') },
      error: (err) => { console.log('Error') }
    });

    this.announcementForm.reset();

  }

  onCancel(): void {
    this.announcementEdition = null;
    this.isCreationMode = false;
    this.announcementForm.reset();
  }

  rateCourse(rating: number): void {
    this.userRating = rating;
    let actualRating: number = 0
    const currentUser = this.auth.getUser();
    if (!currentUser) {
      alert('You must be logged in to rate a course.');
      return;
    }
    const courseId = this.route.snapshot.params['id']
    if (!courseId) {
      console.error('Course ID is missing from the route.');
      return;
    }
    this.cService.getById(courseId).subscribe({
      next: (courseData) => {
        this.course = courseData;
        if (!this.course.ratings) {
          this.course.ratings = [];
        }
        const existingRating = this.course.ratings.find(r => r.memberId === currentUser.id);

        if (existingRating) {
          existingRating.rating = rating;
        } else {
          this.course.ratings.push({
            memberId: currentUser.id,
            rating: rating
          });
        }

        this.course.numberOfReviews = this.course.ratings.length;
        if (this.course.numberOfReviews > 0) {
          const totalRating = this.course.ratings.reduce((sum, r) => sum + r.rating, 0);
          this.course.averageRating = parseFloat((totalRating / this.course.numberOfReviews).toFixed(1));
        } else {
          this.course.averageRating = 0;
        }

        this.cService.update(this.course.id, this.course).subscribe({
          next: (updatedCourse) => {
            console.log(`Usuario calificó con: ${rating} estrellas`);
            this.userRating = rating;

            this.course.averageRating = updatedCourse.averageRating;
            this.course.numberOfReviews = updatedCourse.numberOfReviews;
          },
          error: (err) => console.error('Error updating course rating:', err)
        });

      },
      error: (err) => console.error('Error fetching course data:', err)
    });
  }
  resolveContentUrl(fileUrl: string | undefined): SafeResourceUrl {
    if (!fileUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    let finalUrl: string;

    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      finalUrl = fileUrl;
    } else {
      finalUrl = this.backendBaseUrl + fileUrl;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
}
