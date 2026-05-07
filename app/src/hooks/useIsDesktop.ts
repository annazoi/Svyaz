import { useEffect, useState } from 'react';

/** minWidth matches CSS desktop breakpoint for modals */
export function useIsDesktop(minWidth = 768) {
	const [matches, setMatches] = useState(() =>
		typeof window !== 'undefined' ? window.matchMedia(`(min-width: ${minWidth}px)`).matches : false,
	);

	useEffect(() => {
		const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
		const sync = () => setMatches(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, [minWidth]);

	return matches;
}
