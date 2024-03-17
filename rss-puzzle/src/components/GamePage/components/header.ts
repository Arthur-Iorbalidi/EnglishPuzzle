import GamePage from '../gamePage';
import CreateElement from '../../../utils/createElement';
import LoginPage from '../../LoginPage/loginPage';
import './header.scss';

class Header {
    private gamePage: GamePage;
    constructor(gamePage: GamePage) {
        this.gamePage = gamePage;
    }
    public create() {
        const header: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['header'],
        }).getElement();
        const navWrapper: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['navWrapper'],
        }).getElement();
        const selectLevelName: HTMLElement = new CreateElement({
            tag: 'span',
            cssClasses: ['selectName', 'selectLevelName'],
            content: 'Level',
        }).getElement();
        const selectLevel: HTMLElement = new CreateElement({
            tag: 'select',
            cssClasses: ['select', 'selectLevel'],
            event: {
                type: 'change',
                callback: (event: Event) => this.changeLevel(event),
            },
        }).getElement();
        for (let i = 1; i <= 6; i++) {
            const optionLevel: HTMLElement = new CreateElement({
                tag: 'option',
                cssClasses: ['optionLevel'],
                content: `${i}`,
                attributes: {
                    value: `${i}`,
                },
            }).getElement();
            selectLevel.append(optionLevel);
        }
        const selectRoundName: HTMLElement = new CreateElement({
            tag: 'span',
            cssClasses: ['selectName', 'selectRoundName'],
            content: 'Round',
        }).getElement();
        const selectRound: HTMLElement = new CreateElement({
            tag: 'select',
            cssClasses: ['select', 'selectRound'],
            event: {
                type: 'change',
                callback: (event: Event) => this.changeRound(event),
            },
        }).getElement();
        for (let i = 0; i < this.gamePage.currentLevel.roundsCount; i++) {
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

        const btnsWrapper: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['header_btnsWrapper'],
        }).getElement();
        const textHint_btn: HTMLElement = new CreateElement({
            tag: 'img',
            cssClasses: ['header_btn', 'textHint_btn'],
            attributes: {
                title: 'Показывать перевод',
                src: 'assets/icons/translate.svg',
            },
            event: {
                type: 'click',
                callback: (event: Event) => this.showTranslate(event),
            },
        }).getElement();
        const sound_btn: HTMLElement = new CreateElement({
            tag: 'img',
            cssClasses: ['header_btn', 'sound_hint_btn'],
            attributes: {
                title: 'Произнести предложение',
                src: 'assets/icons/sound.svg',
            },
            event: {
                type: 'click',
                callback: (event: Event) => this.soundSentense(event),
            },
        }).getElement();
        const logout_btn: HTMLElement = new CreateElement({
            tag: 'img',
            cssClasses: ['header_btn', 'logout_btn'],
            attributes: {
                title: 'Выйти',
                src: 'assets/icons/logout.svg',
            },
            event: {
                type: 'click',
                callback: () => this.logout(),
            },
        }).getElement();
        navWrapper.append(selectLevelName, selectLevel, selectRoundName, selectRound);
        btnsWrapper.append(textHint_btn, sound_btn, logout_btn);
        header.append(navWrapper, btnsWrapper);
        document.querySelector('.wrapperGamePage')?.prepend(header);

        (document.querySelector('.selectLevel') as HTMLSelectElement).value = this.gamePage.levelNumber.toString();
        (document.querySelector('.selectRound') as HTMLSelectElement).value = this.gamePage.roundNumber.toString();
    }
    private showTranslate(event: Event) {
        const btn = event.target as HTMLButtonElement;
        btn.classList.toggle('enable');
        document.querySelector('.textHint')?.classList.toggle('enable');
    }
    private soundSentense(event: Event) {
        const btn = event.target as HTMLButtonElement;
        const lines = document.querySelectorAll('.gameLine');
        const lineNumber = parseInt(lines[lines.length - 1].classList.item(1)?.substring(4) as string);
        const audio = new Audio(
            `assets/${this.gamePage.currentLevel.rounds[this.gamePage.roundNumber].words[lineNumber].audioExample}`
        );
        audio.addEventListener('ended', function () {
            btn.classList.remove('active');
        });
        btn.classList.add('active');
        audio.play();
    }
    private logout() {
        localStorage.clear();
        this.gamePage.clear();
        const loginPage = new LoginPage();
        loginPage.create();
    }
    private changeLevel(event: Event) {
        const selectLevel = event.target as HTMLSelectElement;
        this.gamePage.levelNumber = parseInt(selectLevel.value);
        this.gamePage.loadLevel();
        this.gamePage.cleanLines();
        this.gamePage.line = 0;
        this.gamePage.fillLine();
        this.gamePage.incorrect = [];
        this.unshowBtns();

        const selectRound = document.querySelector('.selectRound') as HTMLSelectElement;
        while (selectRound.firstChild) {
            selectRound.removeChild(selectRound.firstChild);
        }
        for (let i = 0; i < this.gamePage.currentLevel.roundsCount; i++) {
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
        selectRound.value = '0';
    }
    private changeRound(event: Event) {
        const selectRound = event.target as HTMLSelectElement;
        this.gamePage.roundNumber = parseInt(selectRound.value);
        this.gamePage.cleanLines();
        this.gamePage.line = 0;
        this.gamePage.fillLine();
        this.gamePage.incorrect = [];
        this.unshowBtns();
    }
    private unshowBtns() {
        document.querySelector('.resultsBtn')?.classList.remove('active');
        document.querySelector('.checkBtn')?.classList.remove('active');
        document.querySelector('.checkBtn')?.classList.remove('continueBtn');
        document.querySelector('.checkBtn')!.textContent = 'Check';
        document.querySelector('.autoCompleteBtn')?.classList.remove('inactive');
    }
}

export default Header;
