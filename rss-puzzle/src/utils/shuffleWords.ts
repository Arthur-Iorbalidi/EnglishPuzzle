export default function shuffleArray(words: string[]): string[] {
    const shuffleWords = [...words];
    for (let i = shuffleWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleWords[i], shuffleWords[j]] = [shuffleWords[j], shuffleWords[i]];
    }
    return shuffleWords;
}
