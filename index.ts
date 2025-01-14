import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';
import { Commitment, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { BUY_AMOUNT, JITO_MODE, PRIVATE_KEY, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, TARGET_ID, TWITTER_ACCESS_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_APP_KEY, TWITTER_APP_SECRET, TWITTER_TOKEN } from './constants';
import { getBuyTxWithJupiter } from './utils/swapOnlyAmm';
import { executeJitoTx } from './executor/jito';
import base58 = require('bs58');
import { execute } from './executor/legacy';

dotenv.config();


export const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY))
const jitoCommitment: Commitment = "confirmed"

const solanaConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment: "confirmed"
})

const client = new TwitterApi({
    appKey: TWITTER_APP_KEY,
    appSecret: TWITTER_APP_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
});

const getUserId = async (user_id: string) => {
    try {
        const res = await client.v2.userByUsername(user_id)
        return res.data.id
    } catch (error) {
        console.error("Fetching userId error => ", error)
    }
}


const main = async (target_id: string) => {
    try {
        const query = `from:${target_id} ("ca" OR "ca:" OR "ca;")`;

        console.log("🚀 ~ main ~ query:", query)
        const response = await axios.get(
            "https://api.twitter.com/2/tweets/search/recent",
            {
                headers: {
                    Authorization: `Bearer ${TWITTER_TOKEN}`,
                },
                params: {
                    query: query,
                    max_results: 10
                },
            }
        );

        for (let i = 0; i < response.data.data.length; i++) {
            const element = response.data.data[i];
            if (element.text.indexOf("RT @") > -1) continue;
            // Process the tweet as needed

            const text = element.text;

            // Regular expression to match the text after "Ca"
            const regex = /Ca (\S+)/;

            // Applying the regular expression to extract the text after "Ca"
            const match = text.match(regex);

            if (match) {
                // match[1] contains the text following "Ca"
                console.log("New Token Detected 'Ca':", match[1]);
                
                process.exit(1);
            } else {
                console.log("No match found.");
            }
        }

        // Check rate limit headers and wait if necessary
        //@ts-ignore
        const rateLimit = response.rateLimit;
        if (rateLimit && rateLimit.remaining === 0) {
            const waitTime = rateLimit.reset * 1000 - Date.now();
            console.log(`Rate limit reached. Waiting for ${waitTime / 1000} seconds`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
    } catch (error) {
        console.error("Error fetching tweets:", error);
    }
};

cron.schedule("*/15 * * * *", async () => {
    console.log("Calling every 15 minutes!");
    const userId = await getUserId(TARGET_ID);
    if (!userId) return
    await main(userId);
});