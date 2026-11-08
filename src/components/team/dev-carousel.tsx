"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { OfficeMember } from "@/types/backendTypes";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import DevCard from "./dev-card";

/** Moving carousel of the developers; pauses on hover */
export default function DevCarousel({ devs }: { devs: OfficeMember[] }) {
  return (
    <Marquee className="py-2">
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
      <MarqueeContent speed={35} autoFill>
        {devs.map((dev) => (
          <MarqueeItem key={dev.id} className="flex">
            <DevCard member={dev} />
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  );
}
