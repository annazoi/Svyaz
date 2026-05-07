import { IonTitle } from '@ionic/react';
import React from 'react';

interface TitleProps {
	title: string;
	className?: string;
	color?: string;
	style?: any;
}

const Title: React.FC<TitleProps> = ({ title, className, color, style }) => {
	return (
		<IonTitle className={className ? className : 'ion-no-padding'} style={{ ...style }} color={color}>
			{title}
		</IonTitle>
	);
};

export default Title;
