import * as React from 'react';

import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Grid} from "semantic-ui-react";
import AppMenu from 'src/widgets/AppMenu';
import './App.css';
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";


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
                        <Grid.Column width={2} />
                        <Grid.Column width={12} >
                            <AppMenu
                                onSignedOut={() => this.onSignedOut()}
                                user={this.state.user}/>
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
                    </Grid>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
