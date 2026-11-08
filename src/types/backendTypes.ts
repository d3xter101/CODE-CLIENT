import { UUID } from "crypto"

export type Image = {
    id?: UUID | string,
    uri: string,
    host: "CLOUDINARY" | "S3"
}

export type AreaOfInterest = {
    id?: UUID,
    name: string
}

export type Sponsor = {
    id?: UUID,
    name: string
}

export type Event = {
    id?: UUID,
    title: string,
    description: string,
    eventType: 'COMPETITION' | 'FORMATION' | 'HACKATHON' | 'ORIENTATION',
    image: Image,
    areaOfInterests: Array<AreaOfInterest>,
    sponsors: Array<Sponsor>,
    sponsored: boolean,
    registrationOpen: boolean,
    registrationDeadline: Date,
    // when the event starts, null when it was not set
    startDate: string | null,
    publishedAt: Date
}

export type News = {
    id?: string,
    title: string,
    description: string,
    image: Image,
    type: string,
    publishedAt: Date
}

export type OfficeMember = {
    id?: string,
    image: Image,
    firstName: string,
    lastName: string,
    position: string,
    linkedin: string,
    instagram: string,
    addedAt: Date,
    /** Optional page the developer card links to */
    href?: string
}

/**
 * The major should be restricted in the front-end
 */
export type RegistrationRequest = {
    id?: UUID,
    firstName: string,
    lastName: string,
    email: string,
    year: number,
    areaOfInterests: Array<AreaOfInterest>,
    major: string
}


/**
 * The logged-in member's own profile (GET /api/v1/member/profile)
 */
export type Profile = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    year: number,
    major: string,
    role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'STAFF' | 'USER',
    absences: number,
    areaOfInterests: Array<{ id: string, name: string }>,
    createdAt: string
}

export type RatingSummary = {
    average: number,
    count: number,
    // number of ratings for each score, from 1 to 5
    distribution: Record<string, number>,
    myRating: number | null,
    // ratings open once the event's registration has closed
    ratingOpen: boolean,
    canRate: boolean
}

export type EventComment = {
    id: string,
    content: string,
    createdAt: string,
    authorId: string,
    authorFirstName: string,
    authorLastName: string,
    deletable: boolean
}

export type CommentPage = {
    comments: Array<EventComment>,
    page: number,
    totalPages: number,
    totalElements: number
}

export type MerchItem = {
    id: string,
    name: string,
    description: string | null,
    category: string,
    price: number,
    imageUrl: string | null,
    // empty when the item has no sizes
    sizes: Array<string>,
    stock: number,
    // an event ticket: one per member, the QR code comes once the club confirms the payment
    ticket: boolean,
    eventDate: string | null,
    venue: string | null
}

export type MerchBooking = {
    id: string,
    itemId: string,
    itemName: string,
    imageUrl: string | null,
    size: string | null,
    quantity: number,
    unitPrice: number,
    total: number,
    createdAt: string,
    ticket: boolean,
    // the club confirmed that the payment was received
    paid: boolean
}

// the pass a member gets when they join an event, scanned at the event to record that they were present
export type EventPass = {
    id: string,
    eventId: string,
    eventName: string,
    firstName: string,
    lastName: string,
    number: string,
    // the text of the QR code, null when the server has no signing key
    qrContent: string | null,
    present: boolean,
    presentAt: string | null
}

export type Ticket = {
    id: string,
    bookingId: string,
    status: 'CONFIRMED' | 'USED' | 'CANCELLED',
    firstName: string,
    lastName: string,
    eventName: string,
    eventDate: string | null,
    venue: string | null,
    number: string,
    // the text of the QR code
    qrContent: string | null,
    usedAt: string | null
}
