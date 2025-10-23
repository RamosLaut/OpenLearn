export default interface Course{
    id: string;
    title: string;
    category: string;
    startdate: Date;
    enddate: Date;
    description: string;
    status: "active" | "completed" | "inactive";
    lessons: string[];
}