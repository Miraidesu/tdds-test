"use client"

import { useState } from "react"
import { Search, Calendar, Clock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialAppointments = [
  { id: 1, doctor: "Dr. Smith", date: "15-06-2024", time: "09:00 AM" },
  { id: 2, doctor: "Dr. Johnson", date: "16-06-2024", time: "02:30 PM" },
  { id: 3, doctor: "Dr. Williams", date: "17-06-2024", time: "11:15 AM" },
  { id: 4, doctor: "Dr. Brown", date: "18-06-2024", time: "10:00 AM" },
  { id: 5, doctor: "Dr. Davis", date: "19-06-2024", time: "03:45 PM" },
]

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    filterAppointments(event.target.value, sortBy)
  }

  const handleSort = (value) => {
    setSortBy(value)
    filterAppointments(searchTerm, value)
  }

  const filterAppointments = (search, sort) => {
    let filtered = initialAppointments.filter(
      (appointment) =>
        appointment.doctor.toLowerCase().includes(search.toLowerCase()) ||
        appointment.date.includes(search) ||
        appointment.time.toLowerCase().includes(search.toLowerCase())
    )

    filtered.sort((a, b) => {
      if (sort === "doctor") {
        return a.doctor.localeCompare(b.doctor)
      } else if (sort === "time") {
        return a.time.localeCompare(b.time)
      } else {
        return a.date.localeCompare(b.date)
      }
    })

    setAppointments(filtered)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Mis citas medicas</h1>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar citas"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        <Select onValueChange={handleSort} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Ordenar por fecha</SelectItem>
            <SelectItem value="doctor">Ordenar por doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="flex items-center p-4">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{appointment.doctor}</h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {appointment.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-1" />
                Ver detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}