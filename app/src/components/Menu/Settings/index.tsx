import { IonContent, IonIcon, IonItem, IonToggle, IonText, IonLabel } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { authStore } from '../../../store/auth';
import { settings, sunny } from 'ionicons/icons';
import userDefaulfAvatar from '../../../assets/user.png';
import './style.css';
import Modal from '../../../components/ui/Modal';
import Account from './Account';

const Settings: React.FC = () => {
	const { avatar, username } = authStore((store: any) => store);

	const [openAccount, setOpenAccount] = useState<boolean>(false);
	const getInitialTheme = () => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) return savedTheme === 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	};

	const [themeToggle, setThemeToggle] = useState(getInitialTheme());

	const toggleDarkTheme = (isDark: boolean) => {
		setThemeToggle(isDark);
		if (isDark) {
			document.body.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.body.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	useEffect(() => {
		// Sync local state with actual body class in case it was changed elsewhere (like in Inbox)
		const isCurrentlyDark = document.body.classList.contains('dark');
		setThemeToggle(isCurrentlyDark);
	}, [openAccount]); // Re-sync when returning from account settings

	return (
		<IonContent className="settings-content">
			<div className="animate-in settings-shell">
				{/* Profile Header */}
				<div className="settings-profile-card">
					<img src={avatar ? avatar : userDefaulfAvatar} className="settings-avatar-large" alt="Profile" />
					<div className="settings-username">{username}</div>
					<IonText color="medium" className="settings-subtitle">
						Active Account
					</IonText>
				</div>

				
				<div className="menu-section-label">Preferences</div>
				<div className="settings-list-card">
					<IonItem lines="full" className="settings-item settings-toggle-item">
						<div
							slot="start"
							className="settings-icon-box"
							style={{ background: 'rgba(255, 192, 0, 0.1)', color: '#ffca22' }}
						>
							<IonIcon icon={sunny} />
						</div>
						<IonLabel>Dark Mode</IonLabel>
						<IonToggle
							slot="end"
							checked={themeToggle}
							onIonChange={(e) => toggleDarkTheme(e.detail.checked)}
							color="primary"
						/>
					</IonItem>
				</div>

				<div className="menu-section-label">Account</div>
				<div className="settings-list-card">
					<IonItem
						button
						detail={true}
						onClick={() => setOpenAccount(true)}
						className="settings-item"
						lines="none"
					>
						<div slot="start" className="settings-icon-box">
							<IonIcon icon={settings} />
						</div>
						<IonLabel>
							<h2>Account Settings</h2>
							<p>Username, Phone, Password</p>
						</IonLabel>
					</IonItem>
				</div>
			</div>

			<Modal isOpen={openAccount} onClose={setOpenAccount} title="Update Profile">
				<Account />
			</Modal>
		</IonContent>
	);
};

export default Settings;
