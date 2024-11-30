import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, set, subYears } from "date-fns";
import ErrorMsg from "@/components/error-msg";
import { Eye, EyeOff } from "lucide-react";
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
import { PlusCircle, Pencil, Trash2, Search, Lock } from "lucide-react";
import NavBar from './NavBar';
import { AlertTitle } from "@/components/ui/alert";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


export default function CreateProfile() {
  const [profiles, setProfiles] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPassDialogOpen, setIsPassDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  var dig = "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: errorsPass },
    setValue : setValuePass,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEditar,
    formState: { errors: errorsEdit },
    setValue : setValueEdit,
  } = useForm();

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  function calcularDV(rut) {
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
  
    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return resto.toString();
  }


// PARA CREAR PERFILES
  
  const onSubmit = async (data) => {
    data.phone = Number(data.phone);
    data.rutNum = Number(data.rutNum);

    if (selectedSpecialty == null){
      data.specialty = null;
    }
  
    
    const dig = calcularDV(data.rutNum.toString().padStart(8, '0').trim()); 
    const inputDV = data.rutDig.toString().trim().toUpperCase(); 
    
    if (!data.role) {
      alert("Seleccione un rol")
      return;
    };

    if (data.role == 2 && data.specialty == null) {
      alert("Seleccione una especialidad");
     return;
    }

    

    if (dig === inputDV) {
      try {
        const response = await fetch("http://localhost:5000/api/createProfiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          reset(); // Resetea los valores del formulario tras el envío exitoso
          fetchData(); // Recarga la lista de perfiles
          setIsCreateDialogOpen(false);
        } else {
          const result = await response.json();
          alert(result.message);
          console.error("Error al registrar", result.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      alert("El RUT ingresado no es válido");
    }

    setSelectedRole(null);
    setSelectedSpecialty(null);
  };

// PARA EDITAR PERFILES

  const handleSubmitEdit = async (data) => {
    data.phone = Number(data.phone);
    data.rutNum = Number(data.rutNum);

    data.specialty = selectedSpecialty;
    

  
    if (data.role) {
      if (data.role == 2 && data.specialty == null) {
        alert("Seleccione una especialidad");
       return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/createProfiles", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          fetchData(); 
          setIsEditDialogOpen(false);
          setSelectedRole(null);
          setSelectedSpecialty(null);
        } else {
          const result = await response.json();
          alert(result.message);
          console.error("Error al registrar", result.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      alert("Seleccione un rol")
    }
    
    setSelectedRole(null);
    setSelectedSpecialty(null);

  };

  // PARA ELIMINAR PERFILES

  const handleDelete = async (profile) => {

    if (!window.confirm(`¿Estás seguro de que deseas eliminar el perfil con RUT ${profile.rut}?`)) {
      return;
    }

    const data = { rut: Number(profile.rut) };

      try {
        const response = await fetch("http://localhost:5000/api/createProfiles", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          fetchData(); 
        } else {
          const result = await response.json();
          alert(result.message);
          alert(result.error);
          console.error("Error al eliminar", result.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    
  };

  // PARA CAMBIAR CONTRASEÑA

  const handlePassChange = async (data) => {

    data.rutNum = Number(data.rutNum);

    if (data.password && data.passwordConfirm) {
  
      if (data.password === data.passwordConfirm) {
        try {
          const response = await fetch("http://localhost:5000/api/updatePassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (response.ok) {
            const result = await response.json();
            alert(result.message);
            fetchData(); 
            setIsPassDialogOpen(false);
          } else {
            const result = await response.json();
            alert(result.message);
            console.error("Error al registrar", result.message);
          }
        } catch (error) {
          console.error("Error de conexión:", error);
        }
      } else {
        alert("Las contraseñas no coinciden")
      }

  }else{
    alert("Ingrese una contraseña");
  }

  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/createProfiles");
      const data = await response.json();
      setRolesList(data.roles_list);
      setProfiles(data.profiles_list);
      setSpecialtiesList(data.specialties_list);
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRole = (role) => {
    const selectedRole = rolesList.find((r) => r.label === role);
  
    setSelectedRole(selectedRole.value);
    setValue("role", selectedRole.value);
  
    if (selectedRole.value !== 2) {
      setSelectedSpecialty(null); // Limpia la especialidad si no es "Médico"
    }
  };
  

  const handleRoleForEdit = (role) => {
    const selectedRole = rolesList.find((r) => r.label === role);
  
    setSelectedRole(selectedRole.value);
    setValueEdit("role", selectedRole.value);
  
    if (selectedRole.value !== 2) {
      setSelectedSpecialty(null); // Limpia la especialidad si no es "Médico"
    }
  };

  const handleSpecialty = (specialty) => {
    const selectedSpecialty = specialtiesList.find((s) => s.label === specialty);
    setSelectedSpecialty(selectedSpecialty.value);
    setValue("specialty", selectedSpecialty.value);
  };

  const handleSpecialtyForEdit = (specialty) => {
    const selectedSpecialty = specialtiesList.find((s) => s.label === specialty);
    setSelectedSpecialty(selectedSpecialty.value);
    setValue("specialty", selectedSpecialty.value);
  };

  useEffect(() => {
    if (isEditDialogOpen) {
      setSelectedRole(null);
      setSelectedSpecialty(null);
    }
  }, [isEditDialogOpen]);

  const changePassword = (profile) => {

    setValuePass("password", "");
    setValuePass("passwordConfirm", "");

    setValuePass("rutNum", profile.rut);
    setValuePass("rutDig", calcularDV(profile.rut.toString().padStart(8, '0')));
    setIsPassDialogOpen(true);
    };

  const EditProfile = (profile) => {
    setValueEdit("rutNum", profile.rut);
    setValueEdit("rutDig", calcularDV(profile.rut.toString().padStart(8, '0')));
    setValueEdit("name", profile.name);
    setValueEdit("lastname", profile.lastname);
    setValueEdit("email", profile.email);
    setValueEdit("phone", profile.phone);
    setSelectedRole(null);
    setIsEditDialogOpen(true);
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profiles, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Gestión de perfiles</h1>

      {/* CREAR PERFILES */}

      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => reset()}>
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
                <Label htmlFor="rutNum" className="block mb-2">
                  RUT
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="12345678"
                    {...register("rutNum", { required: "El número de RUT es obligatorio" })}
                  />
                  <Input
                    placeholder="K"
                    {...register("rutDig", { required: "El dígito verificador es obligatorio" })}
                  />
                </div>
                {errors.rutNum && <ErrorMsg>{errors.rutNum.message}</ErrorMsg>}
                {errors.rutDig && <ErrorMsg>{errors.rutDig.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Contraseña"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                />
                {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input
                  placeholder="Nombre"
                  id="name"
                  {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  placeholder="Apellido"
                  {...register("lastname", { required: "El apellido es obligatorio" })}
                />
                {errors.lastname && <ErrorMsg>{errors.lastname.message}</ErrorMsg>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "El email es obligatorio" })}
                />
                {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  placeholder="912345678"
                  {...register("phone", { required: "El teléfono es obligatorio" })}
                />
                {errors.phone && <ErrorMsg>{errors.phone.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select onValueChange={handleRole}>
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
                {errors.role && <ErrorMsg>{errors.role.message}</ErrorMsg>}
              </div>
              {/* Select para especialidades (solo se muestra si el rol es Médico) */}
                {selectedRole === 2 && (
                  <div>
                    <Label>Especialidad</Label>
                    <Select id="specialty" onValueChange={handleSpecialty} >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialtiesList.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.label}>
                            {specialty.label}
                          </SelectItem>
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

      {/* MOSTRAR PERFILES */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RUT</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow>
              <TableCell>{profile.rut}</TableCell>
              <TableCell>{profile.name}</TableCell>
              <TableCell>{profile.lastname}</TableCell>
              <TableCell>{profile.email}</TableCell>
              {profile.role === "Medico" ? <TableCell>{profile.role} {profile.specialty}</TableCell> :
                <TableCell>{profile.role}</TableCell>
              }
              
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => EditProfile(profile)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex justify-center items-center">
                    <h4 className="text-center">Editar</h4>
                  </div>
                </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(profile)}
                  
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex justify-center items-center">
                    <h4>Eliminar</h4>
                  </div>
                </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changePassword(profile)}
                  
                >
                  <Lock className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex justify-center items-center">
                    <h4 className="text-center">Editar Contraseña</h4>
                  </div>
                </HoverCardContent>
                </HoverCard>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* EDITAR PERFILES */}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmitEditar(handleSubmitEdit)}>
              <div className="w-full max-w-sm">
                <Label htmlFor="rutNum" className="block mb-2">
                  RUT
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="12345678"
                    {...registerEdit("rutNum", { required: "El número de RUT es obligatorio" })}
                    readOnly
                  />
                  <Input
                    placeholder="K"
                    {...registerEdit("rutDig", { required: "El dígito verificador es obligatorio" })}
                    readOnly
                  />
                </div>
                {errors.rutNum && <ErrorMsg>{errors.rutNum.message}</ErrorMsg>}
                {errors.rutDig && <ErrorMsg>{errors.rutDig.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input
                  placeholder="Nombre"
                  id="name"
                  {...registerEdit("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  placeholder="Apellido"
                  {...registerEdit("lastname", { required: "El apellido es obligatorio" })}
                />
                {errors.lastname && <ErrorMsg>{errors.lastname.message}</ErrorMsg>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerEdit("email", { required: "El email es obligatorio" })}
                />
                {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  placeholder="912345678"
                  {...registerEdit("phone", { required: "El teléfono es obligatorio" })}
                />
                {errors.phone && <ErrorMsg>{errors.phone.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select onValueChange={handleRoleForEdit}>
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
                {errors.role && <ErrorMsg>{errors.role.message}</ErrorMsg>}
              </div>
              {/* Select para especialidades (solo se muestra si el rol es Médico) */}
              {selectedRole === 2 && (
                  <div>
                    <Label>Especialidad</Label>
                    <Select id="specialty" onValueChange={handleSpecialtyForEdit} >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialtiesList.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.label}>
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              <Button type="submit">Editar</Button>
            </form>
          </DialogContent>
      </Dialog>



      {/* EDITAR CONTRASEÑA */}


        <Dialog open={isPassDialogOpen} onOpenChange={setIsPassDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Contraseña</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmitPass(handlePassChange)}>
              <div className="w-full max-w-sm">
                <Label htmlFor="rutNum" className="block mb-2">
                  RUT
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="12345678"
                    {...registerPass("rutNum", { required: "El número de RUT es obligatorio" })}
                    readOnly
                  />
                  <Input
                    placeholder="K"
                    {...registerPass("rutDig", { required: "El dígito verificador es obligatorio" })}
                    readOnly
                  />
                </div>
                {errors.rutNum && <ErrorMsg>{errors.rutNum.message}</ErrorMsg>}
                {errors.rutDig && <ErrorMsg>{errors.rutDig.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Contraseña"
                  defaultValue=""
                  {...registerPass("password", { required: "La contraseña es obligatoria" })}
                />
                {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirmar Contraseña</Label>
                <Input
                  type="password"
                  id="passwordConfirm"
                  placeholder="Confirmar Contraseña"
                  defaultValue=""
                  {...registerPass("passwordConfirm", { required: "Confirme su contraseña" })}
                />
                {errors.passwordConfirm && <ErrorMsg>{errors.passwordConfirm.message}</ErrorMsg>}
              </div>
              <Button type="submit">Editar</Button>
            </form>
          </DialogContent>
        </Dialog>

    </div>
    
  );
}

