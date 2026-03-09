import { IonAvatar, IonCheckbox, IonImg, IonItem, IonLabel, IonSearchbar, IonText } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useEffect } from 'react';
import { getUsers } from '../../services/users';
import { authStore } from '../../store/auth';
import userDefaultAvatar from '../../assets/user.png';
import './style.css';

interface SearchUsersProps {
	onUsersFiltered?: (users: any[]) => void;
	placeholder: string;
	className?: string;
	type?: string;
	handleSelectUser?: (e: any, userId: string) => void;
	selectedUsers?: any[];
	existingMembers?: any[];
	style?: React.CSSProperties;
}

const SearchUsers: React.FC<SearchUsersProps> = ({
	placeholder,
	className,
	type,
	handleSelectUser,
	selectedUsers,
	existingMembers,
	onUsersFiltered,
	style,
}) => {
	const { userId } = authStore((store: any) => store);
	const [search, setSearch] = useState<string>('');

	const { data } = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	});

	const filteredUsers = useMemo(() => {
		if (!search.trim()) return [];
		const users = data?.users || [];
		return users.filter((user: any) => {
			const isNotMe = user._id !== userId;
			const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase());
			const notAlreadyMember = !existingMembers?.some((m: any) => m._id === user._id);
			return isNotMe && matchesSearch && notAlreadyMember;
		});
	}, [search, data, existingMembers, userId]);

	useEffect(() => {
		onUsersFiltered?.(filteredUsers);
	}, [filteredUsers, onUsersFiltered]);

	return (
		<div style={style} className={className}>
			<IonSearchbar
				onIonInput={(e) => setSearch(e.detail.value!)}
				value={search}
				debounce={500}
				onIonClear={() => setSearch('')}
				placeholder={placeholder}
				className="search-bar-modern"
				mode="ios"
				color="light"
			/>

			{type === 'group' && (
				<div className="search-results-list animate-in">
					{filteredUsers.length === 0 && search.trim() !== '' && (
						<div style={{ padding: '24px', textAlign: 'center', opacity: 0.6 }}>
							<IonText style={{ fontSize: '14px' }}>No users found for "{search}"</IonText>
						</div>
					)}

					{filteredUsers.map((user: any) => (
						<IonItem key={user._id} className="search-item" lines="full">
							<IonAvatar slot="start">
								<img src={user.avatar || userDefaultAvatar} alt={user.username} className="search-avatar" />
							</IonAvatar>
							<IonLabel>
								<h2 style={{ fontWeight: '600' }}>{user.username}</h2>
								<p style={{ fontSize: '12px' }}>{user.phone || 'No phone'}</p>
							</IonLabel>
							{handleSelectUser && (
								<IonCheckbox
									slot="end"
									className="search-checkbox"
									checked={selectedUsers?.includes(user._id)}
									onIonChange={(e) => handleSelectUser(e, user._id)}
								/>
							)}
						</IonItem>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchUsers;
