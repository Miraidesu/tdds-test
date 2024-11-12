import ErrorMsg from "@/components/error-msg";
import { Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlignJustify } from "lucide-react";
import NavBar from "./NavBar";

const userSchema = z.object({
	titulo: z.string()
	  .min(1, "El título es requerido")
	  .max(40, "El título debe tener máximo 40 caracteres"),
	descripcion: z.string()
	  .min(1, "La descripcion es requerida")
	  .max(700, "La descripcion no debe sobrepasar los 700 caracteres") 
  })

export default function Faq() {
	const isAdmin = true;
	const [barActive, setBarActive] = useState(false);
	const handleBar = () => {
		setBarActive(!barActive)
	}
	const preguntasList = [
		{
			id: 1,
			titulo: "Pregunta",
			descripcion: "Respuesta"
		},
		{
			id: 2,
			titulo: "Pregunta 2",
			descripcion: "Respuesta 2"
		},
	]

	const { register, handleSubmit, formState: { errors } } = useForm({
		resolver: zodResolver(userSchema),
		mode: "onChange",
	})

	const onSubmit = async (data) => {
		console.log("Form submitted with data:", data)
	}


  	return (
	<div className="mt-[60px]">
		<NavBar />
		{isAdmin &&
			<Card className={`${!barActive ? "flex" : ""} m-8 md:m-auto md:my-8 md:w-[768px]`}>
				<Button 
					variant={barActive ? "default" : "outline"} 
					className="m-4" 
					onClick={() => handleBar()} >
					<AlignJustify className="h-4 w-4" />
				</Button>
				<CardHeader>
					<CardTitle className="my-auto">
						{barActive ? "Agregar preguntas frecuentes" : "Abrir panel"}
					</CardTitle>
			  	</CardHeader>
			{barActive && <form onSubmit={handleSubmit(onSubmit)}>
			  
			  <CardContent>
				<div className="space-y-4">
				  <div className="space-y-2">
					<Label htmlFor="titulo">Pregunta</Label>
					<Input
					  id="titulo"
					  {...register('titulo')} 
					  placeholder="Ingrese la pregunta"
					/>
					{errors.titulo && (
					  <ErrorMsg>{errors.titulo.message}</ErrorMsg>
					)}
				  </div>
				  
				  <div className="space-y-2">
					<Label htmlFor="descripcion">Descripción</Label>
					<Textarea 
					  id="descripcion"
					  {...register('descripcion')} 
					  rows={10}
					  placeholder="Ingrese la descripción"
					  className="min-h-[150px] resize-y"
					/>
					{errors.descripcion && (
					  <ErrorMsg>{errors.descripcion.message}</ErrorMsg>
					)}
					</div>
					<Button type="submit">
						Agregar
					</Button>
				</div>
			  </CardContent>
			</form>}
		  </Card>
		}
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8 text-center">Preguntas frecuentes</h1>
			{preguntasList.map((p) => (
				<Accordion type="single" collapsible>
					<AccordionItem className="m-4 border-2 rounded-md px-6"  value="item-1">
						<AccordionTrigger className="font-bold">
							{p.titulo}
						</AccordionTrigger>
						<AccordionContent>{p.descripcion}</AccordionContent>
					</AccordionItem>
				</Accordion>
			))}
		</div>
	</div>
	)
}