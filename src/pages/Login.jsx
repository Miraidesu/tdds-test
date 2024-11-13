import { Button } from "@/components/ui/button";
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from 'zod';
import ErrorMsg from "@/components/error-msg"
import { zodResolver } from '@hookform/resolvers/zod';




const userSchema = z.object({
  rutNum: z.string()
    .min(1, "El RUT es requerido")
    .regex(/^[0-9]+$/, "El RUT debe ser numérico")
    .min(7, "El RUT debe tener minimo 7 digitos")
    .max(8, "El RUT debe tener máximo 8 digitos"),
  rutDig: z.string()
    .min(1, "El digito verificador es requerido")
    .regex(/^[0-9kK]+$/, "El digito verificador debe ser un número o K"),
  password: z.string()
    .min(1, "Ingrese su contraseña"),
})





export default function Login() {
  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    resolver : zodResolver(userSchema),
    mode: "onChange"
  });
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Convertir valores numéricos
    data.rutNum = Number(data.rutNum);
    data.rutDig = Number(data.rutDig);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setIsOpen(false)
        
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ingresar</Button>
      </DialogTrigger>
      <DialogContent className="rounded-md w-96">
        <DialogHeader className="space-y-4">
          <DialogTitle>Ingreso</DialogTitle>
          <DialogDescription>
            Ingrese sus datos para acceder a la plataforma
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="rutNum" className="text-right col-start-2">
                RUT
              </Label>
              <Input
                id="rutNum"
                placeholder="12345678"
                className="col-span-2"
                {...register("rutNum")}
              />
              <Input
                id="rutDig"
                placeholder="K"
                {...register("rutDig",)}
              />
              
            </div>
            {errors.rutNum ? (
                  <ErrorMsg>{errors.rutNum.message}</ErrorMsg>
                ) : errors.rutDig ? (
                  <ErrorMsg>{errors.rutDig.message}</ErrorMsg>
                ) : null}
            <div className="grid grid-cols-6 items-center gap-4"> 
              <Label htmlFor="password" className="text-right col-span-2">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                className="col-start-3 col-span-3"
                {...register("password", { required: true })}
              />
            </div>
            {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          </div>
          <DialogFooter className="grid grid-cols-6 gap-4">
            <Button type="submit" className="col-start-2 col-span-4">Entrar</Button>
            <Button type="button" variant="outline" className="col-start-2 col-span-4">Entrar con Google</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
