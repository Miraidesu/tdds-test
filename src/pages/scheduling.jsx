"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [date, setDate] = useState(Date())
  const [doctor, setDoctor] = useState("")
  const [timeSlot, setTimeSlot] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the appointment data to your backend
    console.log("Appointment scheduled:", { doctor, date, timeSlot })
    alert("Appointment scheduled successfully!")
  }

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]

  return (
    <Card className="w-[325px] max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>Book an hour with one of our medical professionals.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select a Doctor</Label>
              <Select onValueChange={setDoctor} required>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select a Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-slot">Select a Time Slot</Label>
              <Select onValueChange={setTimeSlot} required>
                <SelectTrigger id="time-slot">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>Schedule Appointment</Button>
      </CardFooter>
    </Card>
  )
}