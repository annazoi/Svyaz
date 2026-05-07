import { IonIcon, IonProgressBar } from '@ionic/react';
import aiImg from '../../../../assets/ai.jpg';
import './style.css';
import { ellipsisHorizontalOutline, flashOutline, happyOutline, readerOutline } from 'ionicons/icons';
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

	const loading = summaryIsLoading || emotionsIsLoading;
	const eng = !!(loading || summaryText || emotionText);

	return (
		<div className="ai">
			<div className="ai-scroll">
				{loading ? (
					<div className="ai-load">
						<IonIcon icon={flashOutline} className="ai-load-icon" aria-hidden />
						<span className="ai-load-note">Analyzing messages…</span>
						<IonProgressBar type="indeterminate" />
					</div>
				) : summaryText ? (
					<div className="ai-card">
						<div className="ai-card__hdr">
							<span className="ai-card__k">Summary</span>
							<IonIcon icon={readerOutline} aria-hidden />
						</div>
						<p className="ai-card__p">{summaryText}</p>
					</div>
				) : emotionText ? (
					<div className="ai-card">
						<div className="ai-card__hdr">
							<span className="ai-card__k">Tone</span>
							{emotionText.overall_mood && <span className="ai-card__mood">{emotionText.overall_mood}</span>}
						</div>
						{emotionText.explanation && <p className="ai-card__p">{emotionText.explanation}</p>}
						{emotionText.emotions?.length > 0 && (
							<div className="ai-tags">
								{emotionText.emotions.map((e: string) => (
									<span key={e}>{e}</span>
								))}
							</div>
						)}
					</div>
				) : (
					<p className="ai-idle">Choose Summary or Tone to analyze this conversation.</p>
				)}
				{!eng && (
					<figure className="ai-pic">
						<img src={aiImg} alt="" width={640} height={360} decoding="async" />
					</figure>
				)}
				<div className="ai-x" aria-hidden />
			</div>
			<footer className="ai-ft">
				{eng && <p className="ai-hint">Prefer another perspective? Use the complementary insight below whenever you like.</p>}
				<div className="ai-row">
					<button type="button" className="ai-act ai-solid" disabled={loading} onClick={() => mutateSummary({ chatId })}>
						<IonIcon icon={summaryIsLoading ? ellipsisHorizontalOutline : readerOutline} />
						Summary
					</button>
					<button type="button" className="ai-act" disabled={loading} onClick={() => mutateEmotions({ chatId })}>
						<IonIcon icon={emotionsIsLoading ? ellipsisHorizontalOutline : happyOutline} />
						Tone
					</button>
				</div>
			</footer>
		</div>
	);
};

export default AiTools;
