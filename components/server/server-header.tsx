"use client"
import { MemberRole, Server } from "@prisma/client"
import { ServerWithMembersWithProfiles } from "@/types"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-model-store";



interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button className="w-full text-md font-semibold px-3 flex items-center h-12
                border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 
                dark:hover:bg:zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="2-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {
                    isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen("invite", { server })}
                            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                            İnsanları Davet Et
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen("editServer", { server })}
                            className=" px-3 py-2 text-sm cursor-pointer"
                        >
                            Sunucu Ayarları
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer">
                            Kullanıcıları Yönet
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                            Kanal Oluştur
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {isModerator && <DropdownMenuSeparator />}
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                            Sunucuyu Sil
                            <Trash className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    !isAdmin && (
                        <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                            Sunucudan Ayrıl
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}