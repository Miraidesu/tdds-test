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
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

export default function Scheduling() {
  const [date, setDate] = useState(Date())

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Appointment scheduled:", { doctor, date, timeSlot })
    alert("Appointment scheduled successfully!")
  }

  return (
    <div className="bg-slate-950 max-h-svh">
      <Card className="w-[325px] max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reserva de hora</CardTitle>
          <CardDescription>Descripcion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="servicio">¿Qué servicio necesita?</Label>
                <Select required>
                  <SelectTrigger id="servicio">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="consulta">Consulta medica</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Seleccionar día</Label>
                <Calendar className="rounded-md border"
                  locale={es}
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medico">Seleccionar médico</Label>
                <Select required>
                  <SelectTrigger id="medico">
                    <SelectValue placeholder="Seleccionar medico" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="dr-smith">Dr. House</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">¿Qué horario necesita?</Label>
                <Select required>
                  <SelectTrigger id="hora">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="18:00">18:00</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>Reservar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}