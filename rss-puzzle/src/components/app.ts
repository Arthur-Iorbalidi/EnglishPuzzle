import LoginPage from './LoginPage/loginPage';
import StartPage from './StartPage/startPage';

class App {
    public start(): void {
        if (localStorage.getItem('name') === null) {
            const loginPage = new LoginPage();
            loginPage.create();
        } else {
            const startPage = new StartPage();
            startPage.create();
        }
    }
}

export default App;
