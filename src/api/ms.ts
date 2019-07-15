import express from 'express';
import qs from 'qs';
import axios from 'axios';
import config from '../../extra/bit/config';
import {Client} from '@microsoft/microsoft-graph-client';
import {ImplicitMSALAuthenticationProvider} from '@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider';
import {UserAgentApplication} from 'msal';
import {MSALAuthenticationProviderOptions} from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';


// const msalConfig = {
//     auth: {
//         clientId: 'c5cfd45a-3146-4921-bdef-16c4962aaee3', // Client Id of the registered application
//         redirectUri: 'http://localhost:3000/auth',
//     },
// };
// const graphScopes = ['user.read', 'mail.send']; // An array of graph scopes
// const msalApplication = new UserAgentApplication(msalConfig);
// const options = new MSALAuthenticationProviderOptions(graphScopes);
// const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);
// const client =  Client.initWithMiddleware({
//     authProvider
// });
export async function getNoteList(req: express.Request, res: express.Response) {
    try {
        // let userDetails = await client.api('/me').get();
        // console.log(userDetails);
        // console.log('12345', userDetails);
        const request = require('request');

        const endpoint = `https://login.microsoftonline.com/${config.Ms.new_tenant_id}/oauth2/v2.0/token`;
        const requestParams = {
            grant_type: 'client_credentials',
            scope: 'https://graph.microsoft.com/.default',
            client_id: config.Ms.new_client_id,
            client_secret: config.Ms.new_client_secret,
        };
        let data = await axios.request({
            url: endpoint,
            data: qs.stringify(requestParams),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        // request.post({ url: endpoint, form: requestParams }, function (err, response, body) {
        //     if (err) {
        //         console.log('err', err);
        //     } else {
        //         console.log('Body=' + body);
        //         let parsedBody = JSON.parse(body);
        //         if (parsedBody.error_description) {
        //             console.log('Error=' + parsedBody.error_description);
        //         } else {
        //             console.log('Access Token=' + parsedBody.access_token);
        //             res.status(200).json(parsedBody);
        //         }
        //     }
        // });

        // request.get({
        //         url: 'https://graph.microsoft.com/v1.0/users',
        //         headers: {
        //             'Authorization': 'Bearer ' + String(data.data.access_token),
        //             'Host': 'graph.microsoft.com'
        //         }
        // }, function(err, response, body) {
        //     console.log(body);
        // });

        let user = await axios.request({
            method: 'get',
            // url: 'https://graph.microsoft.com/v1.0/users',
            url: 'https://graph.microsoft.com/beta/users/4b7909ad-597f-4515-a880-4b6ff54d3ba1/onenote/notebooks',
            // url: 'https://graph.microsoft.com/v1.0/me/onenote/notebooks',
            headers: {
                'Authorization': 'Bearer ' + data.data.access_token,
                'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8',
                // 'Accept': 'application/json'
            }
        });
        console.log(data.data.access_token);
        res.status(200).json(user.data);
    } catch (err) {
        console.log('err:', err);
        res.sendStatus(500);
    }
}
