import { ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError } from 'twitter-api-v2';

const client = new TwitterApi({
    appKey: 'yTniIwV23Oi8K8EV4N2pBErET',
    appSecret: 'fQL7aJdcsBZ0kND8tMDsQPDlCjf8x4A70lQvwfcAmbJLa8pshg',
    accessToken: '468659308-YPjaHTasxeC94q2sPBil1PDyR7h3buSY0s6nGkJq',
    accessSecret: '2MNxRuGiUQ7c9UFrJZSyqUdKMAWVSIjREVm1I3XgNUFfX',
  });

const streaming = async () => {
    const stream = await client.v1.sampleStream();

    // Awaits for a tweet
    stream.on(
        // Emitted when Node.js {response} emits a 'error' event (contains its payload).
        ETwitterStreamEvent.ConnectionError,
        err => console.log('Connection error!', err),
    );

    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.'),
    );

    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        eventData => console.log('Twitter has sent something:', eventData),
    );

    stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
    );

    // Enable reconnect feature
    stream.autoReconnect = true;

    // Be sure to close the stream where you don't want to consume data anymore from it
    stream.close();
}

streaming()