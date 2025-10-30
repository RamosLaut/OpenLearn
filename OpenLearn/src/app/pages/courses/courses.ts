import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course-service';
import { Course } from '../../models/Course';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [FormsModule, RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit{
  allCourses: Course[] = [];
  displayedCourses: Course[] = [];

  isLoading: boolean = false;
  
  searched: string = '';
  selectedCategory:string = '';

  constructor(public courseService:CourseService){}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(){
    this.isLoading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.allCourses = data;
        this.courseService.courses = data;
        this.applyFilters();

        this.isLoading = false;
      },
      error: (err) => { console.log(err);
        this.isLoading = false;
      }   
      }); 
  }

  applyFilters(){
    let tempCourses = this.allCourses;

    const category = this.selectedCategory;
    const search = this.searched ? this.searched.toLowerCase() : '';

    if(!category && !search){
      this.displayedCourses = this.allCourses.slice(0,10);
      return;
    }

    if(category && category !== 'all'){
      tempCourses = tempCourses.filter(course => course.category === category);
    }

    if(search){
      tempCourses = tempCourses.filter(course => course.title.toLocaleLowerCase().includes(search) || course.description.toLocaleLowerCase().includes(search));
    }

    this.displayedCourses = tempCourses;

  }

}
