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

export default function UserScheduling() {
  const [service, setService]   = useState()
  const [date, setDate]         = useState()
  const [doctor, setDoctor]     = useState()
  const [timeSlot, setTimeSlot] = useState()

  const serviceList = [
    { value: "consulta", label: "Consulta medica" }
  ]
  const doctorList = [
    { value: "dr-house", label: "Dr. House" }
  ]
  const timeSlotList = [
    { value: "18:00", label: "18:00" }
  ]


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Appointment scheduled:", { service, doctor, date, timeSlot })
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
                <Select onValueChange={(v) => setService(v)} required>
                  <SelectTrigger id="servicio">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceList.map((i) => 
                      <SelectItem value={i.value}>{i.label}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              { service ?
                <div className="space-y-2">
                  <Label>Seleccionar día</Label>
                  <Calendar className="rounded-md border"
                    locale={es}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()} />
                </div> 
              : null }

              { date ?
              <div className="space-y-2">
                <Label htmlFor="medico">Seleccionar médico</Label>
                <Select onValueChange={(v) => setDoctor(v)} required>
                  <SelectTrigger id="medico">
                    <SelectValue placeholder="Seleccionar medico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctorList.map((i) => 
                      <SelectItem value={i.value}>{i.label}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              : null }

              { doctor ?
              <div className="space-y-2">
                <Label htmlFor="hora">¿Qué horario necesita?</Label>
                <Select onValueChange={(v) => setTimeSlot(v)} required>
                  <SelectTrigger id="hora">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlotList.map((i) => 
                      <SelectItem value={i.value}>{i.label}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              : null }
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={true} onClick={handleSubmit}>Reservar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}