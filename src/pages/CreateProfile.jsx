import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";

export default function CreateProfile() {
  const [profiles, setProfiles] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};

    // Validar nombre
    const name = formData.get("name");
    if (!/^[A-Za-z\s]+$/.test(name) || name.length > 40 || name.trim().length == 0) {
      if (name.length == 0){
        errors.name = "El nombre es obligatorio";
      }
      else{
        errors.name = "El nombre solo debe contener letras y un máximo de 40 caracteres.";
      }
    }


    // Validar email
    const email = formData.get("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.trim().length == 0) {
      if (email.trim().length == 0){
        errors.email = "El correo electrónico es obligatorio.";
      }else{
        errors.email = "El correo electrónico no es válido.";
      }
      
    }

    // Validar rol
    const role = formData.get("role");
    if (!role) {
      errors.role = "Debes seleccionar un rol.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/createProfiles");
      const data = await response.json();
      setRolesList(data["roles_list"]);
      setProfiles(data["profiles_list"]);
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profiles, searchTerm]);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
    setErrors({});
  };

  // para crear nuevos perfiles

  const handleAddProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validateForm(formData)) return;

    const newProfile = {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
    };

    try {
        const response = await fetch(`http://localhost:5000/api/createProfiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProfile), 
        });

        if (response.ok) {
            const responseData = await response.json();
            fetchData();
            setIsCreateDialogOpen(false);
        } else {
            console.error("Error al crear el perfil:", response.statusText);
        }
    } catch (error) {
        console.error("Error al crear el perfil:", error);
    }
};

  // aqui se abre el editar perfi

  const handleEditProfile = (profile) => {
    setProfileToEdit(profile);
    setIsEditDialogOpen(true);
  };

  // aqui se puede editar y se conecta al backend cargando los datos del perfil a editar

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!validateForm(formData)) return;
    
    const updatedProfile = {
        id: profileToEdit.id,
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
    };

    try {
        const response = await fetch(`http://localhost:5000/api/createProfiles`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProfile),
        });

        if (response.ok) {
            fetchData();
            setIsEditDialogOpen(false);
        } else {
            console.error("Error al actualizar el perfil:", response.statusText);
        }
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
    }
  };

  // para eliminar perfiles

  const handleDeleteProfile = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este perfil?");
    
    if (!confirmDelete) return; // confirmación del usuario
  
    try {
      const response = await fetch(`http://localhost:5000/api/createProfiles`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        fetchData(); // Cargar la lista actualizada desde el backend
      } else {
        console.error("Error al eliminar el perfil:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de perfiles</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear nuevo perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo perfil</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddProfile}>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email"  />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select id="role" name="role">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesList.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500">{errors.role}</p>}
              </div>
              <Button type="submit">Crear</Button>
            </form>
          </DialogContent>
        </Dialog>
        <div className="relative">
          <Search className="absolute top-1/2 left-2 transform h-4 w-4 -translate-y-1/2 text-gray-500" />
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
                  onClick={() => handleEditProfile(profile)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProfile(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Diálogo para editar perfil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          {profileToEdit && (
            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" name="name" defaultValue={profileToEdit.name} required />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={profileToEdit.email} required />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                <Select id="edit-role" name="role" defaultValue={profileToEdit.role} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesList.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500">{errors.role}</p>}
              </div>
              <Button type="submit">Actualizar</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
