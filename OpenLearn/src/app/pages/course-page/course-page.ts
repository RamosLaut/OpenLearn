import { Component } from '@angular/core';
import { Course } from '../../models/Course';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-course-page',
  imports: [],
  templateUrl: './course-page.html',
  styleUrl: './course-page.css'
})
export class CoursePage {
  course!: Course

  constructor(
    private route: ActivatedRoute,
    private cService: CourseService
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['id']

    this.cService.getById(courseId).subscribe(c => {
      this.course = c
    })
  }
}
