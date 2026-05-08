import {
	IonButtons,
	IonContent,
	IonHeader,
	IonModal,
	IonToolbar,
	IonButton,
	IonIcon,
	IonTitle,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useIsDesktop } from '../../../hooks/useIsDesktop';
import '../Modal/style.css';
import './style.css';

interface SideOrModalProps {
	isOpen: boolean;
	title?: string;
	onClose: (open: boolean) => void;
	children?: React.ReactNode;
}

/** Desktop: right column · Mobile: full-screen modal */
const SideOrModal: React.FC<SideOrModalProps> = ({ isOpen, title, onClose, children }) => {
	const desk = useIsDesktop();
	const x = () => onClose(false);
	const [renderDesk, setRenderDesk] = useState(false);
	const [deskOpen, setDeskOpen] = useState(false);

	useEffect(() => {
		if (!desk) {
			setRenderDesk(false);
			setDeskOpen(false);
			return;
		}
		if (isOpen) {
			setRenderDesk(true);
			// Let the initial closed state paint first, then trigger the enter transition.
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setDeskOpen(true));
			});
			return;
		}
		if (renderDesk) {
			setDeskOpen(false);
			const t = setTimeout(() => setRenderDesk(false), 260);
			return () => clearTimeout(t);
		}
	}, [desk, isOpen, renderDesk]);

	const bar = (
		<IonHeader className="ion-no-border">
			<IonToolbar className="modal-header-toolbar">
				{title && <IonTitle className="modal-title">{title}</IonTitle>}
				<IonButtons slot="end">
					<IonButton onClick={x} fill="clear" className="modal-close-btn" aria-label="Close">
						<IonIcon icon={closeOutline} slot="icon-only" />
					</IonButton>
				</IonButtons>
			</IonToolbar>
		</IonHeader>
	);

	return (
		<>
			{desk && renderDesk && (
				<aside className={`side-or-desktop ${deskOpen ? 'open' : ''}`}>
					{bar}
					<div className="side-or-bd">{children}</div>
				</aside>
			)}
			{!desk && (
				<IonModal className="side-or-modal" isOpen={isOpen} onDidDismiss={x}>
					{bar}
					<IonContent className="modern-modal-content">{children}</IonContent>
				</IonModal>
			)}
		</>
	);
};

export default SideOrModal;
