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
	modalClassName?: string;
	contentClassName?: string;
	presentation?: 'auto' | 'dialog';
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	closeModal,
	modalClassName = '',
	contentClassName = '',
	presentation = 'auto',
}) => {
	const desktop = useIsDesktop();
	const modalRef = useRef<HTMLIonModalElement>(null);
	const useSheet = !desktop && presentation === 'auto';

	const handleClose = () => {
		onClose(false);
		closeModal?.();
	};

	const snapSheetOpen = useCallback(() => {
		requestAnimationFrame(() => {
			void modalRef.current?.setCurrentBreakpoint(SHEET_BREAKPOINT);
		});
	}, []);

	const sheetProps = useSheet
		? {
				initialBreakpoint: SHEET_BREAKPOINT,
				breakpoints: [0, SHEET_BREAKPOINT, 1] as number[],
				handle: true as const,
			}
		: {};

	return (
		<IonModal
			ref={modalRef}
			isOpen={isOpen}
			onDidDismiss={handleClose}
			onDidPresent={useSheet ? snapSheetOpen : undefined}
			className={`modern-modal ${useSheet ? 'modern-modal-sheet' : 'modern-modal-desktop'} ${modalClassName}`.trim()}
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
			<IonContent className={`modern-modal-content ${contentClassName}`.trim()}>{children}</IonContent>
		</IonModal>
	);
};

export default Modal;
