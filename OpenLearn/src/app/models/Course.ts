import { CourseCategory } from "../enums/course-category";

export interface Lesson {
  id: number;
  title: string;
  abstract?: string;
  lessonType: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  content?: string;
  durationInMinutes: number; 
  resources?: string[]; 
}

export interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;

  instructorId: string;
  instructorName: string;

  category: CourseCategory;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  publishedDate: Date;
  status: 'draft' | 'published' | 'archived';

  sections: Section[];
  totalDurationInHours: number;
  
  coverImageUrl?: string;
  averageRating?: number;
  numberOfReviews?: number;
}