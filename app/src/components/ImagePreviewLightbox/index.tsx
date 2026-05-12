import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';
import './style.css';

interface ImagePreviewLightboxProps {
	isOpen: boolean;
	imageSrc: string;
	onClose: () => void;
}

const ImagePreviewLightbox: React.FC<ImagePreviewLightboxProps> = ({ isOpen, imageSrc, onClose }) => {
	const handleDismiss = () => {
		onClose();
	};

	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={handleDismiss}
			className="image-preview-lightbox"
			backdropDismiss={true}
		>
			<IonContent fullscreen scrollY={false} className="image-preview-lightbox-content">
				<div className="image-preview-lightbox-stage">
					<img src={imageSrc} alt="" className="image-preview-lightbox-img" decoding="async" />
					<IonButton
						type="button"
						className="image-preview-lightbox-close"
						fill="clear"
						aria-label="Close"
						onClick={handleDismiss}
					>
						<IonIcon icon={closeOutline} />
					</IonButton>
				</div>
			</IonContent>
		</IonModal>
	);
};

export default ImagePreviewLightbox;
