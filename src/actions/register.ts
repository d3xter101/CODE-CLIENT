import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  year: number;
  major: string;
  recaptchaToken: string;
  areaOfInterests: string[]; 
}

export async function registerAction(data: RegisterInput) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      data,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // if backend sends cookies
      }
    );

    return res.data; // backend can return user or message
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, "Registration failed, please try again."));
  }
}