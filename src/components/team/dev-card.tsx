// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfficeMember } from "@/types/backendTypes";
import { isOptimizableImage } from "@/lib/image";

/** Smaller version of the office member card, for the developers carousel */
export default function DevCard({ member }: { member: OfficeMember }) {
  const fullName = `${member.firstName} ${member.lastName}`;
  const socials = [
    { href: member.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: member.instagram, label: "Instagram", Icon: Instagram },
  ].filter((s) => s.href?.trim());

  return (
    <Card className="group h-[265px] w-40 gap-0 overflow-hidden py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {member.image?.uri ? (
          <Image
            src={member.image.uri}
            unoptimized={!isOptimizableImage(member.image.uri)}
            alt={fullName}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-primary text-3xl font-semibold text-primary-foreground">
            {member.firstName[0]}
            {member.lastName[0]}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 p-3 pt-2">
        <h3 className="text-sm font-semibold leading-tight tracking-tight">
          {fullName}
        </h3>
        <p className="text-[11px] font-medium uppercase leading-snug tracking-wide text-primary">
          {member.href ? (
            <Link href={member.href} className="underline-offset-2 hover:underline">
              {member.position}
            </Link>
          ) : (
            member.position
          )}
        </p>
        {socials.length > 0 && (
          <div className="mt-auto flex gap-2 border-t pt-2">
            {socials.map(({ href, label, Icon }) => (
              <Button
                key={label}
                asChild
                size="icon"
                variant="secondary"
                className="size-7 rounded-full transition-transform duration-200 hover:scale-110"
              >
                <a
                  href={href.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${fullName} on ${label}`}
                >
                  <Icon className="size-3.5" />
                </a>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
