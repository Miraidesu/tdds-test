import { useState, useEffect } from "react"
import { useForm } from "react-hook-form";
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

  const [serviceList, setServiceList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [timeSlotList, setTimeSlotList] = useState([]);

  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    mode: "onChange"
  });

  const onSubmit = async () => {
    const data = {
      service,
      date,
      doctor,
      timeSlot,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/userSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };


  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userSchedule/servicios");
        const data = await response.json();
        setServiceList(data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userSchedule/medicos");
        const data = await response.json();
        setDoctorList(data);
      } catch (error) {
        console.error("Error al obtener médicos:", error);
      }
    };
    fetchMedicos();
  }, []);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userSchedule/horarios");
        const data = await response.json();
        setTimeSlotList(data);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
      }
    };
    fetchHorarios();
  }, []);

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
                </Select >
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
          {service && date && doctor && timeSlot? 
            <Button className="w-full" onClick={handleSubmit(onSubmit)}>Reservar</Button>
            : <Button className="w-full" disabled={true}>Reservar</Button> 
          }
          
        </CardFooter>
      </Card>
    </div>
  )
}