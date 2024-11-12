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
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "date-fns";

export default function UserScheduling() {
  const [userValid, setUserValid] = useState(false)
  // Verificacion en carga de elementos
  const [servLoading, setServLoading] = useState(true)
  const [docLoading, setDocLoading] = useState(true)
  const [timeLoading, setTimeLoading] = useState(true)
  // Guardado de datos
  const [service, setService]   = useState("")
  const [date, setDate]         = useState(null)
  const [doctor, setDoctor]     = useState("")
  const [timeSlot, setTimeSlot] = useState("")

  const [serviceList, setServiceList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [timeSlotList, setTimeSlotList] = useState([]);

  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    mode: "onChange"
  });

  const navigate = useNavigate();

  

useEffect(() => {
    const getUserType = async () => {
      const response = await fetch("http://localhost:5000/get_credentials", {
        method: "GET", // Tipo de solicitud
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Esto asegura que las cookies se envíen con la solicitud
      });
    
      if (response.ok) {
        const data = await response.json();
        if (data.user_type === 1) {
          return setUserValid(true)
        }
        navigate("/");
      } else {
        navigate("/");
      }
    };
    getUserType()
}, []);

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
        setServLoading(false)
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };
    fetchServicios()
  }, []); 

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userSchedule/medicos");
        const data = await response.json();
        setDoctorList(data);
        setDocLoading(false)
        console.log(data)
      } catch (error) {
        console.error("Error al obtener médicos:", error);
      }
    };
    fetchMedicos();
  }, [date]);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/userSchedule/horarios/${doctor}`);
        const data = await response.json();
        setTimeSlotList(data);
        setTimeLoading(false)
        console.log(data)
      } catch (error) {
        console.error("Error al obtener horarios:", error);
      }
    };
    fetchHorarios();
  }, [doctor]);

  const handleService = (value) => {
    const selectedService = serviceList.find((i) => i.label === value);
  if (selectedService) {
    setService(selectedService.value);
  }
  };

  const handleDoctor = (value) => {
    const selectedDoctor = doctorList.find((i) => i.label === value);
    if (selectedDoctor) {
      setDoctor(selectedDoctor.value);
    }
  };

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00"
  ]
  
  if (userValid) {
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

              {servLoading ? <Skeleton className="w-[275px] h-[72px]"/> : (
                <div className="space-y-2">
                  <Label htmlFor="servicio">¿Qué servicio necesita?</Label>
                  <Select onValueChange={handleService} required>
                    <SelectTrigger id="servicio">
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceList.map((i) => 
                        <SelectItem value={i.label}>{i.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

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

              {date ? (
                docLoading ? (
                  <Skeleton className="w-[275px] h-[72px]" />
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="medico">Seleccionar médico</Label>
                    <Select onValueChange={handleDoctor} required>
                      <SelectTrigger id="medico">
                        <SelectValue placeholder="Seleccionar medico" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctorList.map((i) => (
                          <SelectItem key={i.label} value={i.label}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              ) : null}

              { doctor ?
              <div className="space-y-2">
                <Label htmlFor="hora">¿Qué horario necesita?</Label>
                <Select onValueChange={(v) => setTimeSlot(v)} required>
                  <SelectTrigger id="hora">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((i) => 
                      <SelectItem value={i}>{i}</SelectItem>
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
}