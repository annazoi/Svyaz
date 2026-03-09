import { IonButtons, IonContent, IonHeader, IonModal, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';
import Title from '../Title';
import './style.css';

interface ModalProps {
	isOpen: boolean;
	title?: string;
	onClose: (isOpen: boolean) => void;
	children?: React.ReactNode;
	closeModal?: () => void; // Keeping for compatibility with some files
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, closeModal }) => {
	const handleClose = () => {
		onClose(false);
		if (closeModal) closeModal();
	};

	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={handleClose}
			initialBreakpoint={0.85}
			breakpoints={[0, 0.85, 1]}
			handle={true}
			className="modern-modal"
			backdropBreakpoint={0.5}
		>
			<IonHeader className="ion-no-border">
				<IonToolbar className="modal-header-toolbar">
					{title && (
						<Title
							title={title}
							className="modal-title"
							style={{ color: 'var(--ion-text-color)', letterSpacing: '-0.5px' }}
						/>
					)}
					<IonButtons slot="end">
						<IonButton onClick={handleClose} className="modal-close-btn">
							<IonIcon
								icon={closeOutline}
								slot="icon-only"
								style={{
									color: 'var(--ion-color-reverse)',
								}}
							/>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			{children}
		</IonModal>
	);
};

export default Modal;
