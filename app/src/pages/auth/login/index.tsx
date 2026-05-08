import {
	IonContent,
	IonPage,
	IonButton,
	useIonRouter,
	IonCard,
	IonCardContent,
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
import Loading from '../../../components/Loading';

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
							<h2>Welcome back</h2>
							<p>Sign in to continue to your private conversations.</p>
						</div>
						<div className="auth-header-text auth-header-text--form">
							<IonText>
								<h1>Sign in</h1>
							</IonText>
							<IonText color="medium">
								<p>Continue to your conversations. Access is tied to your account only.</p>
							</IonText>
						</div>
						<IonCard className="auth-card glass-effect">
							<IonCardContent className="auth-form-container">
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
									Create account
								</IonButton>
							</IonCardContent>
						</IonCard>
					</div>
				</div>

				<Toast showToast={showToast} message={toastMessage} setShowToast={setShowToast} isError={isError} />
				<Loading showLoading={isLoading} message="Signing you in..." />
			</IonContent>
		</IonPage>
	);
};

export default Login;
