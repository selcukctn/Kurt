import { NextResponse } from "next/server"
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}
){
    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();
        console.log(name,imageUrl)
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }

        const server = db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                name,
                imageUrl
            }
        }).then((res)=>{
            console.log(res)
        })
        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_PATCH]",error)
        return new NextResponse("Internal Error",{status:500});
    }
}