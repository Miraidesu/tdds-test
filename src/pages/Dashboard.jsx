import { CalendarIcon, ClipboardListIcon, UsersIcon, SettingsIcon, LogOutIcon, UserIcon } from 'lucide-react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'	
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Dashboard() {
	const [eventSelected, setEventSelected] = useState(false)

	const handleClick = (info) => {
		setEventSelected(true)
		console.log(info.id)
	}
  return (
	<div className='grid grid-col-4'>
		<aside className="bg-white shadow-md">
			<div className="p-4">
			<h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
			</div>
			<nav className="mt-6">
			<a className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 cursor-pointer">
				<CalendarIcon className="w-5 h-5 mr-2" />
				Calendario
			</a>
			<a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">
				<ClipboardListIcon className="w-5 h-5 mr-2" />
				Citas
			</a>
			<a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">
				<UsersIcon className="w-5 h-5 mr-2" />
				Pacientes
			</a>
			</nav>
		</aside>

		<main className='col-start-2 col-span-3 p-4'>
			<FullCalendar
			height={'100vh'}
			plugins={[ dayGridPlugin, timeGridPlugin ]}
			initialView="timeGridWeek"
			headerToolbar={{
				right: 'timeGridDay,timeGridWeek,dayGridMonth prev,next',
				left: 'title',
			}}
			slotLabelFormat={
				{
					hour: 'numeric',
					minute: '2-digit',
					omitZeroMinute: true,
					meridiem: 'short'
				  }
			}
			locale={'es'}
			firstDay={1}
			buttonText={{
				today: 'Hoy',
				day: 'Día',
				month: 'Mes',
				week: 'Semana',
				prev: 'Anterior',
				next: 'Siguiente'
			}}
			eventMouseEnter={(e) => {e.el.style.cursor = "pointer"}}

			eventClick={
				(info) => {
					handleClick(info.event)
				}
			}
			events={
				[
					{id: 1, title: "Consulta", start: "2024-11-07T08:00:00", end: "2024-11-07T09:00:00"},
				]
			}/>

			{eventSelected && 
			<Dialog open onOpenChange={setEventSelected}>
				<DialogContent>
					<DialogHeader>
					<DialogTitle>ola</DialogTitle>
					<DialogDescription>
						text
					</DialogDescription>
					<DialogClose>
						<Button>Volver</Button>
					</DialogClose>
					</DialogHeader>
				</DialogContent>
			</Dialog>}
		</main>
	</div>
  )
}