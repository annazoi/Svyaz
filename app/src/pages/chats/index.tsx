import {
	IonButton,
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonMenuToggle,
	IonPage,
	IonProgressBar,
	IonText,
	IonToolbar,
	useIonRouter,
} from '@ionic/react';
import { authStore } from '../../store/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { addOutline, moon, sync, sunny } from 'ionicons/icons';
import { getChats } from '../../services/chat';
import React from 'react';
import CreateChat from './CreateChat';
import Modal from '../../components/ui/Modal';
import { useSocket } from '../../hooks/sockets';
import userDefaulfAvatar from '../../assets/user.png';
import groupDefaulfAvatar from '../../assets/group.png';
import { useNotifications } from '../../hooks/notifications';
import './style.css';

const Chats: React.FC = () => {
	useNotifications();
	const { socket } = useSocket();
	const router = useIonRouter();
	const { avatar, userId } = authStore((store: any) => store);
	const [openCreateChat, setOpenCreateChat] = useState<boolean>(false);

	const getInitialTheme = () => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) return savedTheme;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};
	const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

	const toggleTheme = () => {
		const newDark = !isDark;
		setIsDark(newDark);
		if (newDark) {
			document.body.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.body.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	const { data, isLoading, refetch } = useQuery<any>({
		queryKey: ['chats'],
		queryFn: getChats,
		refetchOnMount: 'always',
		// refetchInterval: 1000,
	});

	const handleLastMessage = (chat: any) => {
		const lastMessage = chat?.messages[chat.messages.length - 1];
		if (!lastMessage) return 'Say hello! 👋';
		const prefix =
			lastMessage.senderId._id === userId
				? 'You: '
				: chat.type === 'group'
					? `${lastMessage.senderId.username}: `
					: '';
		return `${prefix}${lastMessage.message}`;
	};

	const getUnreadCount = () => {
		return (
			data?.reduce((acc: number, chat: any) => {
				const last = chat.messages[chat.messages.length - 1];
				if (last && !last.read && last.senderId?._id !== userId) return acc + 1;
				return acc;
			}, 0) || 0
		);
	};

	const getTime = (chat: any) => {
		const last = chat.messages[chat.messages.length - 1];
		if (!last) return '';
		const date = new Date(last.createdAt);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<IonPage id="main-content">
			<IonHeader className="chats-header ion-no-border bg-modern">
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuToggle>
							<img src={avatar || userDefaulfAvatar} alt="Profile" className="profile-trigger" />
						</IonMenuToggle>
					</IonButtons>
					<IonText className="inbox-title">Inbox</IonText>
					<IonButtons slot="end">
						<IonButton onClick={toggleTheme} className="ion-margin-end">
							<IonIcon icon={isDark ? sunny : moon} />
						</IonButton>
						<IonButton onClick={() => window.location.reload()}>
							<IonIcon icon={sync} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			{isLoading && <IonProgressBar type="indeterminate"></IonProgressBar>}

			<IonContent className="ion-padding-bottom">
				<div className="animate-in">
					{getUnreadCount() > 0 && (
						<div className="unread-badge-container">
							<div className="unread-badge">
								{getUnreadCount()} Unread {getUnreadCount() === 1 ? 'Message' : 'Messages'}
							</div>
						</div>
					)}

					{data?.length === 0 ? (
						<div className="empty-state">
							<IonText>
								<h3>No conversations yet</h3>
								<p color="medium">Start chatting with your friends</p>
							</IonText>
						</div>
					) : (
						<div className="chat-list-container">
							{data?.map((chat: any) => {
								const isUnread =
									chat.messages[chat.messages.length - 1]?.read === false &&
									userId !== chat.messages[chat.messages.length - 1]?.senderId._id;
								const otherMember = chat.members.find((m: any) => m._id !== userId);
								const chatName = chat.type === 'private' ? otherMember?.username : chat.name;
								const chatAvatar = chat.type === 'private' ? otherMember?.avatar : chat.avatar;
								const defaultAvatar = chat.type === 'private' ? userDefaulfAvatar : groupDefaulfAvatar;

								return (
									<div
										key={chat._id}
										className={`chat-item-content ${isUnread ? 'is-unread' : ''}`}
										onClick={() => router.push(`/chat/${chat._id}`, 'forward')}
										style={{ cursor: 'pointer' }}
									>
										<div className="chat-avatar-container">
											<img src={chatAvatar || defaultAvatar} alt={chatName} className="chat-avatar" />
											{/* Simplified online indicator - could be dynamic later */}
											{chat.type === 'private' && <div className="online-indicator"></div>}
										</div>
										<div className="chat-info">
											<div className="chat-name-row">
												<IonText className="chat-name">{chatName}</IonText>
											</div>
											<div className="chat-message-row">
												<IonText className="chat-last-message">{handleLastMessage(chat)}</IonText>
												{isUnread && <div className="unread-dot"></div>}
											</div>
										</div>
										<div className="chat-time">
											<IonText className="chat-time">{getTime(chat)}</IonText>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<IonFab slot="fixed" vertical="bottom" horizontal="end">
					<IonFabButton className="create-chat-fab" onClick={() => setOpenCreateChat(true)}>
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>

			<Modal
				isOpen={openCreateChat}
				onClose={setOpenCreateChat}
				title="Create New Chat"
				closeModal={() => setOpenCreateChat(false)}
			>
				<CreateChat closeModal={() => setOpenCreateChat(false)} refetch={refetch} />
			</Modal>
		</IonPage>
	);
};

export default Chats;
