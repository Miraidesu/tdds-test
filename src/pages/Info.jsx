import { Card, 
	CardContent, 
	CardFooter, 
	CardHeader, 
	CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
 } from "@/components/ui/accordion"

export default function Info() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Preguntas frecuentes</h1>
	  	<Accordion type="single" collapsible>
			<AccordionItem className="m-2 border-2 rounded-md px-6"  value="item-1">
				<AccordionTrigger  className="font-bold">Pregunta</AccordionTrigger>
				<AccordionContent>
					Hola
				</AccordionContent>
			</AccordionItem>
			<AccordionItem className="m-2 border-2 rounded-md px-6"  value="item-2">
				<AccordionTrigger className="font-bold">Pregunta</AccordionTrigger>
				<AccordionContent>
					Hola Mundo!
				</AccordionContent>
			</AccordionItem>
		</Accordion>
    </div>
  )
}