export function Confetti() {
	return (
		<div className='confetti-wrapper'>
			{[...Array(1000)].map((_, i) => (
				<div key={i} className={`confetti-${i} z-0`} />
			))}
		</div>
	);
}
