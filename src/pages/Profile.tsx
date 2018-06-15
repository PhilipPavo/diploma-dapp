import * as moment from "moment/min/moment-with-locales";
import QRCode from 'qrcode';
import randomColor from "randomcolor";
import * as React from 'react';
import {Card, Dimmer, Icon, Image, Loader} from 'semantic-ui-react';
import {User} from "../App";
import Account from "../utils/Account";

export interface IProfileProps{
    user: User,
    match?: {
        params: {
            publicAddress: string
        }
    },
    history?: any
}

interface IProfileState{
    user: User
}

class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        }
    }

    public async componentDidMount(){
        let publicAddress;
        let exists;

        if(this.props.user && this.props.user.publicAddress){
            publicAddress = this.props.user.publicAddress;
        }else if(this.props.match && this.props.match.params.publicAddress){
            publicAddress = this.props.match.params.publicAddress;
        }else{
            return this.props.history.replace('/sign-in');
        }

        try{
            exists = await Account.exist(publicAddress);
            if(!exists){
                throw new Error('Not found');
            }
        }catch {
            return this.props.history.replace('/');
        }

        const passport = await Account.getPassport(publicAddress);

        const qrDataUrl = await QRCode.toDataURL(`http://dapp.philip.su/profile/${publicAddress}`, {
            color: {
                dark: randomColor({
                    hue: 'blue',
                    seed: publicAddress
                }),
                light: '#f9f9f9',
            },
            scale: 8
        });

        this.setState({
            user: {
                publicAddress,
                ...this.state.user,
                ...passport,
                qrDataUrl
            }
        })
    }

    public render() {
        if(this.state.user === null){
            return (
                <Card>
                    <Image src={null} />
                    <Card.Content>
                        <Card.Header>
                            ...
                        </Card.Header>
                        <Card.Meta>
                            <span className='date'>Зарегестрирован ...</span>
                        </Card.Meta>
                        <Card.Description>...</Card.Description>
                    </Card.Content>
                    <Card.Content extra={true}>
                        ...
                    </Card.Content>
                    <Dimmer active={true} inverted={true}>
                        <Loader inverted={true} content='Получение данных' />
                    </Dimmer>
                </Card>
            )
        }
        return (
            <Card style={{
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}>
                <Image src={this.state.user.qrDataUrl} />
                <Card.Content>
                    <Card.Header>{this.state.user.firstName} {this.state.user.lastName}</Card.Header>
                    <Card.Meta>
                        <span className='date'>
                            Зарегестрирован
                            <br/>
                            <b>
                            {moment(this.state.user.registered)
                                .locale('ru')
                                .format("DD MMMM YYYY H:mm")}
                            </b>
                            </span>

                    </Card.Meta>
                    <Card.Description>{this.state.user.description}</Card.Description>
                </Card.Content>
                <Card.Content extra={true}>
                    <a target="_blank" href={`https://rinkeby.etherscan.io/address/${this.state.user.publicAddress}`}>
                        <Icon name='ethereum' />

                        Учетная запись Ethereum
                    </a>
                </Card.Content>
            </Card>
        );
    }
}

export default Profile;
