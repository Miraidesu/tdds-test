import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fec_inicio");
  const [userValid, setUserValid] = useState(false);
  const navigate = useNavigate();
  const today = new Date();

  const getUserCredentials = useCallback(async () => {
    try {
      console.log("Fetching user credentials...");
      const response = await fetch("http://localhost:5000/get_credentials", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received credentials:", data);
        if (data.user_type === 1) {
          setUserValid(true);
        } else {
          console.log("Invalid user type, redirecting to home");
          navigate("/");
        }
      } else {
        console.log("Failed to get credentials, redirecting to home");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking user type:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    getUserCredentials();
  }, [getUserCredentials]);

  const fetchAppointments = useCallback(async () => {
    if (!userValid) {
      console.log("User not valid, skipping appointment fetch");
      return;
    }

    try {
      console.log("Fetching appointments...");
      console.log("Search term:", searchTerm);
      console.log("Sort by:", sortBy);

      const response = await fetch(
        `http://localhost:5000/api/appointments?search=${encodeURIComponent(searchTerm)}&sort=${encodeURIComponent(sortBy)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 401) {
        console.error("Unauthorized: Please log in again.");
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData.error || "Failed to fetch appointments");
        return;
      }

      const data = await response.json();
      console.log("Received appointments data:", data);

      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [searchTerm, sortBy, navigate, userValid]);

  useEffect(() => {
    if (userValid) {
      fetchAppointments();
    }
  }, [userValid, fetchAppointments]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleDelete = async (appointmentId) => {
    try {
      const confirmDelete = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
      if (!confirmDelete) return;
      console.log("Deleting appointment...");
      console.log("Appointment ID:", appointmentId);
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ appointment_id: appointmentId }),
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 401) {
        console.error("Unauthorized: Please log in again.");
        navigate("/");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Appointment deleted successfully");
        setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
      } else if (response.status === 404) {
        console.error("Appointment not found");
      } else {
        console.error("Server error:", data.message || "Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (!userValid) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Mis citas médicas</h1>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por especialidad o médico"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        <Select onValueChange={handleSort} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fec_inicio">Fecha de inicio</SelectItem>
            <SelectItem value="fec_termino">Fecha de término</SelectItem>
            <SelectItem value="especialidad">Especialidad</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {appointments.map((appointment) => {
          const endDate = new Date(appointment.end_date);

          return (
            <Card key={appointment.id}>
              <CardContent className="flex items-center p-4">
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    {appointment.specialty}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <User className="h-4 w-4 mr-1" />
                    Nombre Doctor: {appointment.doctor_name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Inicio: {formatDate(appointment.start_date)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Término: {formatDate(appointment.end_date)}
                  </div>
                </div>
                
                {endDate >= today && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { Search, Calendar, Clock, User } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// const initialAppointments = [
//   { id: 1, doctor: "Dr. Smith", date: "15-06-2024", time: "09:00 AM" },
//   { id: 2, doctor: "Dr. Johnson", date: "16-06-2024", time: "02:30 PM" },
//   { id: 3, doctor: "Dr. Williams", date: "17-06-2024", time: "11:15 AM" },
//   { id: 4, doctor: "Dr. Brown", date: "18-06-2024", time: "10:00 AM" },
//   { id: 5, doctor: "Dr. Davis", date: "19-06-2024", time: "03:45 PM" },
// ]

// export default function Appointments() {
//   const [appointments, setAppointments] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortBy, setSortBy] = useState("fec_inicio")
//   const [userValid, setUserValid] = useState(false)
//   const navigate = useNavigate()
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const getUserType = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/get_credentials", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         })

//         if (response.ok) {
//           const data = await response.json()
//           if (data.user_type === 1) {
//             setUserValid(true)
//             setToken(data.token);
//           } else {
//             navigate("/")
//           }
//         } else {
//           navigate("/")
//         }
//       } catch (error) {
//         console.error("Error checking user type:", error)
//         navigate("/")
//       }
//     }

//     getUserType()
//   }, [navigate])

//   useEffect(() => {
//     if (userValid) {
//       fetchAppointments()
//     }
//   }, [userValid, searchTerm, sortBy])


//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch(
//                 `http://localhost:5000/api/appointments?search=${searchTerm}&sort=${sortBy}`, 
//                 {
//                   method: "GET",
//                   headers: {
//                     "Authorization": `Bearer ${token}`, // Agregar el token aquí
//                     "Content-Type": "application/json",
//                   },
//                   credentials: "include",
//                 }
//               );
//       const data = await response.json()
//       if (response.ok) {
//         setAppointments(data)
//       } else {
//         console.error(data.message || "Failed to fetch appointments")
//       }
//     } catch (error) {
//       console.error("Error fetching appointments:", error)
//     }
//   }

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value)
//     filterAppointments(event.target.value, sortBy)
//   }

//   const handleSort = (value) => {
//     setSortBy(value)
//     filterAppointments(searchTerm, value)
//   }


//   const handleDelete = async (appointmentId) => {
//     try {
//       const response = await fetch(`/api/appointment/${appointmentId}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       })
      
//       if (response.ok) {
//         setAppointments(appointments.filter(appointment => appointment.id !== appointmentId))
//       } else {
//         const data = await response.json()
//         console.error(data.message || "Failed to delete appointment")
//       }
//     } catch (error) {
//       console.error("Error deleting appointment:", error)
//     }
//   }

//   const filterAppointments = (search, sort) => {
//     let filtered = initialAppointments.filter(
//       (appointment) =>
//         appointment.doctor.toLowerCase().includes(search.toLowerCase()) ||
//         appointment.date.includes(search) ||
//         appointment.time.toLowerCase().includes(search.toLowerCase())
//     )

//     filtered.sort((a, b) => {
//       if (sort === "doctor") {
//         return a.doctor.localeCompare(b.doctor)
//       } else if (sort === "time") {
//         return a.time.localeCompare(b.time)
//       } else {
//         return a.date.localeCompare(b.date)
//       }
//     })

//     setAppointments(filtered)
//   }

//   return (
//     <div className="container mx-auto p-4 max-w-2xl">
//       <h1 className="text-2xl font-bold mb-4">Mis citas medicas</h1>
//       <div className="flex gap-2 mb-4">
//         <div className="relative flex-grow">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar citas"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="pl-8"
//           />
//         </div>
//         <Select onValueChange={handleSort} defaultValue={sortBy}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="date">Ordenar por fecha</SelectItem>
//             <SelectItem value="doctor">Ordenar por doctor</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-4">
//         {appointments.map((appointment) => (
//           <Card key={appointment.cod_reserva}>
//             <CardContent className="flex items-center p-4">
//               <div className="flex-grow">
//                 <h2 className="text-lg font-semibold">{appointment.doctor}</h2>
//                 <div className="flex items-center text-sm text-muted-foreground mt-1">
//                   <Calendar className="h-4 w-4 mr-1" />
//                   {appointment.fec_inicio}
//                 </div>
//                 <div className="flex items-center text-sm text-muted-foreground mt-1">
//                   <Clock className="h-4 w-4 mr-1" />
//                   {appointment.fec_termino}
//                 </div>
//               </div>
//               <Button variant="outline" size="sm">
//                 <User className="h-4 w-4 mr-1" />
//                 Ver detalles
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
