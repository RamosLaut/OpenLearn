import { Course } from "./Course";

export default interface Subscription{

    id?: number;
    userId: string;
    courseId: string;

    course?: Course;
}