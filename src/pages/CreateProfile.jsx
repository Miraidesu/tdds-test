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

export default function CreateProfile() {
  const [profiles, setProfiles] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Manager" },
    { id: 4, name: "Bob Williams", email: "bob@example.com", role: "Tester" },
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
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
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
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  required
                />
              </div>
              <Button type="submit"> Profile</Button>
            </form>
          </DialogContent>
        </Dialog>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
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
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                >
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