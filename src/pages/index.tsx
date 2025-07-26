import supabase from "@/lib/db";
import { Imenu } from "@/types/menu";
import { useEffect, useState } from "react"

const Home = () => {
  const [menus, setMenus] = useState<Imenu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from('menus').select('*')

      if (error) console.log('error :', error)
      else setMenus(data)
    }

    fetchMenus()
  }, [])

  console.log(menus)
  return (
    <>
      <div className="">
        <h1>test</h1>
      </div>
    </>
  )
}
export default Home