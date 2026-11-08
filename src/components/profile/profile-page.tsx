"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/loading";
import ProfileForm from "./profile-form";
import ChangePasswordForm from "./change-password-form";

export default function ProfilePage() {
  const { profile, loading, error, updateProfile, changePassword } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>We couldn&apos;t load your profile. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle>You are not logged in</CardTitle>
          <CardDescription>Log in to view and edit your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Summary */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="size-16 text-xl">
            <AvatarFallback className="uppercase">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h1 className="font-serif text-2xl font-bold capitalize">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-muted-foreground break-all">{profile.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {format(new Date(profile.createdAt), "MMMM yyyy")}
              {" · "}
              Absences: {profile.absences}/3
            </p>
          </div>
        </CardContent>
      </Card>

      <ProfileForm profile={profile} onSubmit={updateProfile} />
      <ChangePasswordForm onSubmit={changePassword} />
    </div>
  );
}
