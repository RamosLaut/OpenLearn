
export default interface Member{
    id: string;
    userName: string;
    email: string;
    fullName: string;
    registrationDate: Date;

    profilePhotoUrl?: string;
    biography?: string;
    professionalTitle?: string;
    links?: SocialLinks;

    accountStatus: 'active' | 'pendingVerification' | 'suspended' | 'deleted';
    createdCourses: string[];
    enrolledCourses: string[];
    password?: string;
}

export interface SocialLinks{
    webpage?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
}
