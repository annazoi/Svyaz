import { IonButton, IonIcon } from '@ionic/react';
import React from 'react';

interface ButtonProps {
	name?: string;
	onClick?: () => void;
	icon?: any;
	iconSlot?: string;
	routerLink?: string;
	size?: string;
	color?: string;
	slot?: string;
	classname?: string;
}

const Button: React.FC<ButtonProps> = ({ classname, onClick, slot, name, icon, iconSlot, routerLink, size, color }) => {
	return (
		<IonButton
			onClick={onClick}
			expand="block"
			fill="solid"
			color={`secondary ${color}`}
			shape="round"
			routerLink={routerLink}
			slot={slot}
			className={classname}
		>
			<IonIcon icon={icon} slot={iconSlot} size={size}></IonIcon>
			{name}
		</IonButton>
	);
};

export default Button;
