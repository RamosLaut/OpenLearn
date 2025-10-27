export interface MemberRegistration{
    userName: string;
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;

    registrationDate: Date;
    accountStatus: 'active' | 'pendingVerification' | 'suspended' | 'deleted';

}