import { IonAlert, IonInput, useIonRouter } from '@ionic/react';
import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { createChat } from '../../../../services/chat';
import { authStore } from '../../../../store/auth';
import ConfirmModal from '../../../../components/ConfirmModal';
import ImagePicker from '../../../../components/ImagePicker';
import SearchUsers from '../../../../components/SearchUsers';
import '../style.css';
import Loading from '../../../../components/Loading';

interface GroupProps {
	closeModal: any;
	setOpenGroupModal: any;
	openGroupModal: any;
}

const CreateGroup: FC<GroupProps> = ({ closeModal, setOpenGroupModal, openGroupModal }) => {
	const { userId } = authStore((store: any) => store);
	const router = useIonRouter();
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [name, setName] = useState<string>('');
	const [avatar, setAvatar] = useState<string>('');
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const { mutate, isLoading } = useMutation({
		mutationFn: ({ name, type, avatar, members }: any) => createChat({ name, type, avatar, members }),
	});

	const handleImage = (avatar: string) => {
		setAvatar(avatar);
	};

	const createGroupChat = () => {
		if (selectedUsers.length > 1 && name.trim() !== '') {
			mutate(
				{ name, type: 'group', avatar, members: [...selectedUsers, userId] },
				{
					onSuccess: (res: any) => {
						setOpenGroupModal(false);
						closeModal();
						router.push(`/chat/${res.chat._id}`, 'forward');
					},
					onError: () => {
						setErrorMessage('Could not create group. Please try again.');
						setOpenAlert(true);
					},
				},
			);
		} else if (selectedUsers.length <= 1) {
			setErrorMessage('Please select at least 2 users to create a group chat.');
			setOpenAlert(true);
		} else if (name.trim() === '') {
			setErrorMessage('Please enter a group name.');
			setOpenAlert(true);
		}
	};

	const handleSelectUser = (e: any, userId: string) => {
		if (e.detail.checked) {
			setSelectedUsers([...selectedUsers, userId]);
		} else {
			setSelectedUsers(selectedUsers.filter((user) => user !== userId));
		}
	};

	return (
		<ConfirmModal
			isOpen={openGroupModal}
			onClose={() => setOpenGroupModal(false)}
			onClick={createGroupChat}
			title="New group"
		>
			<div className="new-chat-sheet group-modal-body">
				<div className="group-avatar-picker">
					<ImagePicker onChange={handleImage} value={avatar} text="Group photo" />
				</div>

				<Loading showLoading={isLoading} />

				<p className="modal-field-label">Details</p>
				<IonInput
					labelPlacement="floating"
					label="Name"
					placeholder="e.g. Project core"
					value={name}
					onIonChange={(e: any) => setName(e.detail.value)}
					className="group-input-container modern-input"
				/>

				<p className="modal-field-label spaced">Members</p>
				<SearchUsers
					type="group"
					placeholder="Search people"
					handleSelectUser={handleSelectUser}
					selectedUsers={selectedUsers}
				/>
			</div>

			<IonAlert
				isOpen={openAlert}
				message={errorMessage}
				buttons={['Close']}
				onDidDismiss={() => setOpenAlert(false)}
			/>
		</ConfirmModal>
	);
};

export default CreateGroup;
