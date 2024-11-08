import { CalendarIcon, ClipboardListIcon, UsersIcon, SettingsIcon, LogOutIcon, UserIcon, LogOut, Calendar, Clock, User, Search } from 'lucide-react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'	
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from 'postcss'
import { SelectContent, SelectItem, SelectTrigger } from '@radix-ui/react-select'

function DashCalendar({setActiveComponent}) {
	const [eventSelected, setEventSelected] = useState(false);
	const [event, setEvent] = useState(null);

	const handleEventDetails = () => {
		setActiveComponent('appointments')
		setEventSelected(false)
		console.log(event.id);
	}

	
	const handleClick = (info) => {
		setEvent(info);
		setEventSelected(true);
		console.log(info.id);
	};

	return (
		<div style={
			{
				"--fc-border-color": "#e2e8f0",
				"height": "100%",
				
			}
		}>
			<FullCalendar
				height={'100%'}
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
				eventClick={(info) => handleClick(info.event)}
				events={[
					{
						id: 1,
						title: 'Consulta',
						start: '2024-11-07T08:00:00',
						end: '2024-11-07T09:00:00',
					},
					{
						id: 2,
						title: 'Consulta',
						start: '2024-11-07T09:00:00',
						end: '2024-11-07T10:00:00',
					},
				]}
			/>

			{eventSelected && (
				<Dialog open onOpenChange={setEventSelected}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Evento seleccionado</DialogTitle>
							<DialogDescription>Detalles del evento</DialogDescription>
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
	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Citas</h1>
			<div className='h-screen className="space-y-4'>
				<Card>
					<CardContent className="flex items-center p-4">
					<div className="flex-grow">
						<h2 className="text-lg font-semibold">paciente</h2>
						<div className="flex items-center text-sm text-muted-foreground mt-1">
						<Calendar className="h-4 w-4 mr-1" />
						ahora
						</div>
						<div className="flex items-center text-sm text-muted-foreground mt-1">
						<Clock className="h-4 w-4 mr-1" />
						2
						</div>
					</div>
					<Button variant="outline" size="sm">
						<User className="h-4 w-4 mr-1" />
						Ver detalles
					</Button>
					</CardContent>
				</Card>
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
				return <DashCalendar
					setActiveComponent={setActiveComponent}
					/>
			case 'appointments':
				return <Appointments />
		}
	}

	return (
		<div className="grid grid-cols-4">
			<aside className="bg-white shadow-md min-h-screen">
				<div className="p-4">
					<h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
				</div>
				<nav className="mt-6">
					<a onClick={() => setActiveComponent('calendar')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "calendar" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<CalendarIcon className="w-5 h-5 mr-2" />
						Calendario
					</a>
					<a onClick={() => setActiveComponent('appointments')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "appointments" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<ClipboardListIcon className="w-5 h-5 mr-2" />
						Citas
					</a>
					<a onClick={() => setActiveComponent('patients')} className={`flex items-center px-4 py-2 text-gray-700 ${activeComponent == "patients" ? "" : "hover:"}bg-gray-200 cursor-pointer`}>
						<UsersIcon className="w-5 h-5 mr-2" />
						Pacientes
					</a>
					<br />
					<a onClick={() => handleLogout()} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer`}>
						<LogOut className="w-5 h-5 mr-2" />
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
