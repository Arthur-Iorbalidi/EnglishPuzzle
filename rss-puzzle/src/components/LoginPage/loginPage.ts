import CreateElement from '../../utils/createElement';
import StartPage from '../StartPage/startPage';
import './loginPage.scss';

class LoginPage {
    public create(): void {
        const wrapperLogin: HTMLElement = new CreateElement({ tag: 'div', cssClasses: ['wrapperLogin'] }).getElement();
        const header: HTMLElement = new CreateElement({ tag: 'h2', content: 'Login' }).getElement();
        const form: HTMLElement = new CreateElement({
            tag: 'form',
            event: {
                type: 'submit',
                callback: (event: Event) => this.saveData(event),
            },
        }).getElement();
        const nameField: HTMLElement = new CreateElement({
            tag: 'input',
            cssClasses: ['name'],
            attributes: { placeholder: 'Name', required: '' },
            event: {
                type: 'input',
                callback: () =>
                    this.validate(
                        '.name',
                        '.surname',
                        '.mistakeName',
                        3,
                        /^[A-Z][A-Za-z-]{2,}$/,
                        /^[A-Z][A-Za-z-]{3,}$/
                    ),
            },
        }).getElement();
        const surnameField: HTMLElement = new CreateElement({
            tag: 'input',
            cssClasses: ['surname'],
            attributes: { placeholder: 'Surname', required: '' },
            event: {
                type: 'input',
                callback: () =>
                    this.validate(
                        '.surname',
                        '.name',
                        '.mistakeSurname',
                        4,
                        /^[A-Z][A-Za-z-]{3,}$/,
                        /^[A-Z][A-Za-z-]{2,}$/
                    ),
            },
        }).getElement();
        const submit: HTMLElement = new CreateElement({
            tag: 'button',
            cssClasses: ['submit'],
            content: 'Submit',
            attributes: { disabled: 'true' },
        }).getElement();
        const mistakeName: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['mistakeName'],
        }).getElement();
        const mistakeSurname: HTMLElement = new CreateElement({
            tag: 'div',
            cssClasses: ['mistakeSurname'],
        }).getElement();

        form.append(header, nameField, mistakeName, surnameField, mistakeSurname, submit);
        wrapperLogin.append(form);
        document.body.append(wrapperLogin);
    }
    private validate(
        className: string,
        nextFieldClass: string,
        mistakeClass: string,
        minLength: number,
        pattern: RegExp,
        nextPattern: RegExp
    ): void {
        const field = document.querySelector(className) as HTMLInputElement;
        const nextField = document.querySelector(nextFieldClass) as HTMLInputElement;
        const submit = document.querySelector('.submit') as HTMLButtonElement;
        const mistake = document.querySelector(mistakeClass) as HTMLButtonElement;

        if (!/^[A-Z].*/.test(field.value)) {
            mistake.textContent = 'The first letter must be capitalized and English';
            submit.disabled = true;
        } else {
            if (field.value.length < minLength) {
                mistake.textContent = `Minimum size - ${minLength}`;
                submit.disabled = true;
            } else {
                if (!pattern.test(field.value)) {
                    mistake.textContent = 'English alphabet and "-" are allowed';
                    submit.disabled = true;
                } else {
                    mistake.textContent = '';
                    if (nextPattern.test(nextField.value)) {
                        submit.disabled = false;
                    } else {
                        submit.disabled = true;
                    }
                }
            }
        }
    }
    public clear(): void {
        const wrapperLogin = document.querySelector('.wrapperLogin') as HTMLElement;
        wrapperLogin.remove();
    }
    private saveData(event: Event): void {
        event.preventDefault();
        const name = document.querySelector('.name') as HTMLInputElement;
        const surname = document.querySelector('.surname') as HTMLInputElement;
        localStorage.setItem('name', name.value);
        localStorage.setItem('surname', surname.value);
        this.clear();
        const startPage = new StartPage();
        startPage.create();
    }
}

export default LoginPage;
