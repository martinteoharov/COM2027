import React, { useState } from 'react';
import Button from './Button';
import ButtonOAuth from './ButtonOAuth';
import '../styles/form.css'
import { fetchLogin, fetchRegister } from "../api/auth";
import { TokenPair } from 'simple-rtr';
import { spawnNotification } from "../helpers/notification";
import jwtDecode from 'jwt-decode';
import { rtrCtx } from '../context/rtr';
import { ILoginRequest, IRegisterRequest } from '../../interfaces/requests/auth';

export interface IProps {
    type: "login" | "register";
}

const Form: React.FC<IProps> = (props: IProps) => {
    const [selected, setSelected] = useState(props.type);
    const rtr = React.useContext(rtrCtx)

    const handleLogin = async (data: ILoginRequest) => {
        const res = await fetchLogin(data) as any;

        if (res) {
            // TODO avoid any
            const user = jwtDecode(res.accessToken) as any;
            spawnNotification({ type: "success", text: `Wellcome back, ${user.username}` });

            const tokenPair: TokenPair = { auth: res.accessToken, refresh: res.refreshToken }
            console.log("Using token pair: ", tokenPair)
            rtr.setPair(tokenPair);
        }
    }

    const handleRegister = async (data: IRegisterRequest) => {
        const res = await fetchRegister(data);

        if (res) {
            spawnNotification({ type: "success", text: "User Created." });
            // redirect to login
            setSelected("login");
        } else {
            spawnNotification({ type: "error", text: "Couldn't register.", timeout: 3000 })
        }

    }

    const RegisterInsteadButton = <a className="form-anchor" onClick={() => { setSelected("register") }}> Create an account instead </a>
    const LoginInsteadButton = <a className="form-anchor" onClick={() => { setSelected("login") }}> Login instead </a>

    return (
        <div>
            {selected === "login" ? <LoginForm switchButton={RegisterInsteadButton} onSubmit={handleLogin} /> :
                <RegisterForm switchButton={LoginInsteadButton} onSubmit={handleRegister} />}

        </div>
    )
}

interface ILoginProps {
    switchButton: any
    onSubmit: (data: ILoginRequest) => void
}

const LoginForm: React.FC<ILoginProps> = (props: ILoginProps) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = () => {
        if (!email || !password) {
            console.log("something is empty");
            return;
        }

        props.onSubmit({ email, password })
    }

    return (
        <form className="form">
            <label>Email</label>
            <input name="email" className="form-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input name="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ display: "grid", justifyContent: "center", rowGap: "10px", marginTop: "30px" }}>
                <Button onClick={handleSubmit} size="m"> LOGIN </Button>
                <ButtonOAuth type="google" size="m" clientId='285508928409-fd6e0j8b9bdavg8ce7fj461c1lc3tlmh.apps.googleusercontent.com' > GOOGLE </ButtonOAuth>
                <ButtonOAuth type="github" size="m" clientId='4435cbde88e940f962a9' > GITHUB </ButtonOAuth>
            </div>
            {props.switchButton}
        </form>
    )
}

interface IRegisterProps {
    switchButton: any
    onSubmit: (data: IRegisterRequest) => void
}
const RegisterForm: React.FC<IRegisterProps> = (props: IRegisterProps) => {
    const [email, setEmail] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = () => {
        if (!email || !username || !firstName || !lastName || !password) {
            console.log("something is empty");
            return;
        }

        props.onSubmit({ email, username, firstName, lastName, password })
    }

    return (
        <form className="form">
            <label>Email</label>
            <input name="email" className="form-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Username</label>
            <input name="username" className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>First Name</label>
            <input name="firstName" className="form-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label>Last Name</label>
            <input name="lastName" className="form-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label>Password</label>
            <input name="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ display: "grid", justifyContent: "center", marginTop: "30px" }}>
                <Button onClick={handleSubmit} size="m"> REGISTER </Button>
            </div>
            {props.switchButton}
        </form>
    )
}

export default Form;
