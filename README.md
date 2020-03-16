Install dependencies

    npm install

Create .env and add AWS credentials

    AWS_ACCESS_KEY=XXXXXXXX
    AWS_SECRET_KEY=XXXXXXXX

Run `node index.js`

    $ node index.js
    ? Enter Member ID to target 123456

Or run with environment variable `MEMBERID=123456 node index.js`

Terminal will scroll through messages from the front of the queue. Deleted messages
will be marked as `DELETE:`.

               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:2750 queueId:178536
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:5319 queueId:178535
    DELETE:    cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:123456 queueId:178595
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:2750 queueId:178536
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:5319 queueId:178535
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:2750 queueId:178536
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:5319 queueId:178535
               cmd:com.sesamecom.messaging.event.send.queue.email.SendCustomVisitorEmail memberId:2750 queueId:178536

When `DELETE:` does not appear in the list for 30 seconds then terminate the script.
This script is not intended to run through the whole queue as that isn't possible.
It will only process messages at the head of the queue.
