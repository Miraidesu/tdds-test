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
  lastname: z.string()
  .min(1, "El apellido es requerido")
  .regex(/^[a-zA-Z\s]+$/, "El nombre debe contener solo letras"),
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
  return resto;
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





  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);

  };





  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/createProfiles");
      const data = await response.json();
      const roless = data["roles_list"]
      setRolesList(roless);
      console.log(roless)
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
              <div className="space-y-2">
                <Label htmlFor="name">Apellido</Label>
                <Input {...register('lastname')} placeholder="Apellido"/>
                {errors.lastname && (
                  <ErrorMsg>{errors.lastname.message}</ErrorMsg>
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
                <Label htmlFor="phone">Telefono</Label>
                <Input {...register('phone')} placeholder="912345678"/>
                {errors.phone && (
                  <ErrorMsg>{errors.phone.message}</ErrorMsg>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesList.map((role) => (
                      <SelectItem key={role.value} value={role.label}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role  && <ErrorMsg>{errors.role.message}</ErrorMsg>}
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
    
    </div>
  );
}