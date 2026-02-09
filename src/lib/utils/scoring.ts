/**
 * Calculates a virality score based on various factors
 * Weights: 
 * - Volume/Traffic: 40%
 * - velocity (Growth): 30%
 * - Social Signals (Metadata like score/views): 30%
 */
export function calculateViralScore(data: {
    volume?: number;
    socialScore?: number;
    velocity?: number; // Growth percentage or rank improvement
}): number {
    const { volume = 0, socialScore = 0, velocity = 0 } = data;

    // Normalize volume (assuming max 1M for full 40 points)
    const normVolume = Math.min((volume / 1000000) * 40, 40);

    // Normalize social score (assuming max 10k for full 30 points)
    const normSocial = Math.min((socialScore / 10000) * 30, 30);

    // Normalize velocity (assuming max 100% growth for full 30 points)
    const normVelocity = Math.min((velocity / 100) * 30, 30);

    const total = Math.round(normVolume + normSocial + normVelocity);

    // Ensure score is between 1 and 100
    return Math.max(1, Math.min(total, 100));
}

/**
 * Determines sentiment score (0 to 1) from text analysis placeholder
 * In a real app, this would be the output of an LLM
 */
export function getSentimentLabel(score: number): 'Positive' | 'Neutral' | 'Negative' {
    if (score > 0.6) return 'Positive';
    if (score < 0.4) return 'Negative';
    return 'Neutral';
}
