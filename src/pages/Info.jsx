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
      <div>
	  	<Accordion className="border-2 rounded-md p-2" type="single" collapsible>
			<AccordionItem  value="item-1">
				<AccordionTrigger  className="font-bold">Pregunta</AccordionTrigger>
				<AccordionContent>
					Wena choro
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger className="font-bold">Pregunta</AccordionTrigger>
				<AccordionContent>
					ola mundo
				</AccordionContent>
			</AccordionItem>
		</Accordion>
      </div>
    </div>
  )
}