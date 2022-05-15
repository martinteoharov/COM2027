import { OAuth2Client } from 'google-auth-library';
import { EntityManager } from 'typeorm';
import { OAuthModel } from '../db/entities/OAuthModel';
import { UserModel } from '../db/entities/UserModel';
import axios from 'axios';
import { AuthError } from './jwt';
import { UserService } from './user';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_SECRET;

export interface OauthService {
    // Login user using Google OAuth 2
    googleLogin(token: string): Promise<UserModel>
    githubLogin(token: string): Promise<UserModel>
}

export function oauthService(
    users: UserService,
    entities: EntityManager
): OauthService {
    return {
        async googleLogin(token) {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (payload === undefined){
                throw new AuthError('Login unsuccessful')
            }
            if (payload['email'] == undefined) {
                throw new AuthError('Required permission not given')
            }
            const firstName = payload['given_name'] ?? ''
            const lastName = payload['family_name'] ?? ''
            // Try to locate existing user
            const googleOAuth = await entities.findOne(OAuthModel, { google_auth_sub: payload['sub'] });
            if (googleOAuth) return await entities.findOneOrFail(UserModel, googleOAuth.user);
            // If first login
            const username = await users.generateName(firstName, lastName);
            const user = await users.create({
                  firstName, lastName,
                  email: payload['email'],
                  username
            })
            const oauthData = new OAuthModel();
            oauthData.user = user.id;
            oauthData.google_auth_sub = payload['sub'];
            await entities.save(oauthData)
            return user
        },
        async githubLogin(token) {
            try {
                const authResponse = await axios({
                    method: 'post',
                    url: `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubSecret}&code=${token}`,
                    headers: {
                        accept: 'application/json'
                    }
                })
                const accessToken = authResponse.data.access_token

                // Fetch the user info
                try {
                    const userInfoResponse = await axios({
                        method: 'get',
                        url: `https://api.github.com/user`,
                        headers: {
                            Authorization: 'token ' + accessToken
                        }
                    })
                    const githubOAuth = await entities.findOne(OAuthModel, { github_auth_username: userInfoResponse.data.username });

                    if (githubOAuth) return await entities.findOneOrFail(UserModel, githubOAuth.user);
                    const name:string = userInfoResponse.data.name
                    const [firstName, lastName] = name.split(' ', 2);
                    const user = await users.create({
                        firstName, lastName,
                        email: userInfoResponse.data.email,
                        username: userInfoResponse.data.username
                    });
                    const oauthData = new OAuthModel();
                    oauthData.user = user.id;
                    oauthData.github_auth_username = userInfoResponse.data.username;
                    await entities.save(oauthData);
                    return user;
                } catch {
                    throw new Error("GitHub profile permissions not given")
                }
            } catch(e) {
                throw new AuthError('Invalid token')
            }
        }
    }
}
