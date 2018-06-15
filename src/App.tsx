import * as React from 'react';

import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Grid, Icon, Message} from "semantic-ui-react";
import AppMenu from 'src/widgets/AppMenu';
import './App.css';
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import {isInjected} from "./utils/web3";


export type User = null | {
    authorized?: boolean,
    publicAddress: string,
    firstName?: string,
    lastName?: string,
    gender?: string,
    registered?: Date,
    description?: string,
    qrDataUrl?: string
};

interface IAppState{
    user: User
}


class App extends React.Component<{}, IAppState> {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        }
    }

    public onSignedIn(publicAddress: string){
        this.setState({
            user: {
                authorized: true,
                publicAddress
            }
        })
    }

    public onSignedOut(){
        this.setState({
            user: null
        })
    }

    public render() {
        return (
            <Router>
                <React.Fragment>
                    <Grid style={{marginTop: '16px'}}>


                        {!isInjected ? (
                            <React.Fragment>
                                <Grid.Row only={'computer'}>
                                    <Grid.Column />
                                    <Grid.Column width={12}>
                                        <Message icon={true}>
                                            <Icon
                                                size={'large'}
                                                color={isInjected ? 'blue' : 'orange'}
                                                name={isInjected ? 'address card outline' : 'warning sign'}/>
                                            <Message.Content>
                                                <Message.Header>Не обнаружено расширение MetaMask</Message.Header>
                                                Для авторизации и регистрации необходимо установить расширение для браузера <a target="_blank" href="https://metamask.io/">MetaMask</a>
                                            </Message.Content>
                                        </Message>
                                    </Grid.Column>
                                    <Grid.Column width={2} />
                                </Grid.Row>
                            </React.Fragment>
                        ) : null}

                        <Grid.Row only={'computer'}>
                            <Grid.Column/>
                            <Grid.Column width={12} >
                                <AppMenu
                                    onSignedOut={() => this.onSignedOut()}
                                    user={this.state.user}/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row only={'mobile tablet'}>
                            <Grid.Column/>
                            <Grid.Column width={14} >
                                <h1>Учетные записи</h1>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column/>
                            <Grid.Column centered={1} computer={12} mobile={14} tablet={14}>
                                <Switch>
                                    <Route
                                        exact={true}
                                        path="/"
                                        component={() => {
                                            return <HomePage user={this.state.user}/>
                                        }}/>
                                    <Route
                                        exact={true}
                                        path="/sign-in"
                                        component={() => {
                                            return <SignInPage
                                                onSignedIn={(publicAddress) => this.onSignedIn(publicAddress)}
                                                user={this.state.user}/>
                                        }}/>
                                    <Route
                                        exact={true}
                                        path="/sign-up"
                                        component={() => {
                                            return <SignUpPage user={this.state.user}/>
                                        }}/>
                                    <Route
                                        exact={true}
                                        path="/profile"
                                        component={(props) => {
                                            return <Profile user={this.state.user} {...props}/>
                                        }}/>
                                    <Route
                                        exact={true}
                                        path="/profile/:publicAddress"
                                        component={(props) => {
                                            return <Profile user={this.state.user} {...props}/>
                                        }}/>
                                </Switch>
                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
