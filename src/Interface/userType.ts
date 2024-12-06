export interface UserType {
  id?: string;
  firstname: string;
  lastname: string;
  mobile: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  password?: string;
  hashedpassword?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  otp?: string;
}
