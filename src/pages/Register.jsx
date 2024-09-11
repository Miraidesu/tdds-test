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
import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const userSchema = z.object({
  rut: z.object({
    rutNum: z.string()
      .min(1, "El RUT es requerido")
      .max(8, "El RUT debe tener máximo 8 digitos")
      .regex(/^[0-9]+$/, "El RUT debe ser un número"),
    rutDig: z.string()
      .min(1, "El digito verificador es requerido")
      .max(1, "El digito verificador debe tener solo un caracter")
      .regex(/^[0-9kK]+$/, "El digito verificador debe ser un número o K"),
  }).refine((data) => {
    return data.rutNum.length > 0 && /^[0-9]+$/.test(data.rutNum) && /^[0-9kK]$/.test(data.rutDig);
  }, {
    message: "El RUT o el dígito verificador son inválidos",
    path: ["rut"], // Path to trigger error on
  }),
  name: z.string()
    .min(1, "El nombre es requerido"),
  surname: z.string()
    .min(1, "El apellido es requerido"),
  birthday: z.date(),
  email: z.string()
    .min(1, "El correo es requerido")
    .email("El correo ingresado es invalido"),
});

export default function UserScheduling() {
  const [date, setDate] = useState(Date())
  const [canSubmit, setCanSubmit] = useState(true)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert('Form is valid and submitted!');
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
                {errors.rut && (
                  <p style={{ color: 'red' }}>{errors.rut.message}</p>
                )}
              </div>
              
          
              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input {...register('name')} placeholder="Nombre"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido(s)</Label>
                <Input {...register('surname')} placeholder="Apellido"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <div className="grid grid-cols-10 gap-4">
                  <Input className="col-span-2" placeholder="31"/>
                  <Select >
                    <SelectTrigger className="col-span-5" id="month">
                      <SelectValue placeholder="Enero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enero">Enero</SelectItem>
                      <SelectItem value="febrero">Febrero</SelectItem>
                      <SelectItem value="marzo">Marzo</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                      <SelectItem value="mayo">Mayo</SelectItem>
                      <SelectItem value="junio">Junio</SelectItem>
                      <SelectItem value="julio">Julio</SelectItem>
                      <SelectItem value="agosto">Agosto</SelectItem>
                      <SelectItem value="septiembre">Septiembre</SelectItem>
                      <SelectItem value="octubre">Octubre</SelectItem>
                      <SelectItem value="noviembre">Noviembre</SelectItem>
                      <SelectItem value="diciembre">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="col-span-3" placeholder="2024"/>
                </div>
              </div>

              <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input placeholder="ejemplo@mail.cl"/>
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