const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const axios = require('axios');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// sends to a page allowing you to input the tracking #
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/main.html'));
});

app.get('/tracking/:id', (urlreq, urlres) => {

    // info to pass to USPS oauth 
    const data = {
        "username": process.env.USPSID,
        "password": process.env.USPSPWD,
        "grant_type": "authorization",
        "response_type": "token",
        "scope": "user.info.ereg,iv1.apis",
        "client_id": "687b8a36-db61-42f7-83f7-11c79bf7785e"
    };

    axios.post('https://services.usps.com/oauth/authenticate', data)
        .then((res)=> {
            // console.log(`Status: ${res.status}`);
            // console.log('Body: ', res.data); 

            // console.log(res.data['access_token'])

            // create the auth header
            const config = "Authorization: Bearer " + res.data['access_token'] 

            // send POST to get info on the mailpiece being tracked
            axios.post('https://iv.usps.com/ivws_api/informedvisapi/api/mt/get/piece/imb/' + urlreq.params.id, {}, {headers: {
                'Authorization': 'Bearer ' + res.data['access_token']
            }})
                .then((res)=> {
                    console.log(`Status: ${res.status}`);
                    console.log('Body: ', res.data);
                    // console.log(res.data['data']['scans']);

                    track = res.data['data'];
                    
                    // convert each time from timestamp to human readable
                    for (i=0; i< track.scans.length; i++) {
                        time = new Date(track.scans[i].scan_date_time).toString();
                        track.scans[i].scan_date_time = time;

                        console.log(track.scans[i].scan_date_time);
                    }

                    // provide info to ejs template
                    urlres.render("main", { 
                        mail_class: track.mail_class,
                        delivery: track.expected_delivery_date,
                        imb: track.imb,
                        tracking: track.scans,
                    });

                    console.log(track.scans);
                    
                }).catch((err) => {
                    console.error(err);
            });
            
        }).catch((err) => {
            console.error(err);
        });
            
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
