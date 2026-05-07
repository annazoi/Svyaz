import {
	IonContent,
	IonPage,
	IonButton,
	useIonRouter,
	IonCard,
	IonCardContent,
	IonProgressBar,
	IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../../services/auth';
import { LoginConfig } from '../../../validations-schemas/interfaces/user';
import { authStore } from '../../../store/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../../validations-schemas/auth';
import HidePassword from '../../../components/HidePassword';
import Toast from '../../../components/ui/Toast';
import './style.css';
import Input from '../../../components/ui/Input';

const Login: React.FC = () => {
	const router = useIonRouter();
	const { logIn } = authStore((store: any) => store);

	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginConfig>({
		defaultValues: {
			username: '',
			password: '',
		},
		resolver: yupResolver(loginSchema),
	});

	const { mutate, isLoading, isError } = useMutation({
		mutationFn: loginUser,
	});

	const onSubmit = async (data: any) => {
		mutate(data, {
			onSuccess: (data: any) => {
				logIn({
					token: data.token,
					userId: data.userId,
					avatar: data.avatar,
					username: data.username,
				});
				setToastMessage('Welcome back!');
				setShowToast(true);
				router.push('/inbox', 'forward', 'replace');
				setTimeout(() => window.location.reload(), 100);
			},
			onError: () => {
				setToastMessage('Invalid username or password');
				setShowToast(true);
			},
		});
	};

	return (
		<IonPage className="auth-page">
			<IonContent className="ion-padding modern-container bg-modern">
				<div className="animate-in" style={{ marginTop: 'clamp(2rem, 6vh, 4rem)' }}>
					<div className="auth-header-mark">
						<div className="auth-logo-container auth-logo-container--minimal">
							<span className="auth-tagline">Private messaging</span>
							<span className="auth-wordmark">Aura</span>
						</div>

						<div className="auth-header-text">
							<IonText>
								<h1>Sign in</h1>
							</IonText>
							<IonText color="medium">
								<p>Continue to your conversations. Access is tied to your account only.</p>
							</IonText>
						</div>
					</div>

					<IonCard className="auth-card glass-effect">
						<IonCardContent className="auth-form-container">
							{isLoading && (
								<IonProgressBar type="indeterminate" style={{ borderRadius: '4px', marginBottom: '15px' }} />
							)}

							<form onSubmit={handleSubmit(onSubmit)}>
								<Input
									label="Username"
									register={register('username')}
									className="modern-input"
									placeholder="Your username"
								/>
								{errors.username && <div className="field-error">{errors.username.message}</div>}

								<HidePassword register={register} />
								{errors.password && <div className="field-error">{errors.password.message}</div>}

								<IonButton
									type="submit"
									expand="block"
									className="auth-submit-btn"
									disabled={isLoading}
									color="primary"
								>
									{isLoading ? 'Signing in…' : 'Continue'}
								</IonButton>
							</form>

							<IonButton routerLink="/register" expand="block" fill="clear" className="auth-footer-btn">
								Request membership / Create account
							</IonButton>
						</IonCardContent>
					</IonCard>
				</div>

				<Toast showToast={showToast} message={toastMessage} setShowToast={setShowToast} isError={isError} />
			</IonContent>
		</IonPage>
	);
};

export default Login;
