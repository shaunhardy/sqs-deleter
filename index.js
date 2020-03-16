const AWS = require('aws-sdk')
const dotenv = require('dotenv');
const inquirer = require('inquirer');

dotenv.config();

let awsAccessKey = process.env.AWS_ACCESS_KEY;
let awsSecretKey = process.env.AWS_SECRET_KEY;
let targetMemberId = process.env.MEMBER_ID;

inquirer.prompt([
    {
        type: 'input',
        name: 'memberId',
        message: 'Enter Member ID to target',
        when: (answers) => { return !targetMemberId; }
    },
    {
        type: 'password',
        name: 'awsAccessKey',
        message: 'AWS Access Key',
        when: (answers) => { return !awsAccessKey; }
    },
    {
        type: 'password',
        name: 'awsSecretKey',
        message: 'Aws Secret Key',
        when: (answers) => { return !awsSecretKey; }
    }
]).then(answers => {

    targetMemberId = targetMemberId || answers['memberId'];
    awsAccessKey = awsAccessKey || answers['awsAccessKey'];
    awsSecretKey = awsSecretKey || answers['awsSecretKey'];

    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        region: 'us-east-1',
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
    });

    query(sqs).then(() => {
        console.log('completed.');
    });
});

async function query(sqs) {
    let messages = [];

    const { QueueUrl } = await sqs.getQueueUrl({ QueueName: 'prd-cluster-2-QueueSendServiceEmailEvent' }).promise();

    do {
        try {
            messages = await sqs.receiveMessage({
                QueueUrl: QueueUrl,
                MaxNumberOfMessages: 10
            }).promise();

            messages.Messages.forEach((msg) => {
                let body = JSON.parse(msg.Body);
                let cmd = body["@command"];
                let memberId = body["memberId"];
                let queueId = body["queueId"];
                let rcpt = msg.ReceiptHandle;

                if (cmd === 'com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail' &&
                    memberId === targetMemberId
                ) {
                    console.log(`DELETE:    cmd:${cmd} memberId:${memberId} queueId:${queueId}`);

                    sqs.deleteMessage({ QueueUrl: QueueUrl, ReceiptHandle: rcpt }, (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                } else {
                    console.log(`           cmd:${cmd} memberId:${memberId} queueId:${queueId}`);
                }
            });

        } catch (e) {
            console.error(e);
            console.log(msg);
            process.exit(1);
        }
    } while (messages.Messages && messages.Messages.length > 0);
}
