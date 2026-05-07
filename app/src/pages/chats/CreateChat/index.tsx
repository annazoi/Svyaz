import { useMutation } from '@tanstack/react-query';
import { IonAvatar, IonButton, IonIcon, IonImg, useIonRouter } from '@ionic/react';
import { addOutline, chevronForwardOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { authStore } from '../../../store/auth';
import { createChat } from '../../../services/chat';
import CreateGroup from './CreateGroup';
import SearchUsers from '../../../components/SearchUsers';
import userDefaultAvatar from '../../../assets/user.png';
import './style.css';

interface UsersProps {
	closeModal: any;
	refetch?: any;
}

const CreateChat: React.FC<UsersProps> = ({ closeModal, refetch }) => {
	const { userId } = authStore((store: any) => store);
	const [openGroupModal, setOpenGroupModal] = useState<boolean>(false);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const router = useIonRouter();

	const { mutate } = useMutation({
		mutationFn: ({ name, type, avatar, members }: any) => createChat({ name, type, avatar, members }),
	});

	const createPrivateChat = (memberId: string) => {
		mutate(
			{ type: 'private', members: [userId, memberId] },
			{
				onSuccess: (res: any) => {
					router.push(`/chat/${res.chat._id}`, 'forward');
					refetch?.();
					closeModal();
				},
			},
		);
	};

	return (
		<>
			<div className="new-chat-sheet">
				<IonButton
					expand="block"
					fill="outline"
					onClick={() => setOpenGroupModal(true)}
					className="new-chat-group-btn"
					color="primary"
				>
					<IonIcon icon={addOutline} slot="start" />
					New group
				</IonButton>

				<p className="new-chat-label">Find someone</p>

				<SearchUsers
					type="private"
					onUsersFiltered={(users) => setFilteredUsers(users)}
					onQueryChange={setSearchQuery}
					placeholder="Search by username"
				/>

				<ul className="new-chat-results" aria-live="polite">
					{filteredUsers?.map((user: any) =>
						userId !== user._id ? (
							<li key={user._id}>
								<button
									type="button"
									className="new-chat-peer"
									onClick={() => createPrivateChat(user._id)}
								>
									<IonAvatar className="new-chat-peer__avatar">
										<IonImg src={user.avatar || userDefaultAvatar} alt="" />
									</IonAvatar>
									<span className="new-chat-peer__meta">
										<span className="new-chat-peer__name">{user.username}</span>
										<span className="new-chat-peer__hint">Direct message</span>
									</span>
									<IonIcon icon={chevronForwardOutline} className="new-chat-peer__chev" aria-hidden />
								</button>
							</li>
						) : null,
					)}
				</ul>

				{searchQuery.trim() === '' ? (
					<p className="new-chat-hint">Type a username to search.</p>
				) : (
					filteredUsers?.length === 0 && <p className="new-chat-hint">No matching people.</p>
				)}
			</div>

			<CreateGroup
				closeModal={closeModal}
				setOpenGroupModal={() => setOpenGroupModal(false)}
				openGroupModal={openGroupModal}
			/>
		</>
	);
};

export default CreateChat;
