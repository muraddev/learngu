import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import Main from './Main';
import Dictionary from './Dictionary'
import Trainings from './Trainings'
import { Container } from 'semantic-ui-react';
import Keyboard from './Games/Keyboard';
import Translation from './Games/Translation';
import Word from './Games/Word';
import AudioGame from "./Games/Audio";
import Profile from './Profile';
import TranslationAudio from './Games/TranslationAudio';
import Text from './Texts';
import './style.css'



class Index extends React.Component {
    render() {
        return (
            <Router>
                <Container>
                    <div>
                        <div className="navLinks">
                            <NavLink to="/reading" exact activeClassName="activeNav">Main</NavLink>
                            <NavLink to="/dictionary" exact activeClassName="activeNav">Dictionary</NavLink>
                            <NavLink to="/training" activeClassName="activeNav">Training</NavLink>
                            <NavLink to="/profile" activeClassName="activeNav">Profile</NavLink>
                            <a href="/logout">Logout</a>
                        </div>
                        <div>
                            <br />
                            <Switch>
                                <Route path="/training/word" exact component={Word} />
                                <Route path="/training/translation" exact component={Translation} />
                                <Route path="/training/keyboard" exact component={Keyboard} />
                                <Route path="/training/audio" exact component={AudioGame} />
                                <Route path="/training/translation-audio" exact component={TranslationAudio} />
                                <Route path="/training" component={Trainings} />
                                <Route path="/dictionary" component={Dictionary} />
                                <Route path="/profile" component={Profile} />
                                <Route path="/reading" component={Text} />
                                {/* <Route path="/" exact component={Main} /> */}
                                <Redirect to="/reading" />
                            </Switch>
                        </div>
                    </div>
                </Container>
            </Router>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
registerServiceWorker();
