import * as React from "react";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {Icon, Menu} from 'semantic-ui-react';


class SignInPage extends React.Component<any> {
    public render(){
        const authorized = this.props.user && this.props.user.authorized;
        const currentPath = this.props.location.pathname;

        return <Menu pointing={true}>
            <Menu.Item
                as={Link}
                active={currentPath === '/'}
                to={'/'}>
                <Icon
                    size={'big'}
                    color={'blue'}
                    name={'ethereum'}/>

                Пользователи
            </Menu.Item>

            {authorized ? (
                <React.Fragment>
                    <Menu.Item
                        active={currentPath === '/profile'}
                        as={Link}
                        to={'/profile'}>
                        <Icon
                            size={'large'}
                            color={'blue'}
                            name={'user'}/>

                        Учетная запись
                    </Menu.Item>
                    <Menu.Menu position='right'>

                        <Menu.Item
                            onClick={() => this.props.onSignedOut()}
                            active={false}>
                            <Icon
                                size={'large'}
                                color={'blue'}
                                name={'sign out alternate'}/>

                            Выйти
                        </Menu.Item>
                    </Menu.Menu>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Menu.Item
                        active={currentPath === '/sign-up'}
                        as={Link}
                        to={'/sign-up'}>
                        <Icon
                            size={'large'}
                            color={'blue'}
                            name={'address card outline'}/>

                        Создать аккаунт
                    </Menu.Item>

                    <Menu.Item
                        active={currentPath === '/sign-in'}
                        as={Link}
                        to={'/sign-in'}>
                        <Icon
                            size={'large'}
                            color={'blue'}
                            name={'lock open'}/>

                        Авторизация
                    </Menu.Item>
                </React.Fragment>
            )}
        </Menu>
    }
}

export default withRouter<any>(SignInPage);