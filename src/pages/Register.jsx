import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Register() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Registro</Button>
      </DialogTrigger>
      <DialogContent className="rounded-md w-96">
        <DialogHeader className="space-y-4">
          <DialogTitle>Registro</DialogTitle>
          <DialogDescription>
            Ingrese sus datos para crear una cuenta
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="rut" className="text-right col-start-2">
              RUT
            </Label>
            <Input
              id="rut"
              placeholder="12345678"
              className="col-span-2"/>
            <Input
              id="dig"
              placeholder="K"/>
          </div>
          <div className="grid grid-cols-6 items-center gap-4"> 
            <Label htmlFor="password" className="text-right col-span-2">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              className="col-start-3 col-span-3"/>
          </div>
        </div>
        <DialogFooter className="grid grid-cols-6 gap-4">
          <Button type="submit" className="col-start-2 col-span-4">Entrar</Button>
          <Button type="submit" variant="outline" className="col-start-2 col-span-4">Registrar con Google</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
