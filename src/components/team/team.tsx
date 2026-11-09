// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import OfficeMemberCard from "./office-member-card"
import PageHero from "@/components/ui/page-hero"
import { fetchMembers, OfficeMember } from "@/actions/fetchMembers"
import DevCarousel from "./dev-carousel"
import { devs } from "@/seed/office-members"

export default async function TeamTreePage() {
    const officeMembers: OfficeMember[] = await fetchMembers();

    // The position is free text in the admin panel: these lists only set the order, and an unknown title still shows up
    const leadershipOrder = ["president", "vice president", "secretary general", "human resources", "treasury"]
    const officerOrder = [
        "chief development officer", "chief logistics officer", "chef logistique", "chef organisation",
        "chief media officer", "chief communication officer", "vice sg", "vice hr", "vice rh", "vice treasury",
    ]

    const positionOf = (m: OfficeMember) => m.position.trim().toLowerCase()
    const inOrder = (order: string[]) => (a: OfficeMember, b: OfficeMember) => {
        const rank = (m: OfficeMember) => {
            const index = order.indexOf(positionOf(m))
            return index === -1 ? order.length : index
        }
        return rank(a) - rank(b)
    }

    const leadership = officeMembers.filter((m) => leadershipOrder.includes(positionOf(m))).sort(inOrder(leadershipOrder))
    const consultants = officeMembers.filter((m) => positionOf(m).startsWith("consultant"))
    const officers = officeMembers
        .filter((m) => !leadership.includes(m) && !consultants.includes(m))
        .sort(inOrder(officerOrder))

    if (officeMembers.length === 0) {
        return (
            <div className="container mx-auto my-10 min-h-screen px-4 text-center">
                <PageHero
                    badge="Office Members"
                    title={<>Meet the Code Club <span className="text-primary">Team</span></>}
                />
                <p className="text-muted-foreground">
                    The team list is temporarily unavailable. Please check back soon.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto my-10 min-h-screen flex justify-center px-4">
            <div className="text-center w-full">
                <PageHero
                    badge="Office Members"
                    title={<>Meet the Code Club <span className="text-primary">Team</span></>}
                    description="The students behind the Code Club at FST Settat: the office members who run our workshops, events and projects, and the developers who built this site."
                />

                {/* Office Members */}
                <div className="flex flex-col items-center gap-8">

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-5">
                        {leadership.map((m) => (
                            <OfficeMemberCard key={m.id} member={m} />
                        ))}
                    </div>

                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-5">
                        {officers.map((m) => (
                            <OfficeMemberCard key={m.id} member={m} />
                        ))}
                    </div>

                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-5">
                        {consultants.map((c) => (
                            <OfficeMemberCard key={c.id} member={c} />
                        ))}
                    </div>
                </div>

                {/* Our devs */}
                <h2
                    className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text 
                               text-3xl font-bold tracking-tight text-transparent md:text-4xl lg:text-5xl 
                               relative mt-20 mb-12 inline-block"
                >
                    Big Thanks to our Developers
                    <span
                        className="absolute bottom-0 left-0 h-1 rounded-full bg-primary"
                        style={{ width: "100%" }}
                    />
                </h2>

                <DevCarousel devs={devs} />
            </div>
        </div>
    )
}
