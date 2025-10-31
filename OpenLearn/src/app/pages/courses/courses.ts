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
  filteredCourses: Course[] = [];
  displayedCourses: Course[] = [];

  isLoading: boolean = false;
  
  searched: string = '';
  selectedCategory:string = '';
  sortBy:string = 'default';

  itemsIncrement: number = 8;
  itemsToShow: number = this.itemsIncrement;

  constructor(public courseService:CourseService){}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(){
    this.isLoading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.allCourses = data.sort((a,b) => {
          const dateA = new Date(a.publishedDate).getTime();
          const dateB = new Date(b.publishedDate).getTime();
          return dateB - dateA;
        });

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
    this.itemsToShow = this.itemsIncrement;

    let tempCourses = [...this.allCourses];
    const category = this.selectedCategory;
    const search = this.searched ? this.searched.toLowerCase() : '';

   /*  if(!category && !search){
      this.displayedCourses = this.allCourses.slice(0,10);
      return;
    } */

    if(category && category !== 'all'){
      tempCourses = tempCourses.filter(course => course.category === category);
    }

    if(search){
      tempCourses = tempCourses.filter(course => course.title.toLocaleLowerCase().includes(search) || course.description.toLocaleLowerCase().includes(search));
    }

    switch(this.sortBy) {
      case 'A-z':
        tempCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'Z-a':
        tempCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'default':
        tempCourses.sort((a, b) => {
          const dateA = new Date(a.publishedDate).getTime();
          const dateB = new Date(b.publishedDate).getTime();

          return dateB - dateA;
        });
        break;
        default:
          break;
    }

    this.filteredCourses = tempCourses;

    this.updateDisplayedCourses();

  }

  updateDisplayedCourses (){
    this.displayedCourses = this.filteredCourses.slice(0, this.itemsToShow);
  }

  loadMore(){
    this.itemsToShow += this.itemsIncrement;

    this.updateDisplayedCourses();
  }


}


