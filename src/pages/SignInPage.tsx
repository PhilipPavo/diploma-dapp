import * as React from 'react';
import {Link} from "react-router-dom";
import {Container, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import {User} from "../App";
import Account from "../utils/Account";

enum SignInStatus{
    PREPARE,
    PENDING,
    CANCELLED,
    FAILURE,
    SUCCESS
}

interface ISignInPageState{
    address: string,
    status: SignInStatus
}

interface ISignInPageProps{
    user: User,
    onSignedIn: (publicAddress: string) => void
}

const signMessage = 'Авторизация пользователя';

class SignInPage extends React.Component<ISignInPageProps, ISignInPageState> {
    constructor(props) {
        super(props);

        if(this.props.user && this.props.user.authorized){
            this.state = {
                address: this.props.user.publicAddress,
                status: SignInStatus.SUCCESS
            };

            return;
        }

        this.state = {
            address: '',
            status: SignInStatus.PREPARE
        };
    }


    public componentWillReceiveProps(nextProps: ISignInPageProps){
        if(nextProps.user && nextProps.user.authorized){
            this.setState({
                address: nextProps.user.publicAddress,
                status: SignInStatus.SUCCESS,
            });
        }
    }

    public signMessage(){
        this.setState({
            status: SignInStatus.PENDING
        });

        Account.signMessage(signMessage, this.state.address).then(signature => {
            setTimeout(() => {
                if(signature && Account.verifySignature(signature, signMessage, this.state.address)){


                    this.props.onSignedIn(this.state.address);
                }
            }, 1000)
        }).catch(err => {
            this.setState({
                status: SignInStatus.CANCELLED
            });
        });
    }

    public componentDidMount(){
        Account.getCurrentAddress().then(address => {
            this.setState({
                address
            })
        });
    }

    public renderStatusMessage(status){
        if(status === SignInStatus.PENDING){
            return 'Производится проверка подписи'
        }

        if(status === SignInStatus.CANCELLED){
            return 'Подпись была отклонена или не прошла верификацию'
        }

        if(status === SignInStatus.SUCCESS){
            return 'Теперь вы можете перейти в учетную запись'
        }

        return 'Для входа в учетную запись необходимо подтвердить владение адрессом, подписав сообщение'
    }

    public renderStatusText(status){
        if(status === SignInStatus.PENDING){
            return 'Проверка подписи'
        }

        if(status === SignInStatus.CANCELLED){
            return 'Подпись отклонена'
        }

        if(status === SignInStatus.SUCCESS){
            return 'Подпись верифицирована'
        }

        return 'Вход в учетную запись'
    }

    public renderStatusIcon(status){

        if(status === SignInStatus.PENDING){
            return <Icon
                loading={true}
                color='green'
                name='sync' />
        }

        if(status === SignInStatus.CANCELLED){
            return <Icon
                size='big'
                color='red'
                name='cancel' />
        }

        if(status === SignInStatus.SUCCESS){
            return <Icon
                size='big'
                color='green'
                name='check' />
        }

        return <Icon name='lock' color={'grey'} />;
    }

    public render() {
        const {status} = this.state;
        return (
            <Grid>
                <Grid.Column width={4} />
                <Grid.Column width={8} >
                    <Segment >
                        <Container textAlign='center'>
                            <Header as='h2' icon={true}>
                                {this.renderStatusIcon(status)}
                                {this.renderStatusText(status)}
                                <br/>
                                <Header.Subheader>
                                    Адресс Ethereum:<br/>
                                    <b>{this.state.address}</b>
                                </Header.Subheader>
                            </Header>

                            <p>
                                {this.renderStatusMessage(status)}
                            </p>

                            {status === SignInStatus.SUCCESS ? (
                                <Button
                                    as={Link}
                                    to={'/profile'}
                                    content={'Перейти в учетную запись'}
                                    icon={'lock open'}
                                    circular={true}
                                    color={'green'}
                                />
                            ) : (
                                <Button
                                    disabled={status !== SignInStatus.PREPARE && status !== SignInStatus.CANCELLED}
                                    content={'Подписать'}
                                    icon={'lock open'}
                                    circular={true}
                                    color={'green'}
                                    onClick={() => {
                                        this.signMessage();
                                    }}
                                />

                            )}

                        </Container>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default SignInPage;
