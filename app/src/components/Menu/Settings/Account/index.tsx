import { IonButton, IonCard, IonCardContent, IonContent, IonInput, IonItem, IonText } from '@ionic/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getUser, updateUser } from '../../../../services/users';
import { authStore } from '../../../../store/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorFill, logIn } from 'ionicons/icons';
import { get, set, useForm } from 'react-hook-form';
import ImagePicker from '../../../../components/ImagePicker';
import Loading from '../../../../components/Loading';
import Toast from '../../../../components/ui/Toast';
import { registerSchema } from '../../../../validations-schemas/auth';
import { RegisterConfig } from '../../../../validations-schemas/interfaces/user';
import { useEffect } from 'react';
import userDefaultAvatar from '../../../../assets/user.png';
import Input from '../../../ui/Input';
import HidePassword from '../../../HidePassword';
import './style.css';

const Settings: React.FC = () => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors },
	} = useForm<RegisterConfig>({
		resolver: yupResolver(registerSchema),
	});

	const { userId, updateUser: updateStoreUser, avatar: storeAvatar } = authStore((store: any) => store);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [message, setMessage] = useState<any>('');
	const [useAvatar, setUseAvatar] = useState<string>('');

	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: () => getUser(userId),
	});

	const { mutate, isLoading, isError } = useMutation({
		mutationKey: ['updateUser'],
		mutationFn: (newData: any) => updateUser(userId, newData),
	});

	const handleImage = (avatar: string) => {
		setValue('avatar', avatar);
	};

	useEffect(() => {
		if (user) {
			reset(user?.user);
		}
	}, [user]);

	const onSubmit = (data: RegisterConfig) => {
		try {
			mutate(data, {
				onSuccess: (data: any) => {
					updateStoreUser({
						avatar: data?.user.avatar,
						username: data?.user.username,
					});
					setMessage('Form submitted successfully!');
					setShowToast(true);
				},
				onError: (error) => {
					setMessage('Could not create user. The username already exists.');
					setShowToast(true);
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<IonContent className="account-container">
			<div className="animate-in">
				<div className="account-form-card">
					<IonCardContent>
						<Loading showLoading={isLoading} />
						<form onSubmit={handleSubmit(onSubmit)}>
							<Input
								label="Username"
								register={register('username')}
								className="account-input modern-input"
								placeholder="What's your new username?"
							/>
							{errors.username && <div className="field-error">{errors.username.message}</div>}

							<Input
								label="Phone Number"
								register={register('phone')}
								className="account-input modern-input"
								placeholder="+1 234 567 890"
							/>
							{errors.phone && <div className="field-error">{errors.phone.message}</div>}

							<div style={{ marginTop: '16px' }}>
								<HidePassword register={register} />
							</div>
							{errors.password && <div className="field-error">{errors.password.message}</div>}

							<IonText className="account-avatar-picker-title">Update Profile Picture</IonText>

							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<ImagePicker
									onChange={handleImage}
									register={register}
									value={storeAvatar ? getValues('avatar') : userDefaultAvatar}
								/>
							</div>

							<IonButton
								type="submit"
								className="account-submit-btn"
								expand="block"
								disabled={isLoading}
								color="primary"
							>
								{isLoading ? 'Saving Changes...' : 'Save Changes'}
							</IonButton>
						</form>
					</IonCardContent>
				</div>
			</div>
			<Toast showToast={showToast} message={message} setShowToast={setShowToast} isError={isError} />
		</IonContent>
	);
};

export default Settings;
