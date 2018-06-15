import * as React from 'react';
import {Grid} from 'semantic-ui-react';
import {User} from "../App";
import Account from "../utils/Account";
import Profile from "./Profile";


interface IHomePageProps{
    user: User
}

interface IHomePageState{
    accounts: string[]
}

class HomePage extends React.Component<IHomePageProps, IHomePageState> {
    constructor(props) {
        super(props);

        this.state = {
            accounts: []
        }
    }

    public async componentDidMount(){
        const accounts = await Account.getList();

        this.setState({
            accounts
        });
    }

    public render() {
        return (
            <Grid>

                {this.state.accounts.map(publicAddress => {
                    return (
                        <Grid.Column key={publicAddress} widescreen={3} computer={4} tablet={8} mobile={16}>
                            <Profile user={{
                                publicAddress
                            }}/>
                        </Grid.Column>
                    )
                })}
            </Grid>
        );
    }
}

export default HomePage;
