import { Button } from "@/components/ui/button";
import supabase from "@/lib/db";
import { Imenu } from "@/types/menu";
import Image from "next/image";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

const DetailMenu = () => {
    const router = useRouter();
    const [menu, setMenu] = useState<Imenu | null>(null)

    useEffect(() => {
        if (router.query.id) {
            const fetchMenu = async () => {
                const { data, error } = await supabase
                    .from('menus')
                    .select('*')
                    .eq('id', router.query.id)
                    .single()
                if (error) console.log(error)
                else setMenu(data)
                console.log(data)
            }
            fetchMenu()
        }
    }, [router.query.id])
    return (
        <div className="container mx-auto py-8">
            <div className="flex gap-16">
                {menu && (
                    <div className="flex gap-16 items-center w-full">
                        <div className="w-1/2">
                            <Image
                                src={menu.image}
                                alt={menu.name}
                                width={1080}
                                height={1080}
                                className="w-full h-[70vh] object-cover rounded-2xl"
                            />
                        </div>
                        <div className="w-1/2">
                            <h1 className="text-5xl font-bold mb-4">{menu.name}</h1>
                            <p className="text-xl mb-4 text-neutral-500">{menu.description}</p>
                        </div><div className="flex gap-4 items-center">
                            <p className="text-4xl font-bold">${menu.price}.00</p>
                            <Button className="text-lg py-6 font-bold" size='lg'>Buy Now</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailMenu
