import { CalendarIcon, ClipboardListIcon, UsersIcon, SettingsIcon, LogOutIcon, UserIcon } from 'lucide-react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'	

export default function Dashboard() {
  return (
	<div className='grid grid-col-4'>
		<aside className="bg-white shadow-md">
			<div className="p-4">
			<h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
			</div>
			<nav className="mt-6">
			<a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
				<CalendarIcon className="w-5 h-5 mr-2" />
				Calendario
			</a>
			<a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
				<ClipboardListIcon className="w-5 h-5 mr-2" />
				Citas
			</a>
			<a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
				<UsersIcon className="w-5 h-5 mr-2" />
				Pacientes
			</a>
			</nav>
		</aside>

		<main className='col-start-2 col-span-3 p-4'>
			<FullCalendar

			height={'100vh'}

			plugins={[ dayGridPlugin, timeGridPlugin ]}
			initialView="dayGridMonth"
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
			}}/>
		</main>
	</div>
  )
}