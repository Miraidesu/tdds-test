export default function ErrorMsg({children}) {
  return (
	<p className="text-xs font-semibold text-red-500">
		{children}
	</p>
	)
}