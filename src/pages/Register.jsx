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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, subYears } from 'date-fns'
import ErrorMsg from "@/components/error-msg"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from 'react-router-dom'

// aquí agregamos la validación para que las contraseñas coincidan
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
  surname: z.string()
    .min(1, "El apellido es requerido")
    .regex(/^[a-zA-Z\s]+$/, "El apellido debe contener solo letras"),
  birthday: z.string()
    .min(1, "Ingrese su fecha de nacimiento"),
  direccion: z.string()
    .min(1, "Ingrese su direccion"),
  comuna: z.string({
    required_error: "La comuna es requerida"
  }),
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
  confirmPassword: z.string().min(1, "Debe confirmar su contraseña")
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

const comunas = {
  1: "Alto del Carmen",
  2: "Caldera",
  3: "Chañaral",
  4: "Copiapo",
  5: "Diego de Almagro",
  6: "Freirina",
  7: "Huasco",
  8: "Tierra Amarilla",
  9: "Vallenar"
}

export default function UserScheduling() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onChange"
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    // Convertir valores numéricos
    data.comuna = Number(data.comuna);
    data.phone = Number(data.phone);
    data.rutNum = Number(data.rutNum);
  
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        navigate("/login");
      } else if (!response.ok) {
        const result = await response.json();
        alert(result.message);
      }else{
        console.error("Error al registrar", response.statusText);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="bg-slate-950 w-full min-h-screen">
      <Card className="w-auto max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Ingrese sus datos para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
        <main className="flex flex-col space-y-4">
          <article className="flex">
            <section className="flex-1 mr-3">
              <div className="space-y-2">
                <Label htmlFor="rut">RUT</Label>
                <div className="flex">
                  <Input
                    {...register('rutNum')} 
                    placeholder="12345678"
                    />
                  <Input
                    {...register('rutDig')} 
                    placeholder="K"
                    className="w-10 ml-6"/>
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
                <Label htmlFor="lastname">Apellido(s)</Label>
                <Input {...register('surname')} placeholder="Apellido"/>
                {errors.surname && (
                  <ErrorMsg>{errors.surname.message}</ErrorMsg>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <Input type="date" max={format(subYears(new Date(), 18), "yyyy-MM-dd")} {...register('birthday')} />
                
                {errors.birthday && (
                <ErrorMsg>{errors.birthday.message}</ErrorMsg>
                )}
              </div>
            </section>

            <section className="flex-1 ml-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input {...register('phone')} placeholder="912345678"/>
                {errors.phone && (
                  <ErrorMsg>{errors.phone.message}</ErrorMsg>
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
                <Label htmlFor="Comuna">Comuna</Label>
                <Select onValueChange={(v) => setValue('comuna', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(comunas).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.comuna && (
                  <ErrorMsg>{errors.comuna.message}</ErrorMsg>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input {...register('direccion')} placeholder="Macul 1234"/>
                {errors.direccion && (
                  <ErrorMsg>{errors.direccion.message}</ErrorMsg>
                )}
              </div>
            </section>
          </article>

          <hr className="space-y-4 border-gray-150"/>

          <article className="flex">
            <section className="flex-1 mr-3">
              <div className="space-y-2">
                <div className="flex">
                  <Label>
                    Contraseña
                  </Label>
                  {showPassword ? (
                    <EyeOff className="ml-auto cursor-pointer" size={18} color="black" onClick={togglePassword} />
                  ) : (
                    <Eye className="ml-auto cursor-pointer" size={18} color="black" onClick={togglePassword} />
                  )}
                </div>
                <Input type={showPassword ? "text" : "password"} {...register('password')} 
                placeholder="Contraseña"/>
              </div>
              <div className="space-y-2">
                <Label>Confirmar Contraseña</Label>
                <Input type={showPassword ? "text" : "password"} {...register('confirmPassword')} 
                placeholder="Confirmar contraseña"/>
              </div>
            </section>

            <section className="flex-1 ml-3">
              <Label>Requisitos de contraseña</Label>
              {errors.password ? (
                <ErrorMsg>{errors.password.message}</ErrorMsg>
              ) : errors.confirmPassword ? (
                <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>
              ) : null}
            </section>
          </article>

          <section className="flex justify-center">
            <Button type="submit" className="w-[193.2px]">
              Registrarse
            </Button>
          </section>
          <Button type="button" variant="outline" className="col-start-2 col-span-4" onClick={() => navigate("/crearPerfiles")}>Ir a crear Perfiles (Temporal)</Button>
          <Button type="button" variant="outline" className="col-start-2 col-span-4" onClick={() => navigate("/diagnostic")}>Ir a Diagnostico (Temporal)</Button>
        </main>
        </CardContent>
      </form>
    </Card>
  </div>
  );
}