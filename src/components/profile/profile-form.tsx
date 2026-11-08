"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { mutate as globalMutate } from "swr";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchAreaOfInterests, AreaOfInterest } from "@/actions/getAreaOfInterests";
import { UpdateProfileInput } from "@/hooks/use-profile";
import { getApiErrorMessage } from "@/lib/api-error";
import { MAJOR_GROUPS } from "@/lib/majors";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/backendTypes";
import { fieldClassName } from "./field-styles";

const schema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must be at most 50 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must be at most 50 characters"),
  phoneNumber: z.string().trim().regex(/^[0-9]{10}$/, "The number must contain exactly 10 digits"),
  year: z.number().int().min(1, "Year must be at least 1").max(10, "Year must be at most 10"),
  major: z.string().trim().min(1, "Select your major"),
  areaOfInterests: z.array(z.object({ id: z.string(), name: z.string() })),
});

type FormFields = z.infer<typeof schema>;

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (input: UpdateProfileInput) => Promise<Profile>;
}

function toFormValues(profile: Profile): FormFields {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    year: profile.year,
    major: profile.major,
    areaOfInterests: profile.areaOfInterests,
  };
}

export default function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [areas, setAreas] = useState<AreaOfInterest[]>([]);
  const [openMajor, setOpenMajor] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAreaOfInterests().then(setAreas);
  }, []);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(profile),
  });

  const handleSubmit = async (values: FormFields) => {
    try {
      setSaving(true);
      const updated = await onSubmit({
        ...values,
        areaOfInterests: values.areaOfInterests.map((a) => a.id),
      });
      form.reset(toFormValues(updated));
      // refresh the name shown in the header
      globalMutate("/api/v1/member");
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update your profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>Your email can&apos;t be changed. Contact the club office if it&apos;s wrong.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input className={cn("capitalize", fieldClassName)} autoComplete="given-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input className={cn("capitalize", fieldClassName)} autoComplete="family-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input className={fieldClassName} value={profile.email} disabled readOnly />
              </FormItem>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input className={fieldClassName} type="tel" inputMode="numeric" autoComplete="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year (Bac+1, Bac+2...)</FormLabel>
                    <FormControl>
                      <Input
                        className={fieldClassName}
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Major</FormLabel>
                    <Popover open={openMajor} onOpenChange={setOpenMajor}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("justify-between font-normal", fieldClassName, !field.value && "text-muted-foreground")}
                          >
                            {field.value || "Select major"}
                            <ChevronsUpDown className="opacity-50 h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search major..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No major found</CommandEmpty>
                            {MAJOR_GROUPS.map((group) => (
                              <CommandGroup key={group.heading} heading={group.heading}>
                                {group.majors.map((m) => (
                                  <CommandItem
                                    key={m}
                                    value={m}
                                    onSelect={() => {
                                      form.setValue("major", m, { shouldDirty: true });
                                      form.clearErrors("major");
                                      setOpenMajor(false);
                                    }}
                                  >
                                    {m}
                                    <Check className={cn("ml-auto", field.value === m ? "opacity-100" : "opacity-0")} />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="areaOfInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas of interest</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll get an email when an event in one of these areas is announced.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((a) => (
                      <span
                        key={a.id}
                        className="flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2 py-1 text-sm"
                      >
                        {a.name}
                        <button
                          type="button"
                          aria-label={`Remove ${a.name}`}
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => field.onChange(field.value.filter((x) => x.id !== a.id))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className={cn(fieldClassName, "h-8")}>
                          Add area
                          <ChevronsUpDown className="opacity-50 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search areas..." />
                          <CommandList className="max-h-52 overflow-y-auto">
                            <CommandEmpty>No area found.</CommandEmpty>
                            <CommandGroup>
                              {areas.map((area) => {
                                const isSelected = field.value.some((a) => a.id === area.id);
                                return (
                                  <CommandItem
                                    key={area.id}
                                    value={area.name}
                                    onSelect={() =>
                                      field.onChange(
                                        isSelected
                                          ? field.value.filter((a) => a.id !== area.id)
                                          : [...field.value, area]
                                      )
                                    }
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                    {area.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!form.formState.isDirty || saving}
                onClick={() => form.reset(toFormValues(profile))}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty || saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
