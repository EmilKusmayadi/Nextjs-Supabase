import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import supabase from "@/lib/db"
import { Imenu } from "@/types/menu"
import { Ellipsis } from "lucide-react"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

const AdminPage = () => {
    const [menus, setMenus] = useState<Imenu[]>([])
    const [createDialog, setCreateDialog] = useState(false)
    const [SelectedMenu, setSelectedMenu] = useState<{
        menu: Imenu
        action: 'edit' | 'delete'
    } | null>(null)

    useEffect(() => {
        const fetchMenus = async () => {
            const { data, error } = await supabase.from('menus').select('*')
            if (error) console.log('error', error)
            else (setMenus(data))
        }
        fetchMenus()
    }, [])

    const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        try {
            const { data, error } = await supabase
                .from('menus')
                .insert(Object.fromEntries(formData))
                .select()

            if (error) console.log(error)
            else if (data) {
                setMenus((prev) => [...prev, ...data])
            }
            toast('Menu add successfully')
            setCreateDialog(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteMenu = async () => {
        try {
            const { error } = await supabase
                .from('menus')
                .delete()
                .eq('id', SelectedMenu?.menu.id)

            if (error) console.log(error)
            else {
                setMenus((prev) =>
                    prev.filter((menu) => menu.id !== SelectedMenu?.menu.id)
                )
            }
            toast('Menu deleted successfully')
            setSelectedMenu(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const newData = Object.fromEntries(formData)

        try {
            const { error } = await supabase
                .from('menus')
                .update(newData)
                .eq('id', SelectedMenu?.menu.id)

            if (error) console.log(error)
            else {
                setMenus((prev) =>
                    prev.map((menu) =>
                        menu.id === SelectedMenu?.menu.id
                            ? { ...menu, ...newData }
                            : menu
                    )
                )
            }
            toast('Menu Edit successfully')
            setSelectedMenu(null)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="font-bold bg-black text-white">Add menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white">
                        <form onSubmit={handleAddMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Menu</DialogTitle>
                                <DialogDescription>Create a new menu by insert data in this form</DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Insert Name" required />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" placeholder="Insert Price" required />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" name="image" placeholder="Insert Image" required />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="kategori">Category</Label>
                                    <Select name="kategori" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Categori" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffe">Non Coffee</SelectItem>
                                                <SelectItem value="Pastries">Pastries</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Insert Description" required className="resize-none h-32" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="secondary" className="cursor-pointer">Cencel</Button>
                                </DialogClose>
                                <Button type="submit" variant="secondary" className="cursor-pointer">Create</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="">
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
                                                <DropdownMenuItem onClick={() => setSelectedMenu({ menu, action: 'edit' })}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400" onClick={() => setSelectedMenu({ menu, action: 'delete' })}>Delate</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={SelectedMenu !== null && SelectedMenu.action === 'delete'}
                onOpenChange={((open) => {
                    if (!!open) {
                        setSelectedMenu(null)
                    }
                })}>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>Delete Menu</DialogTitle>
                        <DialogDescription>Are You sure want to delete {SelectedMenu?.menu.name} </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant="secondary" className="cursor-pointer">Cencel</Button>
                        </DialogClose>
                        <Button onClick={handleDeleteMenu} className="cursor-pointer bg-red-400 text-white">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={SelectedMenu !== null && SelectedMenu.action === 'edit'}
                onOpenChange={((open) => {
                    if (!!open) {
                        setSelectedMenu(null)
                    }
                })}>
                <DialogContent className="sm:max-w-md bg-white">
                    <form onSubmit={handleEditMenu} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit Menu</DialogTitle>
                            <DialogDescription>Make changes to your menu.</DialogDescription>
                        </DialogHeader>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Insert Name" required defaultValue={SelectedMenu?.menu.name} />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" placeholder="Insert Price" required defaultValue={SelectedMenu?.menu.price} />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="image">Image</Label>
                                <Input id="image" name="image" placeholder="Insert Image" required defaultValue={SelectedMenu?.menu.image} />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="kategori">Category</Label>
                                <Select name="kategori" required defaultValue={SelectedMenu?.menu.kategori}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Categori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            <SelectItem value="Coffee">Coffee</SelectItem>
                                            <SelectItem value="Non Coffe">Non Coffee</SelectItem>
                                            <SelectItem value="Pastries">Pastries</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Insert Description" required className="resize-none h-32" defaultValue={SelectedMenu?.menu.description} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant="secondary" className="cursor-pointer">Cencel</Button>
                            </DialogClose>
                            <Button type="submit" variant="secondary" className="cursor-pointer">Edit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    )
}
export default AdminPage