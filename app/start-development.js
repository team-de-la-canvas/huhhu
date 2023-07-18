const jq = require("node-jq")
const axios = require("axios");
const { execSync } = require('child_process');
const sleep = require('sleep-promise');

async function delayedStart() {
    await sleep(5000);

    axios.get("http://127.0.0.1:4040/api/tunnels")
        .then(response => {
            const data = response.data; // Extract the data from the response
            jq.run('.tunnels[0].public_url', data, { input: 'json' }).then(result => {
                const url = result.replace("\"","").replace("\"","");
                console.log("Using API_URL: ",url)
                execSync(`cross-env API_URL=${url} expo start --tunnel --web`, { stdio: 'inherit', shell: true });
            });
        })
        .catch(error=>{
            console.error('Error fetching Ngrok URL:', error);
        })
}

delayedStart();
