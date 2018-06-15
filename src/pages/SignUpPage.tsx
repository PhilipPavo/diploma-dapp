import * as React from 'react';
import {Link} from 'react-router-dom';
import {
    Button,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Message,
    Segment,
    Step,
    TextArea
} from 'semantic-ui-react';
import {User} from "../App";
import Account from "../utils/Account";

interface ISignUpPageState{
    contractAddress: any,
    address: string,
    txHash: string | null,
    values: {
        firstName: string,
        lastName: string,
        gender: string,
        description: string
    },
    status: SignUpStatus
}

type FormFieldName = 'firstName' | 'lastName' | 'gender' | 'description';
enum SignUpStatus {
    PREPARE,
    CANCELLED,
    PENDING,
    SUCCESS,
    FAILURE
}

interface ISignUpPageProps{
    user: User
}

class SignUpPage extends React.Component<ISignUpPageProps, ISignUpPageState> {
    constructor(props: ISignUpPageProps) {
        super(props);

        this.state = {
            address: '',
            contractAddress: '',
            status: SignUpStatus.PREPARE,
            txHash: null,
            values: {
                description: '',
                firstName: '',
                gender: '',
                lastName: '',
            },
        }

    }

    public componentDidMount(){
        Account.getContractAddress().then((contractAddress) => {
            this.setState({
                contractAddress
            });

            return Account.getCurrentAddress();
        }).then(address => {
            this.setState({
                address
            })
        });
    }

    public isFormDone():boolean{
        const values = this.state.values;
        return !!(values.firstName && values.lastName && values.gender);
    }

    public handleSubmit(){
        const {firstName, lastName, gender, description} = this.state.values;

        this.setState({
            status: SignUpStatus.PENDING
        });

        Account.signUp(this.state.address, firstName, lastName, gender, description).then(res => {
            for (const log of res.logs) {
                if (log.event === "UserRegistered") {
                    this.setState({
                        status: SignUpStatus.SUCCESS,
                        txHash: res.tx
                    });
                    break;
                }
            }
        }).catch(err => {
            this.setState({
                status: SignUpStatus.CANCELLED
            });
        });
    }

    public handleFieldChange(name: FormFieldName, e: any, value?){
        this.setState({
            values: {
                ...this.state.values,
                [name]: e.target.value || value
            }
        });
    }

    public render() {
        const isFormDone = this.isFormDone();
        const {status} = this.state;

        const renderVerifyStepIcon = () => {
            if(status === SignUpStatus.CANCELLED){
                return (<Icon
                    size='big'
                    color='red'
                    name='close' />);
            }

            if(status === SignUpStatus.PENDING){
                return (<Icon
                    loading={true}
                    size='big'
                    color='grey'
                    name='spinner' />);
            }

            return (
                <Icon
                    color={'blue'}
                    name='send' />);
        };

        return (
            <Grid>
                <Grid.Column width={10}>
                    <Step.Group size='mini' attached='top'>
                        <Step completed={isFormDone} active={!isFormDone}>
                            <Icon color={'teal'} name='info' />
                            <Step.Content>
                                <Step.Title>Данные</Step.Title>
                                <Step.Description>
                                    Заполните информацию<br/>
                                    о себе
                                </Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active={status <= SignUpStatus.PENDING && isFormDone} completed={status === SignUpStatus.SUCCESS} >
                            {renderVerifyStepIcon()}
                            <Step.Content>
                                <Step.Title>Подтверждение</Step.Title>
                                <Step.Description>
                                    Подтвердите регистрацию,<br/>
                                    отправив транзакцию
                                </Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active={status === SignUpStatus.SUCCESS}>
                            <Icon color={'green'} name='key' />
                            <Step.Content>
                                <Step.Title>Авторизация</Step.Title>
                                <Step.Description>
                                    Дождитесь подтверждения<br/>
                                    и войдите в аккаунт<br/>
                                </Step.Description>
                            </Step.Content>
                        </Step>
                    </Step.Group>

                    <Segment attached={false}>
                        <Header as='h2'>
                            <Icon name='address card outline' />
                            <Header.Content>
                                Создать аккаунт в системе
                                <Header.Subheader>
                                    Текущий адресс Ethereum:&nbsp;
                                    <small>
                                        <b>{this.state.address}</b>
                                    </small>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>

                        {status === SignUpStatus.PREPARE ? (
                            <Form onSubmit={() => this.handleSubmit()}>
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        onChange={(e: any) => this.handleFieldChange('firstName', e)}
                                        value={this.state.values.firstName}
                                        control={Input}
                                        label='Имя'
                                        placeholder='Введите имя' />
                                    <Form.Field
                                        onChange={(e: any) => this.handleFieldChange('lastName', e)}
                                        value={this.state.values.lastName}
                                        control={Input}
                                        label='Фамилия'
                                        placeholder='Введите фамилию' />
                                    <Form.Select
                                        fluid={true}
                                        label='Пол'
                                        options={[
                                            { key: 'm', text: 'Мужской', value: 'male' },
                                            { key: 'f', text: 'Женский', value: 'female' },
                                        ]}
                                        onChange={(e: any, {value}) => this.handleFieldChange('gender', e, value)}
                                        placeholder='Выберите из списка' />
                                </Form.Group>
                                <Form.Field
                                    onChange={(e: any) => this.handleFieldChange('description', e)}
                                    value={this.state.values.description}
                                    control={TextArea}
                                    label='Дополнительная информация'
                                    placeholder='Дополнительная информация' />
                                <Button
                                    circular={true}
                                    disabled={!isFormDone}
                                    icon={'edit'}
                                    content={'Подтвердить регистрацию'}
                                    type={'submit'}
                                    color={'blue'}/>
                            </Form>
                        ): null}


                        {status === SignUpStatus.PENDING ? (
                            <Message icon={true}>
                                <Icon name='world' color={'blue'}/>
                                <Message.Content>
                                    <Message.Header>
                                        Транзакция отправлена в сеть Ethereum
                                    </Message.Header>

                                    <p>
                                        Обработка может занять несколько минут. Отследить статус транзакции можно
                                        на сайте etherscan.io&nbsp;
                                        <a href={`https://rinkeby.etherscan.io/address/${this.state.contractAddress}`} target="_blank">по ссылке</a>
                                    </p>
                                </Message.Content>
                            </Message>
                        ) : null}


                        {status === SignUpStatus.CANCELLED ? (
                            <Message icon={true}>
                                <Icon name='cancel' color={'red'}/>
                                <Message.Content>
                                    <Message.Header>
                                        Транзакция отменена
                                    </Message.Header>
                                    <p>
                                        Транзакция отменена отправителем, вы можете отправить ее заново
                                    </p>
                                    <Button
                                        circular={true}
                                        color={'teal'}
                                        content={"Изменить данные"}
                                        icon={'edit'}
                                        onClick={() => {
                                            this.setState({
                                                status: SignUpStatus.PREPARE
                                            });
                                        }} />
                                    <Button
                                        circular={true}
                                        color={'blue'}
                                        content={"Отправить заново"}
                                        icon={'send'}
                                        onClick={() => {
                                            this.handleSubmit();
                                        }} />
                                </Message.Content>
                            </Message>
                        ) : null}

                        {status === SignUpStatus.SUCCESS ? (
                            <Message icon={true}>
                                <Icon name='world' color={'blue'}/>
                                <Message.Content>
                                    <Message.Header>
                                        Транзакция подтверждена
                                    </Message.Header>
                                    <p>
                                        <span>Идентификатор транзакции: </span>
                                        <br/>
                                        <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${this.state.txHash}`}>
                                            {`${this.state.txHash}`}
                                        </a>
                                    </p>

                                    <p>
                                        Теперь вы можете войти в свою учетную запись
                                    </p>
                                    <Button
                                        circular={true}
                                        color={'green'}
                                        content={"Войти"}
                                        icon={'key'}
                                        as={Link}
                                        to={'/sign-in'} />
                                </Message.Content>
                            </Message>
                        ) : null}
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default SignUpPage;
