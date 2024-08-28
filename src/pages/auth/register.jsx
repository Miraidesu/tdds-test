import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Register() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Registro</CardTitle>
        <CardDescription>
          Ingresa tu información para crear una cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Juan" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Apellido</Label>
              <Input id="surname" placeholder="Perez" required />
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            <div className="grid col-start-4 col-end-6 gap-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" placeholder="12345678" required />
            </div>
            <div className="grid gap-2">
              <Input id="digit" placeholder="K" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@ejemplo.cl"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Crear cuenta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
