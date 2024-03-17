import levelDataInterface from '../../interfaces/levelData';
import CreateElement from '../../utils/createElement';
import shuffleArray from '../../utils/shuffleWords';
import Header from './components/header';
import Statistics from './components/statistics';
import './gamePage.scss';

class GamePage {
    public levelNumber: number = localStorage.getItem('level') ? parseInt(localStorage.getItem('level') as string) : 1;
    public roundNumber: number = localStorage.getItem('level') ? parseInt(localStorage.getItem('round') as string) : 0;
    public currentLevel: levelDataInterface = require(
        `../../assets/word_collection/wordCollectionLevel${this.levelNumber}.json`
    );
    public line: number = 0;
    public incorrect: number[] = [];
    public create() {
        const wrapperGamePage: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['wrapperGamePage'],
        }).getElement();
        const container: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['container'],
        }).getElement();
        const textHint: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['textHint'],
        }).getElement();
        const gameWrapper: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['gameWrapper'],
        }).getElement();
        const gameField: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['gameField'],
        }).getElement();
        const sourceField: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['sourceField'],
        }).getElement();
        const btnsWrapper: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['btnsWrapper'],
        }).getElement();
        const checkBtn: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['checkBtn'],
            content: 'Check',
            event: {
                type: 'click',
                callback: (event: Event) => this.checkAndContinue(event),
            },
        }).getElement();
        const autoCompleteBtn: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['autoCompleteBtn'],
            content: "I don't now",
            event: {
                type: 'click',
                callback: () => this.autoComplete(),
            },
        }).getElement();
        const resultsBtn: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['resultsBtn'],
            content: 'Results',
            event: {
                type: 'click',
                callback: () => this.showResults(),
            },
        }).getElement();

        btnsWrapper.append(checkBtn, autoCompleteBtn, resultsBtn);
        gameWrapper.append(gameField, sourceField, btnsWrapper);
        container.append(textHint, gameWrapper);
        wrapperGamePage.append(container);
        document.body.append(wrapperGamePage);
        const header = new Header(this);
        header.create();
        this.fillLine();
    }
    public loadLevel() {
        this.currentLevel = require(`../../assets/word_collection/wordCollectionLevel${this.levelNumber}.json`);
    }
    public fillLine(): void {
        const gameField = document.querySelector('.gameField') as HTMLElement;
        const currentLine = new CreateElement({
            tag: 'div',
            cssClasses: ['gameLine', `line${this.line}`],
        }).getElement();
        const number = new CreateElement({
            tag: 'div',
            cssClasses: ['number'],
            content: `${this.line + 1}`,
        }).getElement();
        currentLine.append(number);
        gameField.append(currentLine);

        const sourceField = document.querySelector('.sourceField') as HTMLElement;
        const words = this.currentLevel.rounds[this.roundNumber].words[this.line].textExample.split(' ');
        const shuffleWords: string[] = shuffleArray(words);

        while (sourceField.firstChild) {
            sourceField.firstChild.remove();
        }

        for (let i = 0; i < shuffleWords.length; i++) {
            const wordWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['wordWrapper'],
            }).getElement();
            wordWrapper.addEventListener('dragover', this.wordWrapperDragoverHandler);
            wordWrapper.addEventListener('dragleave', this.wordWrapperDragleaveHandler);
            wordWrapper.addEventListener('drop', this.wordWrapperDropHandler);
            currentLine.append(wordWrapper);
        }
        for (let i = 0; i < shuffleWords.length; i++) {
            const wordWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['wordWrapper'],
            }).getElement();
            const word = new CreateElement({
                tag: 'div',
                cssClasses: ['word'],
                content: `${shuffleWords[i]}`,
                attributes: { draggable: 'true' },
            }).getElement();
            word.addEventListener('click', this.moveWordHandler);
            word.addEventListener('dragstart', this.dragWordStartHandler);
            word.addEventListener('dragend', this.dragWordEndHandler);
            wordWrapper.addEventListener('dragover', this.wordWrapperDragoverHandler);
            wordWrapper.addEventListener('dragleave', this.wordWrapperDragleaveHandler);
            wordWrapper.addEventListener('drop', this.wordWrapperDropHandler);
            wordWrapper.append(word);
            sourceField.append(wordWrapper);
        }

        const textHint = document.querySelector('.textHint') as HTMLElement;
        textHint.textContent = `${this.currentLevel.rounds[this.roundNumber].words[this.line].textExampleTranslate}`;
    }
    private wordWrapperDropHandler = (event: DragEvent) => this.wordWrapperDrop(event);
    private wordWrapperDrop(event: DragEvent): void {
        const eventTarget = event.target as HTMLElement;
        const wordWrapper = eventTarget.closest('.wordWrapper') as HTMLElement;
        wordWrapper.style.removeProperty('min-width');
        wordWrapper.classList.remove('active');
        const word = document.querySelector('.dragging') as HTMLElement;
        if (!wordWrapper.contains(word)) {
            if (wordWrapper.hasChildNodes()) {
                const initWord = wordWrapper.querySelector('.word') as HTMLElement;
                initWord?.remove();
                const initWordWrapper = word.parentElement;
                initWordWrapper?.append(initWord);
            }
            wordWrapper.append(word);
            this.showCheckBtn();
            this.unshowMistakes();
        }
    }
    private wordWrapperDragleaveHandler = (event: DragEvent) => this.wordWrapperDragleave(event);
    private wordWrapperDragleave(event: DragEvent): void {
        const eventTarget = event.target as HTMLElement;
        const wordWrapper = eventTarget.closest('.wordWrapper') as HTMLElement;
        wordWrapper.style.removeProperty('min-width');
        wordWrapper.classList.remove('active');
    }
    private wordWrapperDragoverHandler = (event: DragEvent) => this.wordWrapperDragover(event);
    private wordWrapperDragover(event: DragEvent): void {
        const eventTarget = event.target as HTMLElement;
        const wordWrapper = eventTarget.closest('.wordWrapper') as HTMLElement;
        const word = document.querySelector('.dragging') as HTMLElement;
        if (!wordWrapper.contains(word) && document.querySelector('.dragging')) {
            const elementWidth = word.offsetWidth;
            wordWrapper.style.minWidth = `${elementWidth}px`;
            wordWrapper.classList.add('active');
            event.preventDefault();
        }
    }
    private dragWordStartHandler = (event: DragEvent) => this.dragWordStart(event);
    private dragWordStart(event: DragEvent): void {
        const word = event.target as HTMLElement;
        word.classList.add('dragging');
    }
    private dragWordEndHandler = (event: DragEvent) => this.dragWordEnd(event);
    private dragWordEnd(event: DragEvent): void {
        const word = event.target as HTMLElement;
        word.classList.remove('dragging');
    }
    private moveWordHandler = (event: Event) => this.moveWord(event);
    private moveWord(event: Event): void {
        this.unshowMistakes();
        const word = event.target as HTMLElement;
        const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
        const wordWrappersLine = currentLine.querySelectorAll('.wordWrapper') as NodeListOf<Element>;
        if (word.closest('.sourceField')) {
            word.remove();
            for (let i = 0; i < wordWrappersLine.length; i++) {
                if (wordWrappersLine[i].childElementCount === 0) {
                    wordWrappersLine[i].append(word);
                    break;
                }
            }
        } else {
            word.remove();
            const sourceField = document.querySelector('.sourceField') as HTMLElement;
            const wordWrappersSource = sourceField.querySelectorAll('.wordWrapper') as NodeListOf<Element>;
            for (let i = 0; i < wordWrappersSource.length; i++) {
                if (wordWrappersSource[i].childElementCount === 0) {
                    wordWrappersSource[i].append(word);
                    break;
                }
            }
        }
        this.showCheckBtn();
    }
    private showCheckBtn(): void {
        const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
        const wordWrappersLine = currentLine.querySelectorAll('.wordWrapper') as NodeListOf<Element>;
        if (currentLine.querySelectorAll('.word').length === wordWrappersLine.length) {
            document.querySelector('.checkBtn')?.classList.add('active');
        } else {
            document.querySelector('.checkBtn')?.classList.remove('active');
        }
    }
    private checkAndContinue(event: Event): void {
        const btn = event.target as HTMLElement;
        if (btn.classList.contains('continueBtn')) {
            this.nextPage();
            document.querySelector('.resultsBtn')?.classList.remove('active');
            btn.classList.remove('active');
            btn.classList.remove('continueBtn');
            btn.textContent = 'Check';
            document.querySelector('.autoCompleteBtn')?.classList.remove('inactive');
        } else {
            const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
            const wordsInLine = currentLine.querySelectorAll('.word') as NodeListOf<Element>;
            const words = this.currentLevel.rounds[this.roundNumber].words[this.line].textExample.split(' ');
            words.forEach((word, index) => {
                if (wordsInLine[index].textContent === word) {
                    wordsInLine[index].classList.add('correct');
                } else {
                    wordsInLine[index].classList.add('incorrect');
                }
            });
            if (currentLine.querySelectorAll('.correct').length === words.length) {
                this.deleteEvents();
                btn.classList.add('continueBtn');
                btn.textContent = 'Continue';
                document.querySelector('.autoCompleteBtn')?.classList.add('inactive');
                if (document.querySelectorAll('.gameLine').length === 10) {
                    document.querySelector('.resultsBtn')?.classList.add('active');
                }
            }
        }
    }
    private deleteEvents(): void {
        const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
        currentLine.querySelectorAll('.word').forEach((word) => {
            word.removeEventListener('click', this.moveWordHandler);
            word.removeAttribute('draggable');
        });
        currentLine.querySelectorAll('.wordWrapper').forEach((wordWrapper) => {
            wordWrapper.removeEventListener('dragover', this.wordWrapperDragoverHandler as EventListener);
            wordWrapper.removeEventListener('dragleave', this.wordWrapperDragleaveHandler as EventListener);
            wordWrapper.removeEventListener('drop', this.wordWrapperDropHandler as EventListener);
        });
    }
    private nextPage(): void {
        if (this.line < 9) {
            this.line++;
        } else {
            if (this.roundNumber < this.currentLevel.roundsCount - 1) {
                this.roundNumber++;
                this.updateSelectRound();
                this.line = 0;
            } else {
                if (this.levelNumber === 6) {
                    this.levelNumber = 1;
                } else {
                    this.levelNumber++;
                }
                this.roundNumber = 0;
                this.line = 0;
                this.updateSelectLevel();
                this.loadLevel();
            }
            this.cleanLines();
            this.incorrect = [];
        }
        localStorage.setItem('level', this.levelNumber.toString());
        localStorage.setItem('round', this.roundNumber.toString());
        this.fillLine();
    }
    private updateSelectLevel() {
        (document.querySelector('.selectLevel') as HTMLSelectElement).value = this.levelNumber.toString();
        const selectRound = document.querySelector('.selectRound') as HTMLSelectElement;
        while (selectRound.firstChild) {
            selectRound.removeChild(selectRound.firstChild);
        }
        for (let i = 0; i < this.currentLevel.roundsCount; i++) {
            const optionLevel: HTMLElement = new CreateElement({
                tag: 'option',
                cssClasses: ['optionLevel'],
                content: `${i}`,
                attributes: {
                    value: `${i}`,
                },
            }).getElement();
            selectRound.append(optionLevel);
        }
        selectRound.value = this.roundNumber.toString();
    }
    private updateSelectRound() {
        (document.querySelector('.selectRound') as HTMLSelectElement).value = this.roundNumber.toString();
    }
    private showResults() {
        const statistics = new Statistics(this.incorrect, this.currentLevel, this.roundNumber);
        statistics.createStatistics();
        this.nextPage();
        const btn = document.querySelector('.checkBtn') as HTMLElement;
        btn.classList.remove('active');
        btn.classList.remove('continueBtn');
        btn.textContent = 'Check';
        document.querySelector('.autoCompleteBtn')?.classList.remove('inactive');
        document.querySelector('.resultsBtn')?.classList.remove('active');
    }
    public cleanLines() {
        const gameField = document.querySelector('.gameField') as HTMLElement;
        while (gameField.firstChild) {
            gameField.firstChild.remove();
        }
    }
    private unshowMistakes(): void {
        const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
        const wordsInLine = currentLine.querySelectorAll('.word') as NodeListOf<Element>;
        wordsInLine.forEach((word) => {
            word.classList.remove('correct', 'incorrect');
        });
    }
    private autoComplete(): void {
        document.querySelector('.autoCompleteBtn')?.classList.add('inactive');
        if (!this.incorrect.includes(this.line)) {
            this.incorrect.push(this.line);
        }
        const sourceField = document.querySelector('.sourceField') as HTMLElement;
        sourceField.querySelectorAll('.word').forEach((word) => {
            word.remove();
        });
        const currentLine = document.querySelector(`.line${this.line}`) as HTMLElement;
        currentLine.querySelectorAll('.word').forEach((word) => {
            word.remove();
        });
        const words = this.currentLevel.rounds[this.roundNumber].words[this.line].textExample.split(' ');
        const wordWrappes = currentLine.querySelectorAll('.wordWrapper');
        words.forEach((word, index) => {
            wordWrappes[index].append(
                new CreateElement({
                    tag: 'div',
                    cssClasses: ['word'],
                    content: word,
                }).getElement()
            );
        });
        this.deleteEvents();
        const btn = document.querySelector('.checkBtn') as HTMLElement;
        btn.classList.add('active');
        btn.classList.add('continueBtn');
        btn.textContent = 'Continue';
        if (document.querySelectorAll('.gameLine').length === 10) {
            document.querySelector('.resultsBtn')?.classList.add('active');
        }
    }
    public clear() {
        const wrapperGamePage = document.querySelector('.wrapperGamePage') as HTMLElement;
        wrapperGamePage.remove();
    }
}

export default GamePage;
