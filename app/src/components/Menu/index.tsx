import { IonButton, IonContent, IonHeader, IonIcon, IonMenu, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import './style.css';
import Settings from './Settings';
import Modal from '../ui/Modal';
import { authStore } from '../../store/auth';
import Button from '../ui/Button';
import { create, globe, logOut, settings, sync } from 'ionicons/icons';
import Title from '../ui/Title';

const Menu: React.FC = () => {
	const { logOutUser } = authStore((store: any) => store);
	const [openSettings, setOpenSettings] = useState<boolean>(false);

	// const router = useIonRouter();

	const handleLogout = () => {
		logOutUser();
	};
	return (
		<>
			<IonMenu contentId="main-content" type="overlay">
				<IonHeader className="ion-no-border">
					<IonToolbar className="menu-header-toolbar">
						<Title title="Aura" className="menu-title"></Title>
					</IonToolbar>
				</IonHeader>
				<IonContent className="menu-content">
					<div className="menu-section-label">General</div>
					<IonButton expand="block" fill="solid" className="menu-item-btn" onClick={() => setOpenSettings(true)}>
						<IonIcon icon={settings} slot="start" />
						Settings
					</IonButton>

					<IonButton
						expand="block"
						fill="solid"
						className="menu-item-btn btn-logout"
						onClick={handleLogout}
						routerLink="/login"
					>
						<IonIcon icon={logOut} slot="start" />
						Log Out
					</IonButton>
				</IonContent>
			</IonMenu>
			<Modal
				isOpen={openSettings}
				onClose={setOpenSettings}
				title="Settings"
				closeModal={() => {
					setOpenSettings(false);
				}}
			>
				<Settings />
			</Modal>
		</>
	);
};

export default Menu;
