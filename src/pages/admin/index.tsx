import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import supabase from "@/lib/db"
import { Imenu } from "@/types/menu"
import { Ellipsis } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

const AdminPage = () => {
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
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Button className="font-bold">Add menu</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menus.map((menu: Imenu) => (
                        <TableRow key={menu.id}>
                            <TableCell className="flex gap-3 items-center">
                                <Image width={50} height={50} src={menu.image} alt={menu.name} className=" aspect-square object-cover rounded-lg" />
                                {menu.name}
                            </TableCell>
                            <TableCell>{menu.description.split(' ').slice(0, 5).join(' ') + '...'}</TableCell>
                            <TableCell>{menu.kategori}</TableCell>
                            <TableCell>${menu.price}.00</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="cursor-pointer">
                                        <Ellipsis />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-white">
                                        <DropdownMenuLabel className="font-bold">
                                            Action
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>Update</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-400">Delate</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
export default AdminPage