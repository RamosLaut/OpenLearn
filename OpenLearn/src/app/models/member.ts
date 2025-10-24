
export default interface Member{
    id: string;
    username: string;
    email: string;
    fullName: string;
    registrationDate: Date;

    profilePhotoUrl?: string;
    biography?: string;
    professionalTitle?: string;
    links?: SocialLinks;

    accountStatus: 'active' | 'pendingVerification' | 'suspended' | 'deleted';
    createdCourses: number[];
    enrolledCourses: number[];
}

export interface SocialLinks{
    webpage?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
}
