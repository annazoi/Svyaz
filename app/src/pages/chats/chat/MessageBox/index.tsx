import { IonAlert } from '@ionic/react';
import React, { useState } from 'react';
import { authStore } from '../../../../store/auth';
import { deleteMessage } from '../../../../services/chat';
import { useMutation } from '@tanstack/react-query';
import { useLongPress } from 'react-use';
import { motion } from 'framer-motion';
import './style.css';
import ImagePreviewLightbox from '../../../../components/ImagePreviewLightbox';
import userDefaultAvatar from '../../../../assets/user.png';

interface MessageConfig {
	message?: any;
	refetch?: any;
	chatId?: string;
}

const MessageBox: React.FC<MessageConfig> = ({ message, chatId }) => {
	const { userId } = authStore((store: any) => store);
	const [openOptions, setOpenOptions] = useState<boolean>(false);
	const [openImage, setOpenImage] = useState(false);

	const isMine = userId === message.senderId._id;

	const { mutate: mutateDeleteMessage } = useMutation({
		mutationFn: ({ chatId, messageId }: any) => deleteMessage(chatId, messageId),
	});

	const handleDeleteMessage = (messageId: string) => {
		mutateDeleteMessage({ chatId, messageId });
	};

	const longPressEvent = useLongPress(() => isMine && setOpenOptions(true), {
		isPreventDefault: true,
		delay: 500,
	});

	const formatTime = (dateStr: string) => {
		try {
			const date = new Date(dateStr);
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} catch (e) {
			return '';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
			className={`message-bubble-row ${isMine ? 'mine' : 'theirs'}`}
		>
			{!isMine && (
				<img src={message.senderId.avatar || userDefaultAvatar} className="message-avatar-small" alt="Avatar" />
			)}

			<div
				className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}
				{...(isMine ? longPressEvent : {})}
			>
				{message.message && <p className="message-text">{message.message}</p>}

				{message.image && (
					<motion.img
						whileHover={{ scale: 1.02 }}
						src={message.image}
						alt="Sent"
						className="message-image"
						role="button"
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							setOpenImage(true);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.stopPropagation();
								setOpenImage(true);
							}
						}}
					/>
				)}

				<div className="message-time">{formatTime(message.createdAt)}</div>
			</div>

			{message.image && (
				<ImagePreviewLightbox
					isOpen={openImage}
					imageSrc={message.image}
					onClose={() => setOpenImage(false)}
				/>
			)}

			<IonAlert
				isOpen={openOptions}
				header="Delete Message"
				message="Are you sure you want to delete this message for everyone?"
				buttons={[
					{ text: 'Cancel', role: 'cancel' },
					{
						text: 'Delete',
						role: 'destructive',
						handler: () => handleDeleteMessage(message._id),
					},
				]}
				onDidDismiss={() => setOpenOptions(false)}
			/>
		</motion.div>
	);
};

export default MessageBox;
