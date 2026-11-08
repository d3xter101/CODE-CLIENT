"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAreaOfInterests, AreaOfInterest } from "@/actions/getAreaOfInterests";
import { registerAction } from "@/actions/register";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/cn";
import ReCAPTCHA from "react-google-recaptcha";
import { Loading } from "../loading";

const areaOfInterestSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2).max(50),
});

const schema = z.object({
    id: z.string().uuid().optional(),
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(30, "First name must be at most 30 characters")
        .trim(),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(30, "Last name must be at most 30 characters")
        .trim(),
    email: z.string().email("Invalid email address").trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10}$/, "The number must contain exactly 10 digits"),

    year: z
        .number()
        .int()
        .min(1, "Year must be at least 1")
        .max(8, "Year must be at most 8"),
    major: z
        .string()
        .min(2, "Major must be at least 2 characters")
        .max(100, "Major must be at most 100 characters")
        .trim(),
    areaOfInterest: z
        .array(areaOfInterestSchema)
        .nonempty("At least one area of interest must be selected"),
});

type FormFields = z.infer<typeof schema>;

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RegisterForm() {
    const [areas, setAreas] = useState<AreaOfInterest[]>([]);
    const [openMajor, setOpenMajor] = useState(false);


    useEffect(() => {
        const loadAreas = async () => {
            const data = await fetchAreaOfInterests();
            setAreas(data);
        };
        loadAreas();
    }, []);

    const form = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: "",
            year: 1,
            major: "",
            areaOfInterest: [],
        },
    });

    const router = useRouter()

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaValid, setCaptchaValid] = useState(false);


    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    //  update token + validity
    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        setCaptchaValid(!!token);
    };

    const onSubmit = async (values: FormFields) => {
        if (!captchaValid || !captchaToken) {
            toast.error("Please verify that you are not a robot");
            return;
        }

        try {
            setLoading(true);
            const requestBody = {
                ...values,
                areaOfInterests: values.areaOfInterest.map((a) => a.id!),
                recaptchaToken: captchaToken, //  send token to backend
            };

            await registerAction(requestBody);

            toast.success("Registration successful!");
            form.reset();
            router.push("/");
        } catch (err: unknown) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration error:", err);
        }
        finally {
            setLoading(false); // stop loading
        }
    };

    return (
        <div className="container mt-10 px-4 mb-20">
            {/* Header */}
            <div className="flex flex-col items-center mb-12 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={container}
                    className="space-y-4"
                >
                    <motion.h2
                        variants={item}
                        className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text font-serif text-3xl font-bold tracking-tight text-transparent md:text-4xl"
                    >
                        Register Now
                    </motion.h2>
                    <motion.p
                        variants={item}
                        className="max-w-[800px] text-muted-foreground md:text-lg leading-relaxed"
                    >

                        Fill in this form to start your journey.<br />
                        <span className="font-medium text-foreground">
                            Note: After registration, your account needs to be activated before you
                            can log in.
                        </span>
                    </motion.p>

                </motion.div>
            </div>

            {/* Form */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                <Image
                    src="/form.svg"
                    alt="student"
                    width={400}
                    height={500}
                    className="hidden md:block w-[400px] h-auto"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-2xl"
                >
                    <Card className="shadow-lg rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Join CODE</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* First Name / Last Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-secondary"
                                                            placeholder="Enter your first name"
                                                            {...field}
                                                        />
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
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-secondary"
                                                            placeholder="Enter your last name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Email / Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-secondary"
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-secondary"
                                                            placeholder="0611223344"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Year / Major */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="year"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Year (Bac+1, Bac+2...)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-secondary"
                                                            type="number"
                                                            min={1}
                                                            max={10}
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(Number(e.target.value))
                                                            }
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
                                                <FormItem className="flex flex-col col-span-1">
                                                    <FormLabel>Major</FormLabel>
                                                    <Popover open={openMajor} onOpenChange={setOpenMajor}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "justify-between",
                                                                        !field.value && "text-muted-foreground bg-transparent border border-secondary dark:border-secondary"
                                                                    )}
                                                                >
                                                                    {field.value || "Select Major"}
                                                                    <ChevronsUpDown className="opacity-50 h-4 w-4" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[250px] p-0 ">
                                                            <Command>
                                                                <CommandInput placeholder="Search major..." className="h-9" />
                                                                <CommandList>
                                                                    <CommandEmpty>No major found</CommandEmpty>

                                                                    {/* --- TC Group --- */}
                                                                    <CommandGroup heading="TC">
                                                                        {["GI", "GESE", "GC", "GMSI", "GB", "MSD"].map((m) => (
                                                                            <CommandItem
                                                                                key={m}
                                                                                value={`TC ${m}`}
                                                                                onSelect={() => {
                                                                                    form.setValue("major", `TC ${m}`);
                                                                                    form.clearErrors("major");
                                                                                    setOpenMajor(false);
                                                                                }}
                                                                            >
                                                                                TC {m}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        field.value === `TC ${m}` ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>

                                                                    {/* --- FI Group --- */}
                                                                    <CommandGroup heading="FI">
                                                                        {["GI", "IBIM", "ISESE", "ICP", "PIC"].map((m) => (
                                                                            <CommandItem
                                                                                key={m}
                                                                                value={`FI ${m}`}
                                                                                onSelect={() => {
                                                                                    form.setValue("major", `FI ${m}`);
                                                                                    form.clearErrors("major");
                                                                                    setOpenMajor(false);
                                                                                }}
                                                                            >
                                                                                FI {m}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        field.value === `FI ${m}` ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>

                                                                    {/* --- LST Group --- */}
                                                                    <CommandGroup heading="LST">
                                                                        {[
                                                                            "GI", "SITD", "GESA", "EEA", "CAE",
                                                                            "GC", "MECAT", "SB", "BGM", "TACQ", "GM",
                                                                        ].map((m) => (
                                                                            <CommandItem
                                                                                key={m}
                                                                                value={`LST ${m}`}
                                                                                onSelect={() => {
                                                                                    form.setValue("major", `LST ${m}`);
                                                                                    form.clearErrors("major");
                                                                                    setOpenMajor(false);
                                                                                }}
                                                                            >
                                                                                LST {m}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        field.value === `LST ${m}` ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>

                                                                    {/* --- MST Group --- */}
                                                                    <CommandGroup heading="MST">
                                                                        {[
                                                                            "AGQ", "BI", "ICSM", "IMI", "ATSII",
                                                                            "VMIB", "IRISTI", "PVRM", "RSI", "MECA", "MA",
                                                                        ].map((m) => (
                                                                            <CommandItem
                                                                                key={m}
                                                                                value={`MST ${m}`}
                                                                                onSelect={() => {
                                                                                    form.setValue("major", `MST ${m}`);
                                                                                    form.clearErrors("major");
                                                                                    setOpenMajor(false);
                                                                                }}
                                                                            >
                                                                                MST {m}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        field.value === `MST ${m}` ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>

                                                                    <CommandGroup heading="Other">
                                                                        <CommandItem
                                                                            value="Other"
                                                                            onSelect={() => {
                                                                                form.setValue("major", "Other");
                                                                                form.clearErrors("major");
                                                                                setOpenMajor(false);
                                                                            }}
                                                                        >
                                                                            Other
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    field.value === "Other" ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    {/* Areas of Interest */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="areaOfInterest"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Areas of Interest</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between bg-transparent border border-secondary dark:border-secondary  h-auto"
                                                            >
                                                                {field.value.length > 0 ? (
                                                                    <div className="flex flex-wrap gap-1 max-w-full">
                                                                        {field.value.map((a) => (
                                                                            <span
                                                                                key={a.id}
                                                                                className="px-2 py-0.5 rounded-md bg-secondary truncate max-w-[100px]"
                                                                            >
                                                                                {a.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    "Select areas"
                                                                )}
                                                                <ChevronsUpDown className="opacity-50 h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command>
                                                                {/*  Search bar */}
                                                                <CommandInput placeholder="Search areas..." />
                                                                <CommandList className="max-h-52 overflow-y-auto">
                                                                    <CommandEmpty>No area found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {areas.map((area) => {
                                                                            const isSelected = field.value.some((a) => a.id === area.id)
                                                                            return (
                                                                                <CommandItem
                                                                                    key={area.id}
                                                                                    onSelect={() => {
                                                                                        if (isSelected) {
                                                                                            field.onChange(
                                                                                                field.value.filter((a) => a.id !== area.id)
                                                                                            )
                                                                                        } else {
                                                                                            field.onChange([...field.value, area])
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"
                                                                                            }`}
                                                                                    />
                                                                                    {area.name}
                                                                                </CommandItem>
                                                                            )
                                                                        })}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />


                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                className="border-secondary pr-10"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>


                                        <div className="flex justify-center items-center text-center sm:text-left px-2">
                                            <p className="text-sm leading-relaxed max-w-md">
                                                By clicking register, you agree to our{" "}
                                                <Link
                                                    className="text-secondary dark:text-primary underline underline-offset-2"
                                                    href="/privacy-policy"
                                                >
                                                    Privacy Policy
                                                </Link>
                                                .
                                            </p>
                                        </div>
                                    

                                        <div className="flex justify-center mx-2 md:mx-0">
                                            <ReCAPTCHA
                                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                                onChange={handleCaptchaChange}
                                            />
                                        </div>


                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loading className="text-primary-foreground" /> : "Register"}
                                        </Button>

                                    
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
