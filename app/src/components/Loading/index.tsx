import { ClipLoader } from 'react-spinners';
import React from 'react';
import './style.css';

interface LoadingSpinnerProps {
	showLoading: boolean;
	message?: string;
}

const Loading: React.FC<LoadingSpinnerProps> = ({ showLoading, message = 'Securing your session...' }) => {
	if (!showLoading) return null;

	return (
		<div className="app-loading-overlay" role="status" aria-live="polite">
			<div className="app-loading-card">
				<ClipLoader size={28} color="var(--ion-color-primary)" speedMultiplier={0.9} />
				<p>{message}</p>
			</div>
		</div>
	);
};

export default Loading;
