import { IonContent, IonHeader, IonIcon, IonMenu, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import './style.css';
import Settings from './Settings';
import Modal from '../ui/Modal';
import { authStore } from '../../store/auth';
import { logOut, settings } from 'ionicons/icons';
import Title from '../ui/Title';
import { useIonRouter } from '@ionic/react';

const Menu: React.FC = () => {
	const { logOutUser } = authStore((store: any) => store);
	const [openSettings, setOpenSettings] = useState<boolean>(false);
	const router = useIonRouter();

	const handleLogout = () => {
		logOutUser();
		router.push('/login', 'forward', 'replace');
	};

	return (
		<>
			<IonMenu contentId="main-content" type="overlay">
				<IonHeader className="ion-no-border">
					<IonToolbar className="menu-header-toolbar">
						<Title title="Aura" className="menu-title" />
					</IonToolbar>
				</IonHeader>
				<IonContent className="menu-content">
					<nav className="menu-nav" aria-label="Account">
						<p className="menu-kicker">Workspace</p>
						<button type="button" className="menu-link" onClick={() => setOpenSettings(true)}>
							<IonIcon icon={settings} aria-hidden="true" />
							<span>Settings</span>
						</button>
						<button type="button" className="menu-link menu-link--quiet" onClick={handleLogout} >
							<IonIcon icon={logOut} aria-hidden="true" />
							<span>Sign out</span>
						</button>
					</nav>
				</IonContent>
			</IonMenu>
			<Modal
				isOpen={openSettings}
				onClose={setOpenSettings}
				title="Settings"
				closeModal={() => setOpenSettings(false)}
			>
				<Settings />
			</Modal>
		</>
	);
};

export default Menu;
