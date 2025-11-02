import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails implements OnInit {

  course: Course | undefined;
  isLoading: boolean = true;
  isSubscribing: boolean = false;

  constructor (private route: ActivatedRoute, private router: Router, private courseService: CourseService, private authService: Auth){ 
  }
  ngOnInit(): void {
    const courseId= this.route.snapshot.paramMap.get('id');

    if(courseId){
      this.loadCurseDetails(courseId);
    } else {
      this.isLoading = false;
      console.error("Course ID not found in the URL");
    }
  }

  loadCurseDetails(id: string): void{
    this.isLoading = true;

    this.courseService.getById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.isLoading = false;
      }, 
      error: (err) => {
        console.log("Error loading course details", err);
        this.isLoading = false;
      },
    });
  }

  subscribeToCourse(): void{

    if(this.isSubscribing || !this.course){
      return;
    }
    this.isSubscribing = true;

    const userId= this.authService.CurrentUserValue?.id;

    if(this.authService.isLoggedIn()){

      console.log("User logged in. Subscribing to the course: ", this.course?.title);
      alert("You have successfully subscribed!");
      this.isSubscribing = false;
    } else {
      console.log("User not logged in. Redirecting to /login");
      alert("You need to log in to subscribe.");
      this.isSubscribing = false;

      this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
    }
  }

}
