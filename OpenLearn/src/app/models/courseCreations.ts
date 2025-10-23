import { CourseCategory } from "../enums/course-category"
import { Section } from "./Course";

export interface CourseCreationsData {
    title: string
    description: string
    category: CourseCategory
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    sections: Section[];
}