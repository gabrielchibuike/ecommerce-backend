import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
// const passwordComplexity = require('joi-password-complexity')

interface CreateAccSchema {
  fullName: string;
  mobileNumber: number;
  email: string;
  password: string;
}

export const createAccSchema: Joi.ObjectSchema<CreateAccSchema> = Joi.object({
  firstname: Joi.string().required().trim().messages({
    "string.empty": "This field is required",
  }),

  lastname: Joi.string().required().trim().messages({
    "string.empty": "This field is required",
  }),

  mobile: Joi.string().min(11).max(11).required(),

  gender: Joi.string().required(),

  dateOfBirth: Joi.string().required(),

  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": "This field is required",
      "string.email": "email must be a valid email",
    }),

  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
  // password: Joi.string()
  //   .min(8)
  //   .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  //   .messages({
  //     "string.password": "password must must the above pattern",
  //   }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
});

export const updateSchema = Joi.object({
  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
  Cpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Retyped password must match the password",
  }),
});
