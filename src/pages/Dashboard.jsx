import { useState, useEffect } from 'react'
import { 
	CalendarIcon, 
	ClipboardListIcon, 
	UsersIcon, 
	LogOut, 
	Calendar, 
	Clock, 
	User, 
	FileText,
	Cake,
	Mail,
	Phone,
	MapPin
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
	DialogFooter
} from "@/components/ui/dialog"
import { format, differenceInYears } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, useNavigate } from 'react-router-dom'


function DashCalendar({ setActiveComponent, citasList, setAppointment }) {

	const handleClick = (info) => {
		setActiveComponent('appointments');
		const appointment = citasList.find((cita) => cita.id == info.event.id);
		setAppointment(appointment);
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
		</div>
	);
}

function Appointments({setActiveComponent, citasList, pacientesList, setAppointment, appointment, setPaciente}) {

	const handleClick = (appointment) => {
		setActiveComponent('patients');
		const paciente = pacientesList.find((paciente) => paciente.rut == appointment.paciente.rut);
		setPaciente(paciente);
		setAppointment(false)
	};

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Citas</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{citasList.map((appointment) => (
					<Card>
						<CardContent className="flex pt-4">
							<div className='grow'>
								<h2 className="text-lg font-semibold">{appointment.paciente.nombre}</h2>
								<div className="flex items-center text-sm mt-1">
									<Calendar className="h-4 w-4 mr-1" />
									{format(new Date(appointment.fec_inicio), 'dd/MM/yyyy')}
								</div>
								<div className="flex items-center text-sm mt-1">
									<Clock className="h-4 w-4 mr-1" />
									{format(new Date(appointment.fec_inicio), 'HH:mm')} - {format(new Date(appointment.fec_termino), 'HH:mm')}
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
				))}
				{appointment && (
				<Dialog open onOpenChange={setAppointment}>
					<DialogContent className="pl-10">
						<DialogHeader>
							<DialogTitle className="pb-4">
								Cita #{appointment.id}
							</DialogTitle>
							<DialogDescription className="flex text-black">
								<div className='flex-1 mr-3'>
									<h2 className='font-bold text-base'>{appointment.paciente.nombre}</h2>
									{appointment.paciente.rut}
									<p className='flex py-1'>{differenceInYears(new Date, new Date(appointment.paciente.fec_nac))} años</p>
									<p className='flex py-1'><Mail className='h-5 w-5 mr-2'/>{appointment.paciente.email}</p>
									<p className='flex py-1'><Phone className='h-5 w-5 mr-2'/>{appointment.paciente.telefono}</p>
									<p className='flex pt-6'><Button onClick={() => handleClick(appointment)}>Ver datos</Button></p>
								</div>
								<div className='flex-1 ml-3 text-lg font-bold'>
									<p className='flex py-1'><Calendar className='h-8 w-8 mr-2'/>{format(new Date(appointment.fec_inicio), 'dd/MM/yyyy')}</p>
									<p className='flex py-1'><Clock className='h-8 w-8 mr-2'/>{format(new Date(appointment.fec_inicio), 'HH:mm')} - {format(new Date(appointment.fec_termino), 'HH:mm')}</p>
								</div>
							</DialogDescription>
							<DialogFooter className="pt-4">
								<Button variant="outline" onClick={() => setAppointment(false)}>Volver</Button>
							</DialogFooter>
						</DialogHeader>
					</DialogContent>
				</Dialog> )}
			</div>
		</>
	);
}

function Patients({pacientesList, setPaciente, paciente}) {
	return (
		<>	
			<h1 className="text-2xl font-bold mb-4">Tus pacientes</h1>
			<div className='space-y-4'>
				{pacientesList.map((paciente) => (
					<Card key={paciente.id}>
						<CardContent className="flex items-center p-4">
							<div className="flex-grow">
								<h2 className="text-lg font-semibold">{paciente.nombre}</h2>
							</div>
							<Button onClick={() => setPaciente(paciente)} size="sm">
								<User className="h-4 w-4 mr-1" />
								Detalles
							</Button>
						</CardContent>
					</Card>
				))}
			{paciente && (
				<Dialog open onOpenChange={setPaciente}>
					<DialogContent className="pl-10">
						<DialogHeader>
							<DialogTitle className="pb-2">
								{paciente.nombre}
							</DialogTitle>
							<DialogDescription className="flex text-black">
								<div className='flex-1 mr-3'>
									<p className='font-bold'>{paciente.rut}</p>
									<p className='flex py-1'><Cake className='h-5 w-5 mr-2'/> {format(new Date(paciente.fec_nac), 'dd/MM/yyyy')} ({differenceInYears(new Date(), new Date(paciente.fec_nac))} años)</p>
									<p className='flex py-1'><MapPin className='h-5 w-5 mr-2'/>{paciente.direccion}</p>
									<p className='flex py-1'><div className='h-5 w-5 mr-2'></div>{paciente.comuna}</p>
									<p className='flex py-1'><Mail className='h-5 w-5 mr-2'/>{paciente.email}</p>
									<p className='flex py-1'><Phone className='h-5 w-5 mr-2'/>{paciente.telefono}</p>
								</div>
							</DialogDescription>
							<DialogFooter className="pt-4">
								<Button variant="outline" onClick={() => setPaciente(false)}>Volver</Button>
							</DialogFooter>
						</DialogHeader>
					</DialogContent>
				</Dialog> )}
			</div>
		</>
	);
}

export default function Dashboard() {
	const [userValid, setUserValid] = useState(false)

	const [activeComponent, setActiveComponent] = useState('calendar');
	const [citasList, setCitasList] = useState([]);
	const [pacientesList, setPacientesList] = useState([]);

	const [appointment, setAppointment] = useState(null);
	const [paciente, setPaciente] = useState(null);

	const [calendarLoading, setCalendarLoading] = useState(true);
	const [appointLoading, setAppointLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		const getUserType = async () => {
		  const response = await fetch("http://localhost:5000/get_credentials", {
			method: "GET", // Tipo de solicitud
			headers: {
			  "Content-Type": "application/json",
			},
			credentials: "include", // Esto asegura que las cookies se envíen con la solicitud
		  });
		
		  if (response.ok) {
			const data = await response.json();
			if (data.user_type === 2) { // cambiar despues si es que arreglamos la base
			  return setUserValid(true)
			}
			navigate("/");
		  } else {
			navigate("/");
		  }
		};
		getUserType()
	}, []);

	const handleLogout = async () => {
		try {
		  const response = await fetch("http://localhost:5000/logout", {
			method: "POST",
			credentials: "include"
		  })
		  
		  if (response.ok) {
			navigate("/")
		  } else {
			const result = await response.json()
			alert(result.message)
		  }
		} catch (error) {
		  alert("Error de conexión en el servidor:", error);
		}
	  }

	useEffect(() => {
		const fetchCitas = async () => {
			try {
				setCalendarLoading(true);
				setAppointLoading(true);
				const response = await fetch("http://localhost:5000/api/dashboard/get_appointments", {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					},
					credentials: "include",
				  });
				const data = await response.json();
				setCitasList(data);
				setAppointLoading(false);
				setCalendarLoading(false);
			} catch (error) {
				console.error("Error al obtener citas:", error);
			}
		};
		fetchCitas();

		const fetchPacientes = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/dashboard/get_patients", {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					},
					credentials: "include",
				  });
				const data = await response.json();
				setPacientesList(data);
			} catch (error) {
				console.error("Error al obtener citas:", error);
			}
		};
		fetchPacientes();
	}, []);

	const renderComponent = () => {
		switch (activeComponent) {
			case 'calendar':
				return (calendarLoading ? 
						(<Skeleton className="w-full h-full"/>) : 
						(<DashCalendar setActiveComponent={setActiveComponent} setAppointment={setAppointment} citasList={citasList}/>)
				)
			case 'appointments':
				return (appointLoading ?
					(<Skeleton className="w-full h-full"/>) : 
					(<Appointments setActiveComponent={setActiveComponent} pacientesList={pacientesList} citasList={citasList} setAppointment={setAppointment} appointment={appointment} setPaciente={setPaciente}/>)
				)
			case 'patients':
				return <Patients pacientesList={pacientesList} setPaciente={setPaciente} paciente={paciente}/>
			default:
				return <DashCalendar setActiveComponent={setActiveComponent} citasList={citasList}/>
		}
	}

	if(userValid) {
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
					<a className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer`}>
						<LogOut className="w-6 h-6 mr-3" />
						<Link to="/logout" onClick={handleLogout}>Cerrar sesión</Link>
					</a>
				</nav>
			</aside>
			<main className="col-start-2 col-span-3 p-4">
				{renderComponent()}
			</main>
			
		</div>
	);
	}
}
