import levelDataInterface from '../../../interfaces/levelData';
import CreateElement from '../../../utils/createElement';
import './statistics.scss';

class Statistics {
    private incorrect: number[];
    private currentLevel: levelDataInterface;
    private roundNumber: number;
    constructor(incorrect: number[], currentLevel: levelDataInterface, roundNumber: number) {
        this.incorrect = incorrect;
        this.currentLevel = currentLevel;
        this.roundNumber = roundNumber;
    }
    public createStatistics(): void {
        const backgroundModal = new CreateElement({
            tag: 'div',
            cssClasses: ['background_modal'],
        }).getElement();
        const modal = new CreateElement({
            tag: 'div',
            cssClasses: ['modal'],
        }).getElement();
        const img = new CreateElement({
            tag: 'img',
            cssClasses: ['picture'],
            attributes: {
                src: `assets/images/${this.currentLevel.rounds[this.roundNumber].levelData.cutSrc}`,
            },
        }).getElement();
        const imgDescr = new CreateElement({
            tag: 'p',
            content: `${this.currentLevel.rounds[this.roundNumber].levelData.author} - ${this.currentLevel.rounds[this.roundNumber].levelData.name} (${this.currentLevel.rounds[this.roundNumber].levelData.year})`,
            cssClasses: ['picture_descr'],
        }).getElement();
        const statisticsBlock = new CreateElement({
            tag: 'div',
            cssClasses: ['statistics'],
        }).getElement();
        if (this.incorrect.length < 10) {
            const correctWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['category_container'],
            }).getElement();
            const knowWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['category_name_container'],
            }).getElement();
            const know = new CreateElement({
                tag: 'span',
                cssClasses: ['category_name'],
                content: 'I know',
            }).getElement();
            const knowCount = new CreateElement({
                tag: 'div',
                cssClasses: ['know_count', 'count'],
                content: `${10 - this.incorrect.length}`,
            }).getElement();
            const sentencesWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['sentences_wrapper'],
            }).getElement();
            knowWrapper.append(know, knowCount);
            correctWrapper.append(knowWrapper, sentencesWrapper);
            statisticsBlock.append(correctWrapper);
            for (let i = 0; i < 10; i++) {
                if (!this.incorrect.includes(i)) {
                    const sentenceWrapper = new CreateElement({
                        tag: 'div',
                        cssClasses: ['sentence_wrapper'],
                    }).getElement();
                    const soundBtn = new CreateElement({
                        tag: 'img',
                        attributes: {
                            src: 'assets/icons/sound.svg',
                        },
                        cssClasses: ['sound_btn', `${i}`],
                        event: {
                            type: 'click',
                            callback: (event: Event) => this.sound(event),
                        },
                    }).getElement();
                    const sentence = new CreateElement({
                        tag: 'span',
                        cssClasses: ['sentence'],
                        content: `${this.currentLevel.rounds[this.roundNumber].words[i].textExample}`,
                    }).getElement();
                    sentenceWrapper.append(soundBtn, sentence);
                    sentencesWrapper.append(sentenceWrapper);
                }
            }
        }
        if (this.incorrect.length > 0) {
            const incorrectWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['category_container'],
            }).getElement();
            const dontKnowWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['category_name_container'],
            }).getElement();
            const dontKnow = new CreateElement({
                tag: 'span',
                cssClasses: ['category_name'],
                content: "I don't know",
            }).getElement();
            const dontKnowCount = new CreateElement({
                tag: 'div',
                cssClasses: ['dont_know_count', 'count'],
                content: `${this.incorrect.length}`,
            }).getElement();
            const sentencesWrapper = new CreateElement({
                tag: 'div',
                cssClasses: ['sentences_wrapper'],
            }).getElement();
            dontKnowWrapper.append(dontKnow, dontKnowCount);
            incorrectWrapper.append(dontKnowWrapper, sentencesWrapper);
            statisticsBlock.append(incorrectWrapper);
            this.incorrect.forEach((elem) => {
                const sentenceWrapper = new CreateElement({
                    tag: 'div',
                    cssClasses: ['sentence_wrapper'],
                }).getElement();
                const soundBtn = new CreateElement({
                    tag: 'img',
                    attributes: {
                        src: 'assets/icons/sound.svg',
                    },
                    cssClasses: ['sound_btn', `${elem}`],
                    event: {
                        type: 'click',
                        callback: (event: Event) => this.sound(event),
                    },
                }).getElement();
                const sentence = new CreateElement({
                    tag: 'span',
                    cssClasses: ['sentence'],
                    content: `${this.currentLevel.rounds[this.roundNumber].words[elem].textExample}`,
                }).getElement();
                sentenceWrapper.append(soundBtn, sentence);
                sentencesWrapper.append(sentenceWrapper);
            });
        }
        const continueBtn: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['continue_btn'],
            content: 'Continue',
            event: {
                type: 'click',
                callback: () => this.continue(),
            },
        }).getElement();
        modal.append(img, imgDescr, statisticsBlock, continueBtn);
        backgroundModal.append(modal);
        document.body.append(backgroundModal);
    }
    private closeStatistics(): void {
        document.body.querySelector('.background_modal')?.remove();
    }
    private continue(): void {
        this.closeStatistics();
    }
    public sound(event: Event) {
        const btn = event.target as HTMLButtonElement;
        const lineNumber = parseInt(btn.classList.item(1) as string);
        const audio = new Audio(
            `assets/${this.currentLevel.rounds[this.roundNumber].words[lineNumber].audioExample}`
        );
        const btns = document.querySelectorAll('.sound_btn') as NodeListOf<HTMLElement>;
        audio.addEventListener('ended', function () {
            btns.forEach((elem) => {
                elem.classList.remove('disable');
            });
            btn.classList.remove('active');
        });
        btns.forEach((elem) => {
            elem.classList.add('disable');
        });
        btn.classList.add('active');
        audio.play();
    }
}

export default Statistics;
