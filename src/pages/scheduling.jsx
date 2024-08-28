import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

export default function Scheduling() {
  const [date, setDate] = useState("")
  const [doctor, setDoctor] = useState("")
  const [timeSlot, setTimeSlot] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the appointment data to your backend
    console.log("Appointment scheduled:", { doctor, date, timeSlot })
    alert("Appointment scheduled successfully!")
  }

  const doctorr = [
    "Dr. Smith","Dr. dasda","Dr. Williams"
  ]

  return (
    <Card className="w-full max-w-md mx-auto">
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
                  {doctorr.map((doctor) => (
					<SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
				  ))}
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
                disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
              />
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