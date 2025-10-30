import { Component, OnInit } from '@angular/core';
import { CourseCategory } from '../../enums/course-category';
import { CourseService } from '../../services/course-service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemberService } from '../../services/member-service';
import Member from '../../models/member';
import { Auth } from '../../services/auth';
import { FileUploadService } from '../../services/file-upload-service';
import { HttpEventType } from '@angular/common/http';

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
  contentTypes = ['Video', 'Pdf', 'Word', 'Text'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService,
    private memberService: MemberService,
    private auth: Auth,
    private fileUpload: FileUploadService
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
      title: ['', Validators.required],
      content: this.fb.array([])
    });
  }

  addSection() {
    this.sections.push(this.newSection());
  }

  removeSection(sectionIndex: number) {
    this.sections.removeAt(sectionIndex);
  }

  ////////////////////////////////////////////////////////////

  getContent(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('content') as FormArray;
  }

  newContent(): FormGroup {
    const contentGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      contentType: ['', Validators.required],
      file: [''],
      textContent: [''],
      contentDescription: ['', Validators.maxLength(500)],
      fileUrl: ['', Validators.pattern('^(http|https)://[^ "]+$')],
      fileName: [''],
      uploadProgress: [0]
    }, {
      validators: this.contentRequiredValidator
    }
    );
    const fileControl = contentGroup.get('file');
    const urlControl = contentGroup.get('fileUrl');

    if (fileControl && urlControl) {
      fileControl.valueChanges.subscribe(fileValue => {
        if (fileValue) {
          urlControl.disable({ emitEvent: false });
        } else {
          urlControl.enable({ emitEvent: false });
        }
      });

      urlControl.valueChanges.subscribe(urlValue => {
        if (urlValue) {
          fileControl.disable({ emitEvent: false });
        } else {
          fileControl.enable({ emitEvent: false });
        }
      });
    }

    return contentGroup;
  }
  onFileSelected(event: Event, sectionIndex: number, contentIndex: number): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const contentGroup = this.getContent(sectionIndex).at(contentIndex) as FormGroup;
    const fileControl = contentGroup.get('file');
    const urlControl = contentGroup.get('fileUrl');
    // if (!urlControl) {
    //   console.error(`ERROR: FormControl 'fileUrl' not found in contentGroup at index ${contentIndex}!`);
    //   return; // Stop if the control doesn't exist
    // }
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      contentGroup.patchValue({ fileName: file.name, uploadProgress: 1, fileUrl: '' });
      urlControl?.disable({ emitEvent: false });

      this.fileUpload.uploadFile(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round(100 * event.loaded / event.total);
            contentGroup.patchValue({ uploadProgress: progress });
          } else if (event.type === HttpEventType.Response) {
            if (event.body && event.body.fileUrl) {
              // console.log('Backend returned fileUrl:', event.body.fileUrl); // Log the URL from backend
              // urlControl.patchValue(event.body.fileUrl, { emitEvent: false }); // Patch only the urlControl
              // contentGroup.patchValue({ uploadProgress: 100 }); // Patch progress separately
              // console.log('urlControl value AFTER patch:', urlControl.value);
              // console.log('Full contentGroup value AFTER patch:', contentGroup.getRawValue());
              contentGroup.patchValue({
                fileUrl: event.body.fileUrl,
                uploadProgress: 100
              });
              fileControl?.setValue('', { emitEvent: false });
              fileControl?.disable({ emitEvent: false });
              // console.log('File uploaded, URL stored:', event.body.fileUrl);
              // console.log('Specific Content Group value AFTER patch:', contentGroup.getRawValue());
            } else {
              throw new Error('Backend did not return fileUrl');
            }
          }
        },
        error: (err) => {
          console.error('File upload failed:', err);
          contentGroup.patchValue({ fileName: 'Upload failed', uploadProgress: -1, fileUrl: '' });
          urlControl?.enable({ emitEvent: false });
          fileControl?.setValue('', { emitEvent: false });
          fileControl?.enable({ emitEvent: false });
        }
      });
    } else {
      if (!urlControl?.value) {
        fileControl?.enable({ emitEvent: false });
        urlControl?.enable({ emitEvent: false });
      }
    }
  }

  contentRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const contentType = control.get('contentType');
    const textContent = control.get('textContent');
    const file = control.get('file');
    const url = control.get('fileUrl');

    if (!contentType || !textContent || !file || !url) {
      return null;
    }

    if (contentType.value === 'Text') {
      if (!textContent.value) {
        return { textContentRequired: true };
      }
    }

    else if (contentType.value === 'Video' || contentType.value === 'Pdf' || contentType.value === 'Word') {
      if (!file.value && !url.value) {
        return { fileOrUrlRequired: true };
      }
    }

    return null;
  }


  addContent(sectionIndex: number) {
    this.getContent(sectionIndex).push(this.newContent());
  }

  removeContent(sectionIndex: number, contentIndex: number) {
    this.getContent(sectionIndex).removeAt(contentIndex);
  }

  ///////////////////////////////////////////////////////////////

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      console.warn('Invalid form: ', this.courseForm.value);
      return;
    }

    const newCourseData = this.courseForm.getRawValue();
    // console.log('Sending course:', newCourseData);
    // console.log('Data being sent to json-server:', JSON.stringify(newCourseData, null, 2));
    this.courseService.create(newCourseData).subscribe({
      next: (createdCourse) => {
        console.log('Course created:', createdCourse);

        const currentUser = this.auth.CurrentUserValue;

        if (currentUser && createdCourse.id) {
          const updatedMember: Member = {
            ...currentUser,
            createdCourses: [...(currentUser.createdCourses || []), createdCourse.id]
          };

          this.memberService.put(updatedMember.id, updatedMember).subscribe({
            next: (savedMember) => {
              console.log("Member updated on server", savedMember);
              this.auth.updateCurrentUser(savedMember);
              this.router.navigate(['/mycourses']);
            },
            error: (updateError) => {
              console.error("Error updating member: ", updateError);
              alert('Course created, but failed to update user course list.');
              this.router.navigate(['/mycourses']);
            }
          });
        } else {
          console.warn('No current user found to update created courses list.');
          this.router.navigate(['/mycourses']);
        }
      },
      error: (err) => {
        console.error('Error creating course:', err);
      }
    });
  }
  resetFileState(sectionIndex: number, contentIndex: number): void {
    const contentGroup = this.getContent(sectionIndex).at(contentIndex) as FormGroup;
    const currentFileUrl = contentGroup.get('fileUrl')?.value;

    contentGroup.patchValue({
      file: '',
      fileUrl: '',
      fileName: '',
      uploadProgress: 0
    });

    contentGroup.get('file')?.enable({ emitEvent: false });
    contentGroup.get('fileUrl')?.enable({ emitEvent: false });

    if (currentFileUrl) {
      this.fileUpload.deleteFile(currentFileUrl).subscribe({
        next: () => console.log('Previous file deleted from server:', currentFileUrl),
        error: (err) => console.error('Failed to delete previous file:', err)
      });
    }
  }
}
