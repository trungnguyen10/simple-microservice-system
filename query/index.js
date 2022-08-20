const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, postId } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    for (const property in comment) {
      comment[property] = data[property];
    }
  }

  res.sendStatus(200);
});

app.listen(4002, () => {
  console.log('query service is listening on port 4002');
});
