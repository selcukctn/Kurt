"use client";
import { ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from "@/hooks/use-model-store";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Kanal adı gerekli!."
    }).refine(
        name => name.toLowerCase() !== "genel",
        {
            message: "Sadece 1 'genel' kanalı olabilir."
        }
    ),
    type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type } = useModal()
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url:"/api/channels",
                query:{
                    serverId:params?.serverId
                }
            });
            await axios.post(url, values);
            form.reset();
            router.refresh();
            onClose();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    const handleClose = () => {
        form.reset();
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Kanal Oluşturun
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Kanal Adı
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Kanal adını giriniz..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kanal Türü</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0
                                                    focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue
                                                        placeholder="Kanal Türü Seçiniz..."
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type == 'TEXT' ? 'Metin Kanalı' : type == 'AUDIO' ? 'Ses Kanalı' : 'Video Kanalı'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading}>Oluştur</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}