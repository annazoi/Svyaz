import {
	IonAvatar,
	IonButton,
	IonIcon,
	IonInput,
	IonItem,
	IonProgressBar,
	IonAlert,
	IonLabel,
	IonText,
	IonContent,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ImagePicker from '../ImagePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { updatedChat, addMembers, removeMember } from '../../services/chat';
import { chatSchema } from '../../validations-schemas/chat';
import { ChatConfig } from '../../validations-schemas/interfaces/chat';
import SearchUsers from '../SearchUsers';
import userDefaultAvatar from '../../assets/user.png';
import groupDefaultAvatar from '../../assets/group.png';
import { authStore } from '../../store/auth';
import { closeOutline, colorFill } from 'ionicons/icons';
import Title from '../ui/Title';
import './style.css';

interface ChatOptionsProps {
	closeModal: () => void;
	chat?: any;
	isLoading?: boolean;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ closeModal, chat, isLoading }) => {
	const { chatId } = useParams<{ chatId: string }>();
	const { userId } = authStore((store: any) => store);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [members, setMembers] = useState<any[]>([]);

	const { register, handleSubmit, setValue, getValues, reset } = useForm<ChatConfig>({
		resolver: yupResolver(chatSchema),
	});

	const { mutate: updatedMutate, isLoading: updatedIsLoading } = useMutation({
		mutationFn: (newData: any) => updatedChat(chatId, newData),
	});

	const { mutate: addMembersMutate } = useMutation({
		mutationFn: (members: string[]) => addMembers(chatId, members),
	});

	const { mutate: removeMemberMutate } = useMutation({
		mutationFn: (memberId: string) => removeMember(chatId, memberId),
	});

	// useEffect(() => {
	//   try {
	//     chat(chatId, {
	//       onSuccess: (data: any) => {
	//         setAvatar(data?.chat.avatar);
	//         setMembers(data?.chat.members);
	//         reset({
	//           avatar: avatar ? data?.chat.avatar : "",
	//           name: data?.chat.name,
	//         });
	//       },
	//     });
	//   } catch (error) {
	//     console.log("error", error);
	//   }
	// }, []);

	useEffect(() => {
		setMembers(chat?.members);
		reset({
			avatar: chat?.avatar ? chat?.avatar : '',
			name: chat?.name,
		});
	}, [chat]);

	const handleImage = (avatar: string) => {
		setValue('avatar', avatar);
	};

	const handleSelectUser = (e: any, userId: string) => {
		if (e.detail.checked) {
			setSelectedUsers([...selectedUsers, userId]);
		} else {
			setSelectedUsers(selectedUsers.filter((user) => user !== userId));
		}
	};

	const handleAddMembers = () => {
		if (selectedUsers.length === 0) return;
		try {
			addMembersMutate(selectedUsers, {
				onSuccess: (res: any) => {
					closeModal();
				},
			});
		} catch (error) {
			console.log('error', error);
		}
	};

	const handleRemoveMember = (chatId: string, memberId: string) => {
		try {
			removeMemberMutate(memberId, {
				onSuccess: (res: any) => {
					// closeModal();
				},
			});
		} catch (error) {
			console.log('error', error);
		}
	};

	const defaultAvatar = chat?.type === 'private' ? userDefaultAvatar : groupDefaultAvatar;

	const onSubmit = (data: any) => {
		try {
			updatedMutate(data, {
				onSuccess: (res: any) => {
					handleAddMembers();
					closeModal();
				},

				onError: (error: any) => {
					console.log('error', error);
				},
			});
		} catch (error) {
			console.log('error', error);
		}
	};

	return (
		<div className="chat-options-container">
			<div className="animate-in">
				{/* {!isLoading && <IonProgressBar type="indeterminate" style={{ marginBottom: '20px' }} />} */}

				<div className="chat-options-form-card">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
							<ImagePicker
								onChange={handleImage}
								register={register}
								value={getValues('avatar') || defaultAvatar}
							/>
						</div>

						<div style={{ padding: '0 16px 20px' }}>
							<IonInput
								labelPlacement="floating"
								label="Chat Name"
								className="modern-input"
								color="primary"
								{...register('name', { required: true })}
							/>

							<IonButton
								type="submit"
								expand="block"
								className="chat-options-submit-btn"
								disabled={updatedIsLoading}
							>
								{updatedIsLoading ? 'Updating...' : 'Update Chat Details'}
							</IonButton>
						</div>
					</form>
				</div>

				<div className="chat-members-section">
					<div className="menu-section-label">Members</div>
					<div className="chat-members-list">
						{chat?.members.map((member: any, index: any) => (
							<IonItem
								key={index}
								className="member-item"
								lines={index === chat.members.length - 1 ? 'none' : 'full'}
							>
								<IonAvatar slot="start" style={{ width: '40px', height: '40px', marginRight: '16px' }}>
									<img src={member.avatar ? member.avatar : userDefaultAvatar} alt="" />
								</IonAvatar>
								<IonLabel>
									<h2 style={{ fontWeight: '600' }}>{member.username}</h2>
									<p>{member.phone || 'No phone'}</p>
								</IonLabel>
								<IonButton
									fill="clear"
									slot="end"
									className="remove-member-btn"
									onClick={() => setOpenAlert(true)}
								>
									<IonIcon icon={closeOutline} />
								</IonButton>

								<IonAlert
									isOpen={openAlert}
									header="Remove Member"
									message={`Are you sure you want to remove ${member.username}?`}
									buttons={[
										{ text: 'Cancel', role: 'cancel' },
										{
											text: 'Remove',
											role: 'destructive',
											handler: () => handleRemoveMember(chatId, member._id),
										},
									]}
									onDidDismiss={() => setOpenAlert(false)}
								/>
							</IonItem>
						))}
					</div>
				</div>

				<div className="search-section-container">
					<div className="menu-section-label" style={{ marginLeft: '16px' }}>
						Add New Members
					</div>
					<SearchUsers
						placeholder="Search by username..."
						type="group"
						handleSelectUser={handleSelectUser}
						selectedUsers={selectedUsers}
						existingMembers={members}
					/>

					{selectedUsers.length > 0 && (
						<IonButton
							expand="block"
							color="success"
							className="chat-options-submit-btn"
							style={{ margin: '16px' }}
							onClick={handleAddMembers}
						>
							Add {selectedUsers.length} New {selectedUsers.length === 1 ? 'Member' : 'Members'}
						</IonButton>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatOptions;
