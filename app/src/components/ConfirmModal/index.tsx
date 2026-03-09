import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import './style.css';
import { addOutline, arrowBack } from 'ionicons/icons';
import Button from '../ui/Button';
import Title from '../ui/Title';

interface ConfirmModalProps {
	isOpen: any;
	title: string;
	onClose: any;
	onClick?: any;
	children?: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, title, onClick, children }) => {
	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={() => onClose(false)}
			initialBreakpoint={0.85}
			breakpoints={[0, 0.85, 1]}
			handle={true}
			className="modern-modal"
		>
			<IonHeader className="ion-no-border">
				<IonToolbar className="modal-header-toolbar">
					<IonButtons slot="start">
						<IonButton onClick={() => onClose(false)} className="modal-close-btn">
							<IonIcon
								icon={arrowBack}
								style={{
									color: 'var(--ion-color-reverse)',
								}}
							/>
						</IonButton>
					</IonButtons>
					<Title
						title={title}
						className="modal-title"
						style={{ color: 'var(--ion-text-color)', letterSpacing: '-0.5px' }}
					/>
					<IonButtons slot="end">
						<IonButton onClick={onClick} color="primary" style={{ fontWeight: '700' }}>
							<IonIcon icon={addOutline} slot="start" />
							Create
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			{children}
		</IonModal>
	);
};

export default ConfirmModal;
