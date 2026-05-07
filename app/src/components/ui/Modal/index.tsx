import { IonButtons, IonContent, IonHeader, IonModal, IonToolbar, IonButton, IonIcon, IonTitle } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useCallback, useRef } from 'react';
import { useIsDesktop } from '../../../hooks/useIsDesktop';
import './style.css';

const SHEET_BREAKPOINT = 0.88;

interface ModalProps {
	isOpen: boolean;
	title?: string;
	onClose: (isOpen: boolean) => void;
	children?: React.ReactNode;
	closeModal?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, closeModal }) => {
	const desktop = useIsDesktop();
	const modalRef = useRef<HTMLIonModalElement>(null);

	const handleClose = () => {
		onClose(false);
		closeModal?.();
	};

	const snapSheetOpen = useCallback(() => {
		requestAnimationFrame(() => {
			void modalRef.current?.setCurrentBreakpoint(SHEET_BREAKPOINT);
		});
	}, []);

	const sheetProps = desktop
		? {}
		: {
				initialBreakpoint: SHEET_BREAKPOINT,
				breakpoints: [0, SHEET_BREAKPOINT, 1] as number[],
				handle: true as const,
			};

	return (
		<IonModal
			ref={modalRef}
			isOpen={isOpen}
			onDidDismiss={handleClose}
			onDidPresent={desktop ? undefined : snapSheetOpen}
			className={`modern-modal ${desktop ? 'modern-modal-desktop' : 'modern-modal-sheet'}`}
			{...sheetProps}
		>
			<IonHeader className="ion-no-border">
				<IonToolbar className="modal-header-toolbar">
					{title && <IonTitle className="modal-title">{title}</IonTitle>}
					<IonButtons slot="end">
						<IonButton onClick={handleClose} className="modal-close-btn" fill="clear" aria-label="Close">
							<IonIcon icon={closeOutline} slot="icon-only" />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="modern-modal-content">{children}</IonContent>
		</IonModal>
	);
};

export default Modal;
