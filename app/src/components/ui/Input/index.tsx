import { IonInput } from '@ionic/react';
import React from 'react';
import { motion } from 'framer-motion';
type IonInputProps = React.ComponentProps<typeof IonInput>;

interface InputProps {
	fill?: string;
	placeholder?: string;
	labelPlacement?: string;
	label?: string;
	className?: string;
	props?: IonInputProps;
	icon?: any;
	register?: any;
	required?: boolean;
	error?: any;
	onIonChange?: any;
	type?: any;
}

const Input: React.FC<InputProps> = ({
	fill,
	placeholder,
	labelPlacement,
	label,
	className,
	props,
	icon,
	register,
	required,
	error,
	onIonChange,
	type,
	...rest
}) => {
	return (
		<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
			<IonInput
				{...register}
				{...props}
				{...rest}
				type={type}
				labelPlacement="floating"
				label={label}
				className={`input-container ${className}`}
				onIonChange={onIonChange}
			></IonInput>
		</motion.div>
	);
};

export default Input;
