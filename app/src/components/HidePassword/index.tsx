import { IonButton, IonIcon, IonInput } from '@ionic/react';
import './style.css';
import { useState } from 'react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import Input from '../ui/Input';
import Button from '../ui/Button';

const HidePassword = ({ register }: any) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');

	const handlePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="show-hide-password">
			<IonInput
				labelPlacement="floating"
				label="Password"
				className="input-container modern-input"
				type={showPassword ? 'text' : 'password'}
				value={password}
				onIonChange={(e: any) => setPassword(e.detail.value!)}
				{...register('password', { required: true })}
			></IonInput>

			<IonButton
				slot="end"
				className="show-hide-password-button"
				onClick={handlePassword}
				color={showPassword ? 'medium' : 'primary'}
			>
				<IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} />
			</IonButton>
		</div>
	);
};

export default HidePassword;
