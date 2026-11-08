// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import OfficeMemberCard from "./office-member-card"
import PageHero from "@/components/ui/page-hero"
import { fetchMembers, OfficeMember } from "@/actions/fetchMembers"
import DevCarousel from "./dev-carousel"
import { devs } from "@/seed/office-members"

export default async function TeamTreePage() {
    const officeMembers: OfficeMember[] = await fetchMembers();

    // Helpers
    const findMember = (position: string) =>
        officeMembers.find((m) => m.position.toLowerCase() === position.toLowerCase())

    const findMembers = (position: string) =>
        officeMembers.filter((m) => m.position.toLowerCase() === position.toLowerCase())

    // Roles
    const president = findMember("President")
    const vp = findMember("Vice President")
    const rh = findMember("Human Resources")
    const consultants = findMembers("Consultant")
    const tresor = findMember("Treasury")
    const sg = findMember("Secretary General")
    const devChef = findMember("Chief Development Officer")
    const media = findMember("Chief Media Officer")
    const communication = findMember("Chief Communication Officer")
    const logistic = findMember("Chief Logistics Officer")
    const vRh = findMember("Vice HR")
    const vSg = findMember("Vice SG")
    const vsT = findMember("Vice Treasury")

    if (!president) {
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
                        <OfficeMemberCard member={president} />
                        <OfficeMemberCard member={vp} />
                        <OfficeMemberCard member={sg} />
                        <OfficeMemberCard member={rh} />
                        <OfficeMemberCard member={tresor} />
                    </div>

                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-5">
                        <OfficeMemberCard member={devChef} />
                        <OfficeMemberCard member={logistic} />
                        <OfficeMemberCard member={media} />
                        <OfficeMemberCard member={communication} />
                        <OfficeMemberCard member={vSg} />
                        <OfficeMemberCard member={vRh} />
                        <OfficeMemberCard member={vsT} />
                    </div>

                    {/* <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-5">
                        <OfficeMemberCard member={vSg} />
                        <OfficeMemberCard member={vRh} />
                        <OfficeMemberCard member={vsT} />
                    </div> */}

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
