'use client'
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram } from "lucide-react";
import { OfficeMember } from "@/types/backendTypes";
import { isOptimizableImage } from "@/lib/image";

interface OfficeMemberCardProps {
  member: OfficeMember | undefined;
}

const OfficeMemberCard: React.FC<OfficeMemberCardProps> = ({ member }) => {
  if (!member) {
    return
  }

  const fullName = `${member.firstName} ${member.lastName}`;
  const hasSocials = Boolean(member.linkedin || member.instagram);

  return (
    <Card className="group md:w-56 gap-0 overflow-hidden py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      {/* Photo */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {member.image?.uri ? (
          <Image
            src={member.image.uri}
            unoptimized={!isOptimizableImage(member.image.uri)}
            alt={fullName}
            fill
            sizes="(min-width: 768px) 224px, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-primary text-4xl font-semibold text-primary-foreground">
            {member.firstName[0]}
            {member.lastName[0]}
          </div>
        )}
        {/* Fade into the card, so the photo and the text read as one surface */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 p-4 pt-3">
        {/* Name and position */}
        <h3 className="text-base font-semibold leading-tight tracking-tight">
          {fullName}
        </h3>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {member.position}
        </p>

        {/* Social links, pushed to the bottom so they sit at the same height in every card of a row */}
        {hasSocials && (
          <div className="mt-auto flex gap-2 border-t pt-3">
            {member.linkedin && (
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="size-8 rounded-full transition-transform duration-200 hover:scale-110"
              >
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${fullName} on LinkedIn`}
                >
                  <Linkedin className="size-4" />
                </a>
              </Button>
            )}
            {member.instagram && (
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="size-8 rounded-full transition-transform duration-200 hover:scale-110"
              >
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${fullName} on Instagram`}
                >
                  <Instagram className="size-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfficeMemberCard;
