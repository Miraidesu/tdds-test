import { useState, useEffect } from 'react'
import { 
	CalendarIcon, 
	ClipboardListIcon, 
	UsersIcon, 
	LogOut, 
	Calendar, 
	Clock, 
	User, 
	FileText
} from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'	
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter
} from "@/components/ui/dialog"
import { format } from 'date-fns'


function DashCalendar({ setActiveComponent, citasList, setAppointment }) {
	const [eventSelected, setEventSelected] = useState(false);
	const [event, setEvent] = useState(null);

	const handleEventDetails = () => {
		setActiveComponent('appointments');
		setEventSelected(false);
		setAppointment(event);
	};

	const handleClick = (info) => {
		setEvent(info.event);
		setEventSelected(true);
	};

	return (
		<div style={{ overflowY: 'auto' }}>
			<FullCalendar
				height="100vh"
				plugins={[dayGridPlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				headerToolbar={{
					right: 'today timeGridDay,timeGridWeek,dayGridMonth prev,next',
					left: 'title',
				}}
				allDaySlot={false}
				views={{
					week: {
						titleFormat: { year: 'numeric', month: 'long' },
						dayHeaderFormat: { weekday: 'short', day: 'numeric' },
					}
				}}
				slotLabelFormat={
					{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }
				}
				nowIndicator={true}
				locale={'es'}
				firstDay={1}
				buttonText={{
					today: 'Hoy',
					day: 'Día',
					month: 'Mes',
					week: 'Semana',
					prev: 'Anterior',
					next: 'Siguiente',
				}}
				eventMouseEnter={(e) => {
					e.el.style.cursor = 'pointer';
				}}
				eventClick={(info) => handleClick(info)}
				events={citasList.map((cita) => ({
					id: cita.id,
					title: cita.paciente.nombre,
					start: cita.fec_inicio,
					end: cita.fec_termino,
				}))}
			/>

			{eventSelected && event && (
				<Dialog open onOpenChange={setEventSelected}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Evento seleccionado</DialogTitle>
							<DialogFooter>
								<Button onClick={handleEventDetails}>Ver detalles</Button>
								<Button variant="outline" onClick={() => setEventSelected(false)}>Volver</Button>
							</DialogFooter>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

function Appointments({citasList, setAppointment, appointment}) {

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Citas</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{/* {citasList.map((appointment) => (
					<Card>
						<CardContent className="flex pt-4">
							<div className='grow'>
								<h2 className="text-lg font-semibold">{appointment.title}</h2>
								<div className="flex items-center text-sm mt-1">
									<Calendar className="h-4 w-4 mr-1" />
									{format(new Date(appointment.start), 'dd/MM/yyyy')}
								</div>
								<div className="flex items-center text-sm mt-1">
									<Clock className="h-4 w-4 mr-1" />
									{format(new Date(appointment.start), 'HH:mm')} - {format(new Date(appointment.end), 'HH:mm')}
								</div>
							</div>
							<div className='m-auto'>
								<Button onClick={() => setAppointment(appointment)}>
									<FileText className="h-4 w-4 mr-1" />
									Detalles
								</Button>
							</div>
						</CardContent>
					</Card>
				))} */}
				{appointment && (
				<Dialog open onOpenChange={setAppointment}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								Cita #{appointment.id}
							</DialogTitle>
							<DialogDescription>
								Nombre: {appointment.title} <br />
								Fecha: {format(new Date(appointment.start), 'dd/MM/yyyy')} <br />
								Inicio: {format(new Date(appointment.start), 'HH:mm')} <br />
								Fin: {format(new Date(appointment.end), 'HH:mm')}
							</DialogDescription>
							<DialogFooter>
								<Button variant="outline" onClick={() => setAppointment(false)}>Volver</Button>
							</DialogFooter>
						</DialogHeader>
					</DialogContent>
				</Dialog> )}
			</div>
		</>
	);
}

function Patients({citasList}) {

	return (
		<>	
			<h1 className="text-2xl font-bold mb-4">Tus pacientes</h1>
			<div className='space-y-4'>
				{citasList.map((cita) => (
					<Card key={cita.id}>
						<CardContent className="flex items-center p-4">
							<div className="flex-grow">
								<h2 className="text-lg font-semibold">{cita.paciente.nombre}</h2>
							</div>
							<Button size="sm">
								<User className="h-4 w-4 mr-1" />
								Detalles
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
function handleLogout() {
	console.log("Logout");
}

export default function Dashboard() {
	const [activeComponent, setActiveComponent] = useState('calendar');
	const [citasList, setCitasList] = useState([]);
	const [appointment, setAppointment] = useState(null);

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/dashboard/get_appointments", {
				method: "GET",
				headers: {
				  "Content-Type": "application/json",
				},
				credentials: "include",
			  });
			const data = await response.json();
			setCitasList(data);
		} catch (error) {
			console.error("Error al obtener citas:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);


	const renderComponent = () => {
		switch (activeComponent) {
			case 'calendar':
				return <DashCalendar setActiveComponent={setActiveComponent} setAppointment={setAppointment} citasList={citasList}/>
			case 'appointments':
				return <Appointments citasList={citasList} setAppointment={setAppointment} appointment={appointment}/>
			case 'patients':
				return <Patients citasList={citasList}/>
			default:
				return <DashCalendar setActiveComponent={setActiveComponent} citasList={citasList}/>
		}
	}

	return (
		<div className={`grid grid-cols-[200px_1fr_1fr_1fr]`}>
			<aside className="h-full min-h-screen bg-white shadow-md">
				<div className="p-4">
					<h2 className="text-2xl font-bold text-gray-800">
						Dashboard
					</h2>
				</div>
				<nav className="mt-6">
					<a onClick={() => setActiveComponent('calendar')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "calendar" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<CalendarIcon className="w-6 h-6 mr-3" />
						Calendario
					</a>
					<a onClick={() => setActiveComponent('appointments')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "appointments" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<ClipboardListIcon className="w-6 h-6 mr-3" />
						Citas
					</a>
					<a onClick={() => setActiveComponent('patients')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "patients" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<UsersIcon className="w-6 h-6 mr-3" />
						Pacientes
					</a>
					<br />
					<a onClick={() => handleLogout()} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer`}>
						<LogOut className="w-6 h-6 mr-3" />
						Cerrar Sesión
					</a>
				</nav>
			</aside>
			<main className="col-start-2 col-span-3 p-4">
				{renderComponent()}
			</main>
			
		</div>
	);
}
