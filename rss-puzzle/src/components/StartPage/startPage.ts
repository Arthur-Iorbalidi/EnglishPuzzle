import CreateElement from '../../utils/createElement';
import GamePage from '../GamePage/gamePage';
import './startPage.scss';

class StartPage {
    public create(): void {
        const wrapperStartPage: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['wrapperStartPage'],
        }).getElement();
        const headerWrapper: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['headerWrapper'],
        }).getElement();
        const header: HTMLElement = new CreateElement({ tag: 'h1', content: 'ENGLISH PUZZLE' }).getElement();
        const gameDiscription: HTMLElement = new CreateElement({
            tag: 'p',
            cssClasses: ['discription'],
            content: 'Click on words, collect phrases. Words can be drag and drop',
        }).getElement();
        const startWrapper: HTMLElement = new CreateElement({ tag: 'div', cssClasses: ['startWrapper'] }).getElement();
        const greeting: HTMLElement = new CreateElement({
            tag: 'h2',
            cssClasses: ['greeting'],
            content: `Hi, ${localStorage.getItem('name')}`,
        }).getElement();
        const startBtn: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['startBtn'],
            content: 'Start',
            event: {
                type: 'click',
                callback: () => this.startGame(),
            },
        }).getElement();

        headerWrapper.append(header, gameDiscription);
        startWrapper.append(greeting, startBtn);
        wrapperStartPage.append(headerWrapper, startWrapper);
        document.body.append(wrapperStartPage);
    }
    public clear(): void {
        const wrapperStartPage = document.querySelector('.wrapperStartPage') as HTMLElement;
        wrapperStartPage.remove();
    }
    private startGame() {
        this.clear();
        const gamePage = new GamePage();
        gamePage.create();
    }
}

export default StartPage;
