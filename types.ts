import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    memebers: (Member & { profile: Profile })[];
}