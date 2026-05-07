import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import '../ui/Modal/style.css';
import { arrowBack, checkmark } from 'ionicons/icons';
import React, { useCallback, useRef } from 'react';
import { useIsDesktop } from '../../hooks/useIsDesktop';

const SHEET_BREAKPOINT = 0.88;

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	onClose: (isOpen: boolean) => void;
	onClick?: () => void;
	children?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, title, onClick, children }) => {
	const desktop = useIsDesktop();
	const modalRef = useRef<HTMLIonModalElement>(null);

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
			onDidDismiss={() => onClose(false)}
			onDidPresent={desktop ? undefined : snapSheetOpen}
			className={`modern-modal ${desktop ? 'modern-modal-desktop' : 'modern-modal-sheet'}`}
			{...sheetProps}
		>
			<IonHeader className="ion-no-border">
				<IonToolbar className="modal-header-toolbar">
					<IonButtons slot="start">
						<IonButton onClick={() => onClose(false)} className="modal-close-btn" fill="clear" aria-label="Back">
							<IonIcon icon={arrowBack} slot="icon-only" />
						</IonButton>
					</IonButtons>
					<IonTitle className="modal-title">{title}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={onClick} className="modal-confirm-btn" fill="clear" color="primary">
							<IonIcon icon={checkmark} slot="start" />
							Create
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="modern-modal-content">{children}</IonContent>
		</IonModal>
	);
};

export default ConfirmModal;
