import * as z from "zod"

export const JoinClassSchema = z.object({
    code: z.string({ required_error: "Code is required!" })
});

export const ResetSchema = z.object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email.' })
      .trim(),
});

export const signInSchema = z.object({
    id_no: z.string({ required_error: "ID No. is required!" })
        .min(1, "ID No. is required!"),
    password: z.string({ required_error: "Password is required!" })
        .min(1, "Password is required!")
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email.' })
      .trim(),
    password: z.string().trim(),
    confirmPassword: z.string().trim(),
    fname: z.string().min(1, { message: 'First name is required.' }),
    lname: z.string().min(1, { message: 'Last name is required.' }),
    gender: z.enum(['Male', 'Female'], {
      errorMap: () => ({ message: 'Please select your gender.' }),
    }),
    bday: z.coerce.date(),
    school: z.enum(['SNHS', 'BNHS', 'MNCHS', 'BSNHS', 'PBNHS'], {
      errorMap: () => ({ message: 'Please select your school.' }),
    }),
    role: z.enum(['student'], {
      errorMap: () => ({ message: 'Please select your role.' }),
    }),
    id_no: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });


  export const updateProfileSchema = z
  .object({
    bday: z.coerce.date(),
    school: z.enum(['SNHS', 'BNHS', 'MNCHS', 'BSNHS', 'PBNHS'], {
      errorMap: () => ({ message: 'Please select your school.' }),
    }),
    id_no: z.string(),
  })
