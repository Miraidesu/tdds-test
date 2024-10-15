import { useState } from "react"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import { Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ErrorMsg from "@/components/error-msg"

// aquí agregamos la validación para que las contraseñas coincidan
const userSchema = z.object({
  rutNum: z.string()
    .min(1, "El RUT es requerido")
    .regex(/^[0-9]+$/, "El RUT debe ser numérico")
    .min(7, "El RUT debe tener minimo 7 digitos")
    .max(8, "El RUT debe tener máximo 8 digitos"),
  rutDig: z.string()
    .min(1, "El digito verificador es requerido")
    .regex(/^[0-9kK]+$/, "El digito verificador debe ser un número o K")
    .max(1, "El digito verificador debe tener solo un caracter"),
  name: z.string()
    .min(1, "El nombre es requerido")
    .regex(/^[a-zA-Z\s]+$/, "El nombre debe contener solo letras"),
  surname: z.string()
    .min(1, "El apellido es requerido")
    .regex(/^[a-zA-Z\s]+$/, "El apellido debe contener solo letras"),
  birthday: z.string()
    .min(1, "Ingrese su fecha de nacimiento"),
  direccion: z.string()
    .min(1, "Ingrese su direccion"),
  email: z.string()
    .min(1, "El correo es requerido")
    .regex(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/, 
      "El correo ingresado es inválido"),
  password: z.string()
    .min(6, "La contraseña debe tener entre 6 y 10 caracteres")
    .max(10, "La contraseña debe tener entre 6 y 10 caracteres"),
  confirmPassword: z.string().min(1, "Debe confirmar su contraseña")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // Muestra el error en el campo de confirmación
});

export default function UserScheduling() {
  const [date, setDate] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert('Form is valid and submitted!');
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    const onlyNumbers = value.replace(/\D/g, '');
    let formattedDate = '';

    if (onlyNumbers.length >= 2) {
      formattedDate += onlyNumbers.substring(0, 2) + '/'; // Día
    } else if (onlyNumbers.length > 0) {
      formattedDate += onlyNumbers.substring(0, 2);
    }
    
    if (onlyNumbers.length >= 4) {
      formattedDate += onlyNumbers.substring(2, 4) + '/'; // Mes
    } else if (onlyNumbers.length > 2) {
      formattedDate += onlyNumbers.substring(2, 4);
    }

    if (onlyNumbers.length > 4) {
      formattedDate += onlyNumbers.substring(4, 8); // Año
    }

    setDate(formattedDate);
  };

  return (
    <div className="bg-slate-950">
      <Card className="w-[325px] max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Ingrese sus datos para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4"> 
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <div className="grid grid-cols-5 gap-4">
                <Input
                  {...register('rutNum')} 
                  placeholder="12345678"
                  className="col-span-2"/>
                <Input
                  {...register('rutDig')} 
                  placeholder="K"/>
              </div>
            <div>
              {errors.rutNum ? (
                <ErrorMsg>{errors.rutNum.message}</ErrorMsg>
              ) : errors.rutDig ? (
                <ErrorMsg>{errors.rutDig.message}</ErrorMsg>
              ) : null}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre(s)</Label>
            <Input {...register('name')} placeholder="Nombre"/>
            {errors.name && (
              <ErrorMsg>{errors.name.message}</ErrorMsg>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido(s)</Label>
            <Input {...register('surname')} placeholder="Apellido"/>
            {errors.surname && (
              <ErrorMsg>{errors.surname.message}</ErrorMsg>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthday">Fecha de nacimiento</Label>
            <div className="grid grid-cols-10 gap-4">
              <Input {...register('birthday')} className="col-span-10" placeholder="DD/MM/AAAA" value={date}
              onChange={handleDateChange}/>
            </div>
            {errors.birthday && (
             <ErrorMsg>{errors.birthday.message}</ErrorMsg>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input {...register('email')} placeholder="ejemplo@mail.cl"/>
            {errors.email && (
              <ErrorMsg>{errors.email.message}</ErrorMsg>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input {...register('direccion')} placeholder="Macul 1234"/>
            {errors.direccion && (
              <ErrorMsg>{errors.direccion.message}</ErrorMsg>
            )}
          </div>

          <div className="space-y-2">
            <Label>Contraseña</Label>
            <Input type="password" {...register('password')} placeholder="Contraseña"/>
            {errors.password && (
              <ErrorMsg>{errors.password.message}</ErrorMsg>
            )}
          </div>

          <div className="space-y-2">
            <Label>Confirmar Contraseña</Label>
            <Input type="password" {...register('confirmPassword')} placeholder="Confirmar contraseña"/>
            {errors.confirmPassword && (
              <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>
            )}
          </div>
        </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">Registrarse</Button>
        </CardFooter>
      </form>
    </Card>
  </div>
  );
}