import { IonButton, IonIcon, IonInput } from '@ionic/react';
import './style.css';
import { useState } from 'react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

const HidePassword = ({ register }: any) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const passwordField = register('password', { required: true });

	const handlePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="show-hide-password">
			<IonInput
				labelPlacement="floating"
				label="Password"
				className="show-hide-password-input input-container modern-input"
				type={showPassword ? 'text' : 'password'}
				clearOnEdit={false}
				value={password}
				name={passwordField.name}
				ref={passwordField.ref}
				onIonInput={(e: any) => {
					const nextValue = e?.detail?.value ?? '';
					setPassword(nextValue);
					passwordField.onChange({
						target: {
							name: passwordField.name,
							value: nextValue,
						},
					});
				}}
				onIonBlur={passwordField.onBlur}
			/>

			<IonButton
				className="show-hide-password-button"
				fill="clear"
				onClick={handlePassword}
				color="medium"
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				<IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} />
			</IonButton>
		</div>
	);
};

export default HidePassword;
