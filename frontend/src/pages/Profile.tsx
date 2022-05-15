import React, { FC, useEffect, useState } from "react";
import Layout from "src/components/Layout";

import "src/styles/profile.css";
import "src/styles/form.css";

import { useQuery } from "react-query";
import { getUserProfile } from "src/common/React/api/query/user";
import Button from "src/common/React/components/Button";
import { rtr } from '../services/authService'

const Home: FC = () => {
    const getProfile = React.useCallback(() => {
        const token = rtr.session.get()?.get()
        if (!token) return undefined
        return getUserProfile(token)
    }, [])
    const { data: user, refetch } = useQuery("users", getProfile);
    useEffect(() => {
        console.log("Setting title")
        document.title = "Tenabl";
        return rtr.session.changed(() => refetch())
    }, [refetch]);

    useEffect(() => {
        console.log("USER CHANGED!");
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setUsername(user?.username || "");
    }, [user])

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [password, setPassword] = useState("");

    return (
        <>
            <Layout requireAuthentication={true}>
                <div className="profile-container">
                    <form className="form--profile">

                        <div className="form-fname">
                            <label> First Name </label>
                            <input className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>

                        <div className="form-lname">
                            <label> Last Name </label>
                            <input className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>

                        <div className="form-email">
                            <label> Email </label>
                            <input className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="form-password">
                            <label> Password </label>
                            <input className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div className="form-cancel">
                            <Button onClick={() => console.log("cancel")} size="l"> Cancel </Button>
                        </div>

                        <div className="form-save">
                            <Button onClick={() => console.log("save")} size="l"> Save </Button>
                        </div>

                    </form>
                </div>
            </Layout>
        </>
    );
};

export default Home;
