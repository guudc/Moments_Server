/* EXTERNAL API REQUESTS
Author: COAT
Created: 10-03-24
*/
const axios = require('axios')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../../data");

/** Authenticate using google oAuth2
 * params {accessCode|String}
 * returns {status|bool, userData|JSON}
 */
exports.googleAuth = async (accessCode = "") => {
    if(accessCode != "") {
        try{
            // Exchange the authorization code for an access token
            const response = await axios.post(
                'https://oauth2.googleapis.com/token',
                {
                code: accessCode,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: 'postmessage',
                grant_type: 'authorization_code'
                }
            );
            const accessToken = response.data.access_token;
            // Fetch user details using the access token
            const userResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            userResponse.data.authToken = accessToken
            return {status: true, userData: userResponse.data};
        }
        catch(e) {
            return {status:false, err: e.message}
        } 
    }
    return {status:false, err: 'No code present'}
}