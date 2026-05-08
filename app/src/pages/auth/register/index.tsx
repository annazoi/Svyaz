import {
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonPage,
	IonText,
	useIonRouter,
} from '@ionic/react';
import '../login/style.css';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../../validations-schemas/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../../services/auth';
import { RegisterConfig } from '../../../validations-schemas/interfaces/user';
import ImagePicker from '../../../components/ImagePicker';
import { authStore } from '../../../store/auth';
import Toast from '../../../components/ui/Toast';
import HidePassword from '../../../components/HidePassword';
import Input from '../../../components/ui/Input';
import Loading from '../../../components/Loading';

const Register: React.FC = () => {
	const { logIn } = authStore((store: any) => store);
	const router = useIonRouter();

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<RegisterConfig>({
		defaultValues: {
			phone: '',
			username: '',
			password: '',
			avatar: '',
		},
		resolver: yupResolver(registerSchema),
	});

	const { mutate, isLoading, isError } = useMutation({
		mutationFn: registerUser,
	});

	const handleImage = (avatar: string) => {
		setValue('avatar', avatar);
	};

	const onSubmit = async (data: any) => {
		mutate(data, {
			onSuccess: (data: any) => {
				const avatar = data.avatar === undefined || data.avatar === ' ' ? '' : data.avatar;
				logIn({
					token: data.token,
					userId: data.userId,
					avatar: avatar,
					username: data.username,
				});
				setToastMessage('Account created successfully!');
				setShowToast(true);
				router.push('/inbox', 'forward', 'replace');
				setTimeout(() => window.location.reload(), 100);
			},
			onError: () => {
				setToastMessage('Could not create account. Username might be taken.');
				setShowToast(true);
			},
		});
	};

	return (
		<IonPage className="auth-page">
			<IonContent className="ion-padding modern-container">
				<div className="animate-in auth-shell">
					<div className="auth-brand-panel">
						<div className="auth-logo-container auth-logo-container--minimal">
							<img src="/logo.png" alt="Svyaz logo" className="auth-logo-image" />
							<span className="auth-tagline">Private messaging</span>
							<span className="auth-wordmark">Svyaz</span>
							<p className="auth-brand-intro">A calm, private space for your daily conversations.</p>
						</div>
					</div>

					<div className="auth-form-panel">
						<div className="auth-mobile-brand">
							<img src="/logo.png" alt="Svyaz" className="auth-mobile-brand-logo" />
						</div>
						<div className="auth-mobile-info">
							<h2>Create account</h2>
							<p>Join and start your private conversations in seconds.</p>
						</div>
						<div className="auth-header-text auth-header-text--form">
							<IonText>
								<h1>Create account</h1>
							</IonText>
							<IonText color="medium">
								<p>Register with a unique name and secure password. Your threads stay private to you.</p>
							</IonText>
						</div>
						<IonCard className="auth-card glass-effect">
							<IonCardContent className="auth-form-container">
								<form onSubmit={handleSubmit(onSubmit)}>
									<Input
										label="Username"
										register={register('username')}
										className="modern-input"
										placeholder="Distinctive, memorable"
									/>
									{errors.username && <div className="field-error">{errors.username.message}</div>}

									<Input
										label="Phone"
										register={register('phone')}
										className="modern-input"
										placeholder="+1 ··· ··· ····"
									/>
									{errors.phone && <div className="field-error">{errors.phone.message}</div>}

									<HidePassword register={register} />
									{errors.password && <div className="field-error">{errors.password.message}</div>}

									<div className="auth-avatar-section">
										<IonText className="auth-avatar-label">Portrait (optional)</IonText>
										<ImagePicker onChange={handleImage} />
									</div>

									<IonButton
										type="submit"
										expand="block"
										className="auth-submit-btn"
										disabled={isLoading}
										color="primary"
									>
										{isLoading ? 'Creating profile…' : 'Complete registration'}
									</IonButton>
								</form>

								<IonButton routerLink="/login" expand="block" fill="clear" className="auth-footer-btn">
									Already registered? Sign in
								</IonButton>
							</IonCardContent>
						</IonCard>
					</div>
				</div>

				<Toast showToast={showToast} message={toastMessage} setShowToast={setShowToast} isError={isError} />
				<Loading showLoading={isLoading} message="Creating your account..." />
			</IonContent>
		</IonPage>
	);
};

export default Register;
