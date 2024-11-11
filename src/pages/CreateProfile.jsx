import { useState, useMemo, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, subYears } from 'date-fns'
import ErrorMsg from "@/components/error-msg"
import { Eye, EyeOff } from "lucide-react"
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


const userSchema = z.object({
  rutNum: z.string()
    .min(1, "El RUT es requerido")
    .regex(/^[0-9]+$/, "El RUT debe ser numérico")
    .min(7, "El RUT debe tener minimo 7 digitos")
    .max(8, "El RUT debe tener máximo 8 digitos"),
  rutDig: z.string()
    .min(1, "El digito verificador es requerido")
    .regex(/^[0-9kK]+$/, "El digito verificador debe ser un número o K"),
  name: z.string()
    .min(1, "El nombre es requerido")
    .regex(/^[a-zA-Z\s]+$/, "El nombre debe contener solo letras"),
  birthday: z.string()
    .min(1, "Ingrese su fecha de nacimiento"),
  email: z.string()
    .min(1, "El correo es requerido")
    .regex(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/, 
      "El correo ingresado es inválido"),
  phone: z.string()
    .min(1, "El teléfono es requerido")
    .regex(/^[0-9]+$/, "El teléfono debe ser numérico")
    .max(9, "El teléfono debe tener máximo 9 digitos"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
    .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial."),
  confirmPassword: z.string().min(1, "Debe confirmar su contraseña"),
  role: z.string({
    requied_error: "El rol es requerido"
  })
  .min(1, "El rol es requerido")
})
.refine((data) => {
  const dvCalculated = calcularDV(data.rutNum);
  return dvCalculated.toUpperCase() === data.rutDig.toUpperCase();
}, {
  message: "El digito verificador no corresponde al RUT",
  path: ["rutDig"], // Muestra el error en el campo de digito verificador
})
.refine((data) => 
  data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // Muestra el error en el campo de confirmación
});

function calcularDV(rut) {
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return `${resto}`;
}



export default function CreateProfile() {
  const [profiles, setProfiles] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onSubmit"
  });
  const [selectedRole, setSelectedRole] = useState("");
  const roles = ["Admin", "Médico", "Secretaria"];
  const specialties = ["General", "Traumatólogo", "Internista", "Oftalmólogo"];


  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);
    // Convertir valores numéricos
    // data.comuna = Number(data.comuna);
    // data.phone = Number(data.phone);
    // data.rutNum = Number(data.rutNum);
  
    // try {
    //   const response = await fetch("http://localhost:5000/api/createProfiles", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(data)
    //   });
  
    //   if (response.ok) {
    //     const result = await response.json();
    //     alert(result.message);
    //     // navigate("/login");
    //   } else {
    //     console.error("Error al registrar:", response.statusText);
    //   }
    // } catch (error) {
    //   console.error("Error de conexión:", error);
    // }
  };

  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue("role", role);
    if (role !== "Médico") {
      setValue("specialty", "");
    }
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

    // if (!validateForm(formData)) return;

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
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear nuevo perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo perfil</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-sm">
              <Label htmlFor="rut" className="block mb-2">RUT</Label>
              <div className="flex space-x-2">
                <Input
                  {...register('rutNum')}
                  placeholder="12345678"
                  className="w-24"
                />
                <Input
                  {...register('rutDig')}
                  placeholder="K"
                  className="w-12"
                />
              </div>
              {errors.rutNum ? (
                <ErrorMsg>{errors.rutNum.message}</ErrorMsg>
              ) : errors.rutDig ? (
                <ErrorMsg>{errors.rutDig.message}</ErrorMsg>
              ) : null}
            </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input {...register('name')} placeholder="Nombre"/>
                {errors.name && (
                  <ErrorMsg>{errors.name.message}</ErrorMsg>
                )}
              </div>
              <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" {...register('email')} />
                  {errors.email && (
                  <ErrorMsg>{errors.email.message}</ErrorMsg>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <Input type="date" 
                max={format(subYears(new Date(), 18), "yyyy-MM-dd")} 
                {...register('birthday')} />
                {errors.birthday && (
                <ErrorMsg>{errors.birthday.message}</ErrorMsg>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input {...register('phone')} placeholder="912345678"/>
                {errors.phone && (
                  <ErrorMsg>{errors.phone.message}</ErrorMsg>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <ErrorMsg>{errors.role.message}</ErrorMsg>}
              </div>
                {selectedRole === "Médico" && (
                <div className="space-y-2">
                  <Label>Especialidad</Label>
                  <Select {...register('specialty')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-sm">
              <Label htmlFor="rut" className="block mb-2">RUT</Label>
              <div className="flex space-x-2">
                <Input
                  {...register('rutNum')}
                  placeholder="12345678"
                  className="w-24"
                  defaultValue={profileToEdit.rutNum}
                  readOnly
                />
                <Input
                  defaultValue={profileToEdit.rutDig}
                  {...register('rutDig')}
                  placeholder="K"
                  className="w-12"
                  readOnly
                />
              </div>
              {errors.rutNum ? (
                <ErrorMsg>{errors.rutNum.message}</ErrorMsg>
              ) : errors.rutDig ? (
                <ErrorMsg>{errors.rutDig.message}</ErrorMsg>
              ) : null}
            </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input {...register('name')} placeholder="Nombre" 
                defaultValue={profileToEdit.name}/>
                {errors.name && (
                  <ErrorMsg>{errors.name.message}</ErrorMsg>
                )}
              </div>
              <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" {...register('email')} 
                  defaultValue={profileToEdit.email}/>
                  {errors.email && (
                  <ErrorMsg>{errors.email.message}</ErrorMsg>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <Input type="date" 
                max={format(subYears(new Date(), 18), "yyyy-MM-dd")} 
                {...register('birthday')}
                defaultValue={profileToEdit.birthday} />
                {errors.birthday && (
                <ErrorMsg>{errors.birthday.message}</ErrorMsg>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input {...register('phone')} placeholder="912345678"
                defaultValue={profileToEdit.phone}/>
                {errors.phone && (
                  <ErrorMsg>{errors.phone.message}</ErrorMsg>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select onValueChange={handleRoleChange} defaultValue={profileToEdit.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <ErrorMsg>{errors.role.message}</ErrorMsg>}
              </div>
                {selectedRole === "Médico" && (
                <div className="space-y-2">
                  <Label>Especialidad</Label>
                  <Select {...register('specialty')} defaultValue={profileToEdit.specialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit">Crear</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
