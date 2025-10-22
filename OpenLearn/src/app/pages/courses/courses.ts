import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  imports: [],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses {
  category!: string
  searched!: string
  selectedCategory!:string


  searchTerm(){}
  sortBy(){}
}
