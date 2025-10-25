import { Component, OnInit } from '@angular/core';
import { CourseCategory } from '../../enums/course-category';
import { CourseService } from '../../services/course-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-course.html',
  styleUrl: './create-course.css'
})
export class CreateCourse implements OnInit {

  courseForm!: FormGroup;

  courseCategories = Object.values(CourseCategory);
  difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  lessonTypes = ['Video', 'Text', 'Quiz'];

  constructor(

    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService
  ) {

  }

  ngOnInit(): void {
    this.courseForm = this.fb.group({

      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],

      sections: this.fb.array([])
    });
  }
  /////////////////////////////////////////////////////////////
  get sections(): FormArray {
    return this.courseForm.get('sections') as FormArray;
  }

  newSection(): FormGroup {
    return this.fb.group({
      sectionTitle: ['', Validators.required],
      lessons: this.fb.array([])
    });
  }

  addSection() {
    this.sections.push(this.newSection());
  }

  removeSection(sectionIndex: number) {
    this.sections.removeAt(sectionIndex);
  }

  ////////////////////////////////////////////////////////////

  getLessons(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('lessons') as FormArray;
  }

  newLesson(): FormGroup {
    return this.fb.group({
      lessonTitle: ['', Validators.required],
      lessonType: ['', Validators.required],
      videoUrl: [''],
      content: [''],
      durationInMinutes: [5, [Validators.required, Validators.min(1)]]
    })
  }

  addLesson(sectionIndex: number) {
    this.getLessons(sectionIndex).push(this.newLesson());
  }

  removeLesson(sectionIndex: number, lessonIndex: number) {
    this.getLessons(sectionIndex).removeAt(lessonIndex);
  }

  ///////////////////////////////////////////////////////////////

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      console.warn('Invalid form: ', this.courseForm.value);
      return;
    }

    const newCourseData = this.courseForm.value;

    console.log('Sending course:', newCourseData);

    /*
    this.courseService.create(newCourseData).subscribe({
      next: (createdCourse) => {
        console.log('Course created:', createdCourse);
        
        this.router.navigate(['/mycourses']); 
      },
      error: (err) => {
        console.error('Error creating course:', err);
      }
    });
    */
  }

}
