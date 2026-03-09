import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonFabList,
	IonHeader,
	IonIcon,
	IonPage,
	IonProgressBar,
	IonText,
	IonToolbar,
	useIonRouter,
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
	arrowBack,
	cameraOutline,
	imageOutline,
	call,
	videocam,
	trashBinOutline,
	peopleOutline,
	informationCircleOutline,
	send,
	ellipsisHorizontal,
} from 'ionicons/icons';
import { RiRobot2Line, RiMicLine, RiAddLine } from 'react-icons/ri';
import { getChat, sendMessage, deleteChat, readMessage } from '../../../services/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import { authStore } from '../../../store/auth';
import { useSocket } from '../../../hooks/sockets';
import MessageBox from './MessageBox';
import ringtonePlayer from '/ringtone.mp3';
import userDefaulfAvatar from '../../../assets/user.png';
import groupDefaulfAvatar from '../../../assets/group.png';
import { useWebRTC } from '../../../hooks/webrtc';
import Modal from '../../../components/ui/Modal';
import ChatOptions from '../../../components/ChatOptions';
import AiTools from './openAi';
import './style.css';

const Chat: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const { userId } = authStore((store: any) => store);
	const { socket } = useSocket();

	const [newMessage, setNewMessage] = useState<string>('');
	const [messages, setMessages] = useState<any[]>([]);
	const [openOptions, setOpenOptions] = useState<boolean>(false);
	const [openAiOptions, setOpenAiOptions] = useState<boolean>(false);
	const [chat, setChat] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [image, setImage] = useState<string>('');
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingOlder, setIsLoadingOlder] = useState(false);

	const router = useIonRouter();
	const contentRef = useRef<HTMLIonContentElement>(null);

	const remoteUserId = chat?.members?.find((member: any) => member._id !== userId)?._id ?? '';

	const {
		callType,
		inCall,
		incomingCall,
		localVideoRef,
		remoteVideoRef,
		localAudioRef,
		remoteAudioRef,
		startCall,
		acceptCall,
		rejectCall,
		endCall,
		flipCamera,
	} = useWebRTC({
		socket,
		roomId: chatId!,
		localUserId: userId,
		remoteUserId,
		ringtoneSrc: ringtonePlayer,
	});

	// const queryClient = useQueryClient();

	const { mutate: readMessageMutate } = useMutation({
		mutationFn: ({ chatId, messageId }: any) => readMessage(chatId, messageId),
		onSuccess: () => {
			// queryClient.invalidateQueries(['chats']);
		},
	});

	const { mutate: deleteChatMutate } = useMutation({
		mutationFn: (chatId: any) => deleteChat(chatId),
		onSuccess: () => {
			console.log('Chat has deleted!');
		},
	});

	const startAudioCall = () => startCall('audio');
	const startVideoCall = () => startCall('video');

	const { mutate: mutateChat } = useMutation({
		mutationFn: ({ chatId, page = 1 }: any) => getChat(chatId, page),
		onSuccess: (res: any, variables: any) => {
			const requestedPage = variables?.page ?? 1;
			setChat(res?.chat);
			if (requestedPage === 1) {
				setMessages(res?.chat?.messages || []);
				setTimeout(() => contentRef.current?.scrollToBottom(300), 100);
			} else {
				setMessages((prev) => [...(res?.chat?.messages || []), ...prev]);
			}
			setHasMore(Boolean(res.hasMore));

			if (res?.chat?.messages?.length > 0) {
				const lastMsg = res.chat.messages[res.chat.messages.length - 1];
				if (lastMsg && lastMsg.senderId?._id !== userId && !lastMsg.read) {
					readMessageMutate({ chatId, messageId: lastMsg._id });
				}
			}

			setIsLoading(false);
			setIsLoadingOlder(false);
		},
		onError: () => {
			setIsLoading(false);
			setIsLoadingOlder(false);
		},
	});

	const { mutate: mutateSendMessage, isLoading: messageIsLoading } = useMutation({
		mutationFn: (args: any) => sendMessage(args),
		onSuccess: (res: any) => {
			const messageData = { ...res.chat.messages[res.chat.messages.length - 1], room: chatId };
			socket?.emit('send_message', messageData);
			setMessages((prev) => [...prev, messageData]);
			setNewMessage('');
			setImage('');
			setTimeout(() => contentRef.current?.scrollToBottom(300), 50);
		},
	});

	const handleNewMessage = () => {
		if (newMessage.trim() === '' && !image) return;
		mutateSendMessage({ chatId, newMessage, image });
	};

	const handleScroll = async (e: any) => {
		if (e.detail.scrollTop < 100 && hasMore && !isLoadingOlder) {
			const nextPage = page + 1;
			setIsLoadingOlder(true);
			mutateChat({ chatId, page: nextPage });
			setPage(nextPage);
		}
	};

	const handleGallery = async () => {
		const photo = await Camera.getPhoto({
			quality: 90,
			resultType: CameraResultType.DataUrl,
			source: CameraSource.Photos,
		});
		if (photo.dataUrl) setImage(photo.dataUrl);
	};

	const handleCamera = async () => {
		const photo = await Camera.getPhoto({
			quality: 90,
			resultType: CameraResultType.DataUrl,
			source: CameraSource.Camera,
		});
		if (photo.dataUrl) setImage(photo.dataUrl);
	};

	const handleDeletedChat = (chatId: any) => {
		deleteChat(chatId);
		router.push('/inbox', 'forward', 'replace');
	};

	useEffect(() => {
		if (!socket || !chatId) return;
		socket.emit('join_room', chatId);
		const handleReceive = (msg: any) => {
			setMessages((prev) => [...prev, msg]);
			if (msg.senderId._id !== userId) {
				readMessageMutate({ chatId, messageId: msg._id });
			}
		};
		socket.on('receive_message', handleReceive);
		return () => {
			socket.off('receive_message', handleReceive);
		};
	}, [socket, chatId, userId]);

	useEffect(() => {
		setIsLoading(true);
		mutateChat({ chatId, page: 1 });
	}, [chatId]);

	const otherMember = chat?.members?.find((m: any) => m._id !== userId);
	const chatName = chat?.type === 'private' ? otherMember?.username : chat?.name;
	const chatAvatar = chat?.type === 'private' ? otherMember?.avatar : chat?.avatar;
	const defaultAvatar = chat?.type === 'private' ? userDefaulfAvatar : groupDefaulfAvatar;

	return (
		<IonPage>
			<IonHeader className="chat-header ion-no-border bg-modern">
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/inbox" icon={arrowBack} text="" />
					</IonButtons>
					{chat && (
						<div className="chat-header-container">
							<img src={chatAvatar || defaultAvatar} alt="Avatar" className="chat-header-avatar" />
							<div className="chat-header-info">
								<IonText className="chat-header-name">{chatName}</IonText>
								<IonText className="chat-header-status">online</IonText>
							</div>
						</div>
					)}
					<IonButtons slot="end">
						<IonButton onClick={() => setOpenAiOptions(true)}>
							<RiRobot2Line size={22} style={{ color: 'var(--ion-color-reverse)', opacity: 0.9 }} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			{isLoading && <IonProgressBar type="indeterminate" />}

			<IonContent ref={contentRef} scrollEvents={true} onIonScroll={handleScroll} className="chat-content">
				<div className="message-list-container">
					{messages?.map((msg: any, i: number) => (
						<MessageBox key={msg._id || i} message={msg} chatId={chatId} />
					))}
				</div>
			</IonContent>

			{/* Custom Input Bar */}
			<div className="chat-input-toolbar">
				{image && (
					<div style={{ position: 'relative', marginBottom: '8px', width: '80px' }}>
						<img src={image} style={{ width: '80px', borderRadius: '12px' }} alt="Pending" />
						<IonButton
							size="small"
							color="danger"
							fill="clear"
							onClick={() => setImage('')}
							style={{ position: 'absolute', top: '-10px', right: '-10px' }}
						>
							<IonIcon icon={trashBinOutline} />
						</IonButton>
					</div>
				)}
				<div className="chat-input-container">
					<IonButton className="input-action-btn" fill="clear" onClick={handleGallery} color="primary">
						<RiAddLine size={24} />
					</IonButton>
					<input
						className="message-input"
						placeholder="Start typing..."
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleNewMessage()}
					/>
					{newMessage.trim() === '' && !image ? (
						<IonButton className="input-action-btn" fill="clear" onClick={handleCamera} color="primary">
							<IonIcon icon={cameraOutline} />
						</IonButton>
					) : (
						<IonButton className="send-btn" disabled={messageIsLoading} onClick={handleNewMessage}>
							<IonIcon icon={messageIsLoading ? ellipsisHorizontal : send} />
						</IonButton>
					)}
				</div>
			</div>

			{/* Floating Actions */}
			<IonFab slot="fixed" vertical="bottom" horizontal="end" className="chat-fab-group">
				<IonFabButton size="small" color="primary">
					<IonIcon icon={ellipsisHorizontal} />
				</IonFabButton>
				<IonFabList side="top">
					<IonFabButton
						onClick={() => (chat?.type === 'group' ? setOpenOptions(true) : handleDeletedChat(chatId))}
						color="primary"
					>
						<IonIcon icon={chat?.type === 'group' ? informationCircleOutline : trashBinOutline} />
					</IonFabButton>
					{chat?.type === 'group' && (
						<IonFabButton onClick={() => setOpenOptions(true)} color="primary">
							<IonIcon icon={peopleOutline} />
						</IonFabButton>
					)}
					<IonFabButton onClick={() => startVideoCall()} className="call-fab" color="primary">
						<IonIcon icon={videocam} style={{ color: 'white' }} />
					</IonFabButton>
					<IonFabButton onClick={() => startAudioCall()} className="call-fab" color="primary">
						<IonIcon icon={call} style={{ color: 'white' }} />
					</IonFabButton>
				</IonFabList>
			</IonFab>

			{/* Call UI - Overhauled Overlay */}
			{(incomingCall || inCall) && (
				<div className="call-overlay">
					<div className="call-header">
						<img src={chatAvatar || defaultAvatar} className="call-avatar-large" alt="User" />
						<div className="call-user-name">{chatName}</div>
						<div className="call-status-text">
							{incomingCall
								? 'Incoming call...'
								: inCall && callType === 'video'
									? 'Video call active'
									: 'Audio call active'}
						</div>
					</div>

					{inCall && callType === 'video' && (
						<div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
							<video ref={remoteVideoRef} autoPlay playsInline className="video-view-remote" />
							<video ref={localVideoRef} autoPlay muted playsInline className="video-view-local" />
						</div>
					)}

					<div className="call-actions-row">
						{incomingCall ? (
							<>
								<IonButton onClick={acceptCall} color="success" className="call-btn-circle">
									<IonIcon icon={call} />
								</IonButton>
								<IonButton onClick={rejectCall} color="danger" className="call-btn-circle">
									<IonIcon icon={trashBinOutline} />
								</IonButton>
							</>
						) : (
							<>
								{callType === 'video' && (
									<IonButton onClick={flipCamera} color="light" className="call-btn-circle">
										<IonIcon icon={cameraOutline} />
									</IonButton>
								)}
								<IonButton onClick={() => endCall(true)} color="danger" className="call-btn-circle">
									<IonIcon icon={call} style={{ transform: 'rotate(135deg)' }} />
								</IonButton>
							</>
						)}
					</div>
				</div>
			)}

			<Modal isOpen={openAiOptions} onClose={setOpenAiOptions} title="AI Tools">
				<AiTools chatId={chatId} />
			</Modal>

			<Modal isOpen={openOptions} onClose={setOpenOptions} title="Chat Details">
				<ChatOptions chat={chat} isLoading={isLoading} closeModal={() => setOpenOptions(false)} />
			</Modal>
		</IonPage>
	);
};

export default Chat;
