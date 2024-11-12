import { Button } from "@/components/ui/button";
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

export default function Login() {
  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    mode: "onChange"
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Convertir valores numéricos
    data.rutNum = Number(data.rutNum);
    data.rutDig = Number(data.rutDig);
    data.phone = Number(data.phone);

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
        // navigate("/userSchedule");
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog>
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
                {...register("rutNum", { required: true })}
              />
              <Input
                id="rutDig"
                placeholder="K"
                {...register("rutDig", { required: true })}
              />
            </div>
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
