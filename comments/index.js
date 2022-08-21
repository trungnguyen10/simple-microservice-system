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

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    });
  } catch (err) {
    console.log('error sending to localhost:4005', err);
  }

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, status } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((x) => x.id === id);

    comment.status = status;

    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id: comment.id,
          content: comment.content,
          postId,
          status: comment.status,
        },
      })
      .catch((err) => console.log(err));
  }

  res.sendStatus(200);
});

app.listen(4001, () => {
  console.log('comments service is listening on port 4001');
});
