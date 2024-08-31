import { Card, 
	CardContent, 
	CardFooter, 
	CardHeader, 
	CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Info() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Información</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<Card className="overflow-hidden">
		<img src="https://via.placeholder.com/500"
			className="w-full h-48 object-cover"/>
		<CardHeader>
			<CardTitle>Título</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="text-muted-foreground">sd</p>
		</CardContent>
		<CardFooter className="justify-center">
			<Button className="w-1/2">Leer</Button>
		</CardFooter>
		</Card>
      </div>
    </div>
  )
}