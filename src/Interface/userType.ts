export interface UserType {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  hashedpassword?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  otp?: string;
}
