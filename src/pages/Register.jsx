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
    .min(1, "El nombre es requerido"),
  surname: z.string()
    .min(1, "El apellido es requerido"),
  birthday: z.string()
    .min(1, "Ingrese su fecha de nacimiento"),
  email: z.string()
    .min(1, "El correo es requerido")
    .regex(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/, 
      "El correo ingresado es inválido"),
  });

export default function UserScheduling() {
  const [date, setDate] = useState("")
  const [canSubmit, setCanSubmit] = useState(true)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert('Form is valid and submitted!');
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    // Reemplazamos cualquier carácter que no sea un número
    const onlyNumbers = value.replace(/\D/g, '');

    // Formatear la fecha
    let formattedDate = '';

if (onlyNumbers.length >= 2) {
      formattedDate += onlyNumbers.substring(0, 2) + '/'; // Día
    } else if (onlyNumbers.length > 0) {
      formattedDate += onlyNumbers.substring(0, 2); // Agrega solo el día si tiene menos de 2 dígitos
    }
    
    if (onlyNumbers.length >= 4) {
      formattedDate += onlyNumbers.substring(2, 4) + '/'; // Mes
    } else if (onlyNumbers.length > 2) {
      formattedDate += onlyNumbers.substring(2, 4); // Agrega solo el mes si tiene menos de 2 dígitos
    }

    if (onlyNumbers.length > 4) {
      formattedDate += onlyNumbers.substring(4, 8); // Año
    }

    setDate(formattedDate);
  };


  return (
    <div className="bg-slate-950 max-h-svh">
      <Card className="w-[325px] max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Ingrese sus datos para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">
                RUT
              </Label>
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
              <p className="font-semibold text-red-500">{errors.rutNum.message}</p>
            ) : errors.rutDig ? (
              <p className="font-semibold text-red-500">{errors.rutDig.message}</p>
            ) : null}
            </div>
          </div>
          
      
          <div className="space-y-2">
            <Label htmlFor="name">Nombre(s)</Label>
            <Input {...register('name')} placeholder="Nombre"/>
            {errors.name && (
              <p className="font-semibold text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido(s)</Label>
            <Input {...register('surname')} placeholder="Apellido"/>
            {errors.surname && (
            <p className="font-semibold text-red-500">{errors.surname.message}</p>
          )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthday">Fecha de nacimiento</Label>
            <div className="grid grid-cols-10 gap-4">
              <Input {...register('birthday')} className="col-span-10" placeholder="DD/MM/AAAA" value={date}
              onChange={handleDateChange}/>
            </div>
            <div>
              {errors.birthday && (
                  <p className="font-semibold text-red-500">{errors.birthday.message}</p>
                )}
            </div>
          </div>

          <div className="space-y-2">
          <Label htmlFor="email">Correo electronico</Label>
          <Input {...register('email')} placeholder="ejemplo@mail.cl"/>
          {errors.email && (
            <p className="font-semibold text-red-500">{errors.email.message}</p>
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
  )
}