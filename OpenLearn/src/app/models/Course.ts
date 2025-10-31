import { CourseCategory } from "../enums/course-category";

export interface Content {
  id: string;
  title: string;
  contentType: 'Video' | 'Pdf' | 'Word' | 'Text';
  description: string;
  fileUrl?: string;
  textContent?: string;
  contentDescription: string;
}

export interface Section {
  id: string;
  title: string;
  content: Content[];
}

export interface Course {
  id: string;
  title: string;
  description: string;

  instructorId: string;
  instructorName: string;

  category: CourseCategory;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  publishedDate: Date;
  status: 'draft' | 'published' | 'archived';

  sections: Section[];
  totalDurationInHours: number;
  
  coverImageUrl?: string;
  averageRating?: number;
  numberOfReviews?: number;
}