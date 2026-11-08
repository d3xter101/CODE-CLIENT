"use client";

import useSWR from "swr";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import type { Profile } from "@/types/backendTypes";

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  year: number;
  major: string;
  areaOfInterests: string[];
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

const PROFILE_URL = "/api/v1/member/profile";

const fetcher = async (url: string): Promise<Profile | null> => {
  try {
    const res = await api.get<Profile>(url);
    return res.data;
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    // not logged in
    if (status === 401 || status === 403) return null;
    throw err;
  }
};

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile | null>(PROFILE_URL, fetcher, {
    revalidateOnFocus: false,
  });

  const updateProfile = async (input: UpdateProfileInput) => {
    const res = await api.put<Profile>(PROFILE_URL, input);
    await mutate(res.data, false);
    return res.data;
  };

  const changePassword = async (input: ChangePasswordInput) => {
    await api.put(`${PROFILE_URL}/password`, input);
  };

  return {
    profile: data ?? null,
    loading: isLoading,
    error,
    updateProfile,
    changePassword,
  };
}
