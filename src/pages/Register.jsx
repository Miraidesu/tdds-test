import { useState } from "react"
import { es } from "date-fns/locale"
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
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

export default function UserScheduling() {
  const [date, setDate] = useState(Date())
  const [canSubmit, setCanSubmit] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Appointment scheduled:", { service, doctor, date, timeSlot })
    alert("Appointment scheduled successfully!")
  }

  return (
    <div className="bg-slate-950 max-h-svh">
      <Card className="w-[325px] max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Ingrese sus datos para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form >
            <div className="space-y-4">
              <Label htmlFor="rut">
                RUT
              </Label>
              <div className="grid grid-cols-5 gap-4">
                <Input
                  id="rut"
                  placeholder="12345678"
                  maxLength={8}
                  className="col-span-2"/>
                <Input
                  id="dig"
                  maxLength={1}
                  onKeyDown={(e) => {
                    if (e.target.value !== "K" && e.target.value !== "k") {
                      e.target.blur()
                    }
                  }}
                  placeholder="K"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre(s)</Label>
                <Input placeholder="Nombre"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido(s)</Label>
                <Input placeholder="Apellido"/>
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
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={canSubmit} onClick={handleSubmit} >Registrarse</Button>
        </CardFooter>
      </Card>
    </div>
  )
}