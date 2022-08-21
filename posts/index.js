const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  try {
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: { id, title },
    });
  } catch (err) {
    console.log('error sending to event-bus', err);
  }

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Event received:', req.body.type);
  res.sendStatus(200);
});

app.listen(4000, () => {
  console.log('post service is listening on port 4000');
});
