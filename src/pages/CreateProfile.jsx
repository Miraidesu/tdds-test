import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue } from "@/components/ui/select"
import { PlusCircle, Pencil, Trash2, Plus, Search } from "lucide-react"

export default function CreateProfile() {
  const [profiles, setProfiles] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Medico" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Contador" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Secretaria" },
    { id: 4, name: "Bob Williams", email: "bob@example.com", role: "Desarrollador" },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [profiles, searchTerm])

  const handleAddProfile = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newProfile = {
      id: profiles.length + 1,
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    }
    setProfiles([...profiles, newProfile])
    setIsDialogOpen(false)
  }

  const handleEditProfile = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const updatedProfile = {
      id: editingProfile.id,
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    }
    setProfiles(profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p))
    setEditingProfile(null)
    setIsDialogOpen(false)
  }

  const handleDeleteProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion de perfiles</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Crear nuevo perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select id="role">
                    <SelectTrigger className="col-span-5" id="month">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem>Ejemplo</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <Button type="submit">Crear</Button>
            </form>
          </DialogContent>
        </Dialog>
        <div className="relative">
          <Search className="absolute top-1/2 left-2 transform h-4 w-4 -translate-y-1/2 text-gray-500"/>
          <Input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProfiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.name}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.role}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Pencil className="h-4 w-4"/>
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4"/>
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}