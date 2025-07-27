import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import supabase from "@/lib/db";
import { Imenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"

const Home = () => {
  const [menus, setMenus] = useState<Imenu[]>([])

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from('menus').select('*')
      if (error) console.log('error', error)
      else (setMenus(data))
    }
    fetchMenus()
  }, [])

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {menus.map((menu: Imenu) => (
            <Card key={menu.id}>
              <CardContent>
                <Image
                  src={menu.image}
                  alt={menu.name}
                  width={200}
                  height={200}
                  className="w-full h-[30vh] object-cover rounded-lg" />
                <h1>{menu.name}</h1>
                <span>{menu.description}</span>
                <hr />
                <div className="flex justify-between mt-2">
                  <span>{menu.kategori}</span>
                  <span>{menu.price}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/menu/${menu.id}`} className="w-full">
                  <Button className="w-full font-bold bg-black text-white" size='lg'>Detail Menu</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div >
    </>
  )
}
export default Home

