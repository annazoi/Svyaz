import { IonButton, IonContent, IonIcon, IonProgressBar, IonText } from '@ionic/react';
import ai from '../../../../assets/ai.jpg';
import './style.css';
import { happyOutline, ellipsisHorizontalOutline, readerOutline, flashOutline } from 'ionicons/icons';
import { useMutation } from '@tanstack/react-query';
import { getChatEmotions, getChatSummary } from '../../../../services/openAi';
import { useState } from 'react';

interface AiToolsProps {
	chatId: string;
}

const AiTools = ({ chatId }: AiToolsProps) => {
	const [summaryText, setSummaryText] = useState<string>();
	const [emotionText, setEmotionText] = useState<any>();

	const { mutate: mutateSummary, isLoading: summaryIsLoading } = useMutation({
		mutationFn: ({ chatId }: any) => getChatSummary(chatId),
		onSuccess: (data) => {
			setEmotionText(undefined);
			setSummaryText(data.result);
		},
		onError: (error) => {
			console.error('Error fetching chat summary:', error);
		},
	});

	const { mutate: mutateEmotions, isLoading: emotionsIsLoading } = useMutation({
		mutationFn: ({ chatId }: any) => getChatEmotions(chatId),
		onSuccess: (data) => {
			setSummaryText(undefined);
			setEmotionText(data.result);
		},
		onError: (error) => {
			console.error('Error fetching chat emotions:', error);
		},
	});

	const getSummary = () => {
		mutateSummary({ chatId });
	};

	const getEmotions = () => {
		mutateEmotions({ chatId });
	};

	return (
		<>
			<div className="ai-options-container">
				<div className="ai-output-section">
					{summaryIsLoading || emotionsIsLoading ? (
						<div style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
							<IonIcon
								icon={flashOutline}
								style={{
									fontSize: '48px',
									color: 'var(--ion-color-primary)',
									animation: 'pulse 1.5s infinite',
								}}
							/>
							<IonText style={{ display: 'block', marginTop: '16px', fontWeight: '500', opacity: 0.7 }}>
								AI is analyzing your messages...
							</IonText>
							<IonProgressBar
								type="indeterminate"
								mode="ios"
								style={{ marginTop: '24px', borderRadius: '4px' }}
							/>
						</div>
					) : summaryText ? (
						<div className="ai-result-card animate-in">
							<div className="ai-result-header">
								<span className="ai-result-badge">Summary</span>
								<IonIcon icon={readerOutline} style={{ fontSize: '18px', opacity: 0.6 }} />
							</div>
							<p className="ai-result-text">{summaryText}</p>
						</div>
					) : emotionText ? (
						<div className="ai-result-card animate-in">
							<div className="ai-result-header">
								<span className="ai-result-badge">Emotion Analysis</span>
								<div className="ai-result-title">{emotionText.overall_mood}</div>
							</div>

							{emotionText.explanation && (
								<p className="ai-result-text" style={{ marginBottom: '16px' }}>
									{emotionText.explanation}
								</p>
							)}

							<div className="ai-tags-container">
								{emotionText.emotions?.map((e: string) => (
									<span key={e} className="ai-tag">
										{e}
									</span>
								))}
							</div>
						</div>
					) : (
						<img src={ai} className="ai-placeholder-image" alt="AI Placeholder" />
					)}
				</div>

				<div className="ai-actions-grid">
					<IonButton
						onClick={getSummary}
						className="ai-tool-btn summary-btn"
						disabled={summaryIsLoading || emotionsIsLoading}
						mode="ios"
					>
						<IonIcon icon={summaryIsLoading ? ellipsisHorizontalOutline : readerOutline} slot="start" />
						Get Summary
					</IonButton>

					<IonButton
						onClick={getEmotions}
						className="ai-tool-btn emotion-btn"
						disabled={summaryIsLoading || emotionsIsLoading}
						mode="ios"
					>
						<IonIcon icon={emotionsIsLoading ? happyOutline : happyOutline} slot="start" />
						Analyze Tone
					</IonButton>
				</div>

				<style>{`
				@keyframes pulse {
					0% { transform: scale(1); opacity: 0.8; }
					50% { transform: scale(1.1); opacity: 0.4; }
					100% { transform: scale(1); opacity: 0.8; }
				}
			`}</style>
			</div>
		</>
	);
};

export default AiTools;
