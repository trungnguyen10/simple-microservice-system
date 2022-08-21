const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    const updatedComment = { ...data, status };

    axios
      .post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: updatedComment,
      })
      .catch((err) => console.log(err));

    res.sendStatus(200);
  }
});

app.listen(4003, () => {
  console.log('Comment moderation service is listening on port 4003');
});
