import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
		Home
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Welcome to MediCare Center
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Providing compassionate care and cutting-edge medical services to our community.
                </p>
              </div>
              <Button className="bg-white text-primary hover:bg-gray-100" size="lg">
                Book an Appointment
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
				Noticias
			</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family Medicine</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Comprehensive care for patients of all ages, focusing on prevention and overall wellness.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>24/7 emergency services with state-of-the-art equipment and experienced staff.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Specialized Treatments</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Advanced treatments in cardiology, neurology, oncology, and more.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Book Your Appointment</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Schedule your visit with our experienced doctors. We're here to provide you with the best care possible.
                </p>
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90" size="lg">
                Schedule Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 MediCare Center. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">

        </nav>
      </footer>
    </div>
  )
}