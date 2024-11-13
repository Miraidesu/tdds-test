'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ErrorMsg from "@/components/error-msg"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const userSchema = z.object({
  codigoReserva: z.string(),
  nombrePaciente: z.string(),
  motivo: z.string()
    .min(1, "El Motivo es requerido")
    .max(40, "El Motivo debe tener máximo 40 caracteres"),
  diagnostico: z.string()
    .min(1, "El diagnóstico es requerido")
    .max(700, "El diagnostico no debe sobrepasar los 700 caracteres") 
})

export default function DoctorsDiagnostic() {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      codigoReserva: "R12345", // Example value, replace with actual data
      nombrePaciente: "Juan Pérez" // Example value, replace with actual data
    }
  })

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data)
    try {
      const response = await fetch("http://localhost:5000/api/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
  
      if (response.ok) {
        const result = await response.json()
        alert(result.message)
      } else {
        console.error("Error al registrar:", response.statusText)
      }
    } catch (error) {
      console.error("Error de conexión:", error)
    }
  }

  return (
    <div className="bg-slate-950 w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
          <Button variant="outline" className="m-0 p-0 w-8 h-8" onClick={() => navigate("/dashboard")}>
            <ArrowLeft />
          </Button>
            <CardTitle>Consulta</CardTitle>
            <CardDescription>Ingrese los datos de la consulta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <Label htmlFor="codigoReserva">Código Reserva</Label>
                  <Input
                    id="codigoReserva"
                    {...register('codigoReserva')}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="w-2/3">
                  <Label htmlFor="nombrePaciente">Nombre Paciente</Label>
                  <Input
                    id="nombrePaciente"
                    {...register('nombrePaciente')}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  {...register('motivo')} 
                  placeholder="Ingrese el Motivo"
                />
                {errors.motivo && (
                  <ErrorMsg>{errors.motivo.message}</ErrorMsg>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnostico</Label>
                <Textarea 
                  id="diagnostico"
                  {...register('diagnostico')} 
                  rows={10}
                  placeholder="Ingrese el diagnóstico"
                  className="min-h-[150px] resize-y"
                />
                {errors.diagnostico && (
                  <ErrorMsg>{errors.diagnostico.message}</ErrorMsg>
                )}
              </div>

              <hr className="border-gray-200 dark:border-gray-800" />

              <div className="flex flex-col space-y-2">
                <Button type="submit">
                  Registrar Consulta
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Volver a Calendario
                </Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}