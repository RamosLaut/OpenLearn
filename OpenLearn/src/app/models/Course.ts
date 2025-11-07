import { CourseCategory } from "../enums/course-category";
import { Announcement } from "./Announcement";
import { QuizQuestion } from "./quizQuestion";


export interface ContentBase {
  id: string;
  title: string;
  contentDescription: string;
}

export interface VideoContent extends ContentBase {
  contentType: 'Video';
  fileUrl: string;
}

export interface PdfContent extends ContentBase{
  contentType: 'Pdf';
  fileUrl: string;
}

export interface WordContent extends ContentBase{
  contentType: 'Word';
  fileUrl: string;
}

export interface TextContent extends ContentBase{
  contentType: 'Text';
  textContent: string;
}

export interface QuizContent extends ContentBase{
  contentType: 'Quiz';
  questions: QuizQuestion[];
}

export type Content =
  | VideoContent
  | PdfContent
  | WordContent
  | TextContent
  | QuizContent;

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
  announcements?: Announcement[];
  
  coverImageUrl?: string;
  averageRating?: number;
  numberOfReviews?: number;
}