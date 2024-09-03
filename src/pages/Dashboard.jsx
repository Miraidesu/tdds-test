import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export default function Dashboard() {
  return (
    <FullCalendar
	plugins={[ dayGridPlugin ]}
	initialView="dayGridMonth"
	headerToolbar={{
		right: 'prev,next',
		center: 'title',
		left: 'dayGridMonth,dayGridWeek,dayGridDay' // user can switch between the two
	}}
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

	/>
  )
}