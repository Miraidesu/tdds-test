import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "@/components/error-msg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlignJustify, Trash2 } from 'lucide-react';
import NavBar from "./NavBar";

const userSchema = z.object({
  titulo: z.string()
    .min(1, "El título es requerido")
    .max(40, "El título debe tener máximo 40 caracteres"),
  descripcion: z.string()
    .min(1, "La descripcion es requerida")
    .max(700, "La descripcion no debe sobrepasar los 700 caracteres")
});

export default function Faq() {
  const [preguntasList, setPreguntasList] = useState([])
  const [barActive, setBarActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();



  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
		const response = await fetch("http://localhost:5000/api/preguntas", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data)
		  });

      if(response.ok){
		const result = await response.json();
		console.log(result.message)
		alert("Pregunta insertada")

		fetchData()
	  }else{
        alert("error");
        console.error("Error al registrar", response.message);
	}
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };

  const fetchData = async () => {
    try {
		const response = await fetch("http://localhost:5000/api/preguntas", {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
			credentials: "include",
		  });

      if(response.ok){
		const data = await response.json();
		console.log(data);
		setPreguntasList(data["faq_list"]);
	  }
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }

  };

  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getUserType = async () => {
      const response = await fetch("http://localhost:5000/get_credentials", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setIsAdmin(data["user_type"] === 5);
      } 
    };

    getUserType();
  }, [navigate]);

  const handleDelete = async (id) => {
    console.log(`Eliminar ${id}`);
	const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta pregunta?");

	try {
		const response = await fetch("http://localhost:5000/api/preguntas", {
			method: "DELETE",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		  });

      if(response.ok){
		alert("Pregunta eliminada")
		fetchData();
	  }
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
    }

    // Add your delete logic here
  };

  return (
    <div className="mt-[60px]">
      <NavBar />
      {isAdmin && (
        <Card className={`${!barActive ? "flex" : ""} m-8 md:m-auto md:my-8 md:w-[768px]`}>
          <Button variant={barActive ? "default" : "outline"} className="m-4" onClick={() => setBarActive(!barActive)}>
            <AlignJustify className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="my-auto">
              {barActive ? "Agregar preguntas frecuentes" : "Abrir panel"}
            </CardTitle>
          </CardHeader>
          {barActive && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Pregunta</Label>
                    <Input
                      id="titulo"
                      {...register('titulo')}
                      placeholder="Ingrese la pregunta"
                    />
                    {errors.titulo && <ErrorMsg>{errors.titulo.message}</ErrorMsg>}
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
                    {errors.descripcion && <ErrorMsg>{errors.descripcion.message}</ErrorMsg>}
                  </div>
                  <Button type="submit">Agregar</Button>
                </div>
              </CardContent>
            </form>
          )}
        </Card>
      )}

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Preguntas frecuentes</h1>
        {preguntasList.map((p) => (
          <Accordion type="single" collapsible key={p.id}>
            <AccordionItem className="m-4 border-2 rounded-md px-6" value={`item-${p.id}`}>
              <div className="flex items-center justify-between">
                <AccordionTrigger className="font-bold flex-grow text-left">
                  {p.pregunta}
                </AccordionTrigger>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="ml-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                )}
              </div>
              <AccordionContent>{p.respuesta}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
