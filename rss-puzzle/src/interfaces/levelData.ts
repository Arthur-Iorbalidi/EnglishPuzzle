export default interface levelDataInterface {
    rounds: [
        {
            levelData: {
                id: string;
                name: string;
                imageSrc: string;
                cutSrc: string;
                author: string;
                year: string;
            };
            words: [
                {
                    audioExample: string;
                    textExample: string;
                    textExampleTranslate: string;
                    id: number;
                    word: string;
                    wordTranslate: string;
                },
            ];
        },
    ];
    roundsCount: number;
}
