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


function DashCalendar({ setActiveComponent }) {
	const [eventSelected, setEventSelected] = useState(false);
	const [event, setEvent] = useState(null);
	const [citasList, setCitasList] = useState([]);

	const handleEventDetails = () => {
		setActiveComponent('appointments');
		setEventSelected(false);
	};

	const handleClick = (info) => {
		setEvent(info.event);
		setEventSelected(true);
	};

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/dashboard/pacientes");
			const data = await response.json();
			const events = data["citas"].map((appointment) => ({
				id: appointment.id,
				title: appointment.patient,
				start: appointment.start_date,
				end: appointment.end_date,
			}));
			setCitasList(events);
		} catch (error) {
			console.error("Error al obtener citas:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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
				nowIndicator
				locale="es"
				firstDay={1}
				eventClick={(info) => handleClick(info)}
				events={citasList}
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

function Appointments() {
	const [citasList, setCitasList] = useState([]);

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/dashboard/pacientes");
			const data = await response.json();
			setCitasList(data["citas"]);
		} catch (error) {
			console.error("Error al obtener citas:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Citas</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{citasList.map((appointment) => (
					<Card key={appointment.id}>
						<CardContent className="flex pt-4">
							<div className='grow'>
								<h2 className="text-lg font-semibold">{appointment.patient}</h2>
								<div className="flex items-center text-sm mt-1">
									<Calendar className="h-4 w-4 mr-1" />
									{format(new Date(appointment.start_date), 'dd/MM/yyyy')}
								</div>
								<div className="flex items-center text-sm mt-1">
									<Clock className="h-4 w-4 mr-1" />
									{format(new Date(appointment.start_date), 'HH:mm')} - {format(new Date(appointment.end_date), 'HH:mm')}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}



function Patients() {
	const [citasList, setCitasList] = useState([]);

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/dashboard/pacientes");
			const data = await response.json();
			setCitasList(data["citas"]);
		} catch (error) {
			console.error("Error al obtener pacientes:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>	
			<h1 className="text-2xl font-bold mb-4">Tus pacientes</h1>
			<div className='space-y-4'>
				{citasList.map((cita) => (
					<Card key={cita.id}>
						<CardContent className="flex items-center p-4">
							<div className="flex-grow">
								<h2 className="text-lg font-semibold">{cita.patient}</h2>
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

	const renderComponent = () => {
		switch (activeComponent) {
			case 'calendar':
				return <DashCalendar setActiveComponent={setActiveComponent} />
			case 'appointments':
				return <Appointments />
			case 'patients':
				return <Patients />
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
