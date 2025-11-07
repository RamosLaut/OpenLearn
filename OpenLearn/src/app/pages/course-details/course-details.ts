import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails implements OnInit {

  course: Course | undefined;
  isLoading: boolean = true;
  isSubscribing: boolean = false;

  isSubscribed: boolean = false;
  currentSubscriptionId: number | undefined;

  constructor (private route: ActivatedRoute, private router: Router, private courseService: CourseService, private authService: Auth){ 
  }

  ngOnInit(): void {
    const courseId= this.route.snapshot.paramMap.get('id');

    if(courseId){
      this.loadCourseDetails(courseId);
    } else {
      this.isLoading = false;
      console.error("Course ID not found in the URL");
    }
  }

  loadCourseDetails(id: string): void{
    this.isLoading = true;

    this.courseService.getById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.isLoading = false;
        this.checkSubscriptionStatus();
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
    
    const currentUser = this.authService.CurrentUserValue;

    if(!currentUser || !currentUser.id){
      console.log("User not logged in. Redirecting to /login");
      alert("You need to log in to subscribe.");

      this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
      return;
    }

    const courseId= this.course.id;
    const userId = currentUser.id;

    this.isSubscribing = true;

    this.courseService.subscribeUserToCourse(courseId, userId).subscribe({
      next: (response) => {
        console.log("Subscription successful: ", response);
        alert("You have successfully subscribed!");
        this.isSubscribing = false;

        this.isSubscribed= true;
        this.currentSubscriptionId= response.id;

        this.router.navigate(['/mycourses'], {queryParams: {returnUrl: this.router.url}});
      },
      error: (err) => {
        console.log("Error subscribing to course: ", err);
        alert("There was an error subscribing. Please try again.");
        this.isSubscribing = false;
      }
    });
  }

  checkSubscriptionStatus(): void{

    const currentUser = this.authService.CurrentUserValue;
    if (!currentUser || !this.course) {
      this.isSubscribed = false;
      return;
    }

    this.courseService.getSubscription(currentUser.id, this.course.id).subscribe(Subscriptions => {
      if (Subscriptions.length > 0) {
        this.isSubscribed= true;
        this.currentSubscriptionId = Subscriptions[0].id;
      } else{
        this.isSubscribed= false;
        this.currentSubscriptionId= undefined;
      }
    })
  }

  unSubscribeFromCourse(): void{

    if (this.isSubscribing || !this.currentSubscriptionId) {
      console.error("No subscription ID found to unsubscribe.");
      return;
    }

    this.isSubscribing= true;

    this.courseService.unSubscribeUserToCourse(this.currentSubscriptionId).subscribe({
      next: () => {
        console.log("Unsubscription successful");
        alert("You have successfully unsubscribed.");
        this.isSubscribing=false;
        this.isSubscribed= false;

        this.currentSubscriptionId= undefined;
      },
      error:(err) => {
        console.log("Error unsubscribing: ", err);
        alert("There was an error unsubscribing. Please try again.");
        this.isSubscribing = false;
      },
    })
  }
}
