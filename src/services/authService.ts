import { UserType } from "../Interface/userType";
import userDetails from "../model/authModel";

export async function create_user_service({
  firstname,
  lastname,
  gender,
  mobile,
  dateOfBirth,
  email,
  hashedpassword,
}: UserType) {
  const result = await userDetails.create({
    firstname,
    lastname,
    gender,
    mobile,
    dateOfBirth,
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

// export async function verify_otp_service(otp: string) {
//   const result = await UserDetails.findOneAndUpdate(
//     { otp: otp },
//     { verified: "yes" },
//     { new: true }
//   );
//   return result;
// }

// export async function find_user(email: string) {
//   const result = await UserDetails.findOne({ email });
//   return result;
// }

// export async function fetch_user_details(email: string) {
//   const result = await UserDetails.findOne({ email });
//   return result;
// }
