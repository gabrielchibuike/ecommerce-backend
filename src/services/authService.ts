import { UserType } from "../Interface/userType";
import userDetails from "../model/authModel";

export async function create_user_service({
  firstName,
  lastName,
  email,
  hashedpassword,
}: UserType) {
  const result = await userDetails.create({
    firstName,
    lastName,
    email,
    password: hashedpassword,
  });
  return result;
}

export async function login_user_service(email: string, password: string) {
  const result = await userDetails.findOne({
    email,
    password,
  });
  return result;
}

export async function find_user(email: string) {
  const isExisting = await userDetails.findOne({
    email,
  });
  return isExisting;
}

export async function get_user_email_service(email: string) {
  const result = await userDetails.findOne({
    email,
  });
  return result;
}
export async function verify_otp_service(otp: string) {
  const result = await userDetails.findOneAndUpdate(
    { otp: otp },
    { verified: "yes", otp: "" },
    { new: true }
  );
  return result;
}

export async function reset_password_service(password: string, email: string) {
  const result = await userDetails.findOneAndUpdate(
    { email: email },
    { password: password },
    { new: true }
  );
  return result;
}

// export async function fetch_user_details(email: string) {
//   const result = await UserDetails.findOne({ email });
//   return result;
// }
