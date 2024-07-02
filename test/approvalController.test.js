const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const slackRoutes = require('../src/routes/slackRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/slack', slackRoutes);

describe('Slack Bot Endpoints', () => {
  it('should handle slash command', async () => {
    const res = await request(app)
      .post('/slack/events')
      .send({ command: '/approval-test', trigger_id: 'test_trigger_id' });
    expect(res.statusCode).toEqual(200);
  });

  it('should handle interaction', async () => {
    const res = await request(app)
      .post('/slack/interactions')
      .send({ payload: JSON.stringify({ type: 'view_submission', view: { state: { values: { approver_block: { approver_select: { selected_user: 'U123' } }, text_block: { approval_text: { value: 'Test approval' } } } } }, user: { id: 'U456' } }) });
    expect(res.statusCode).toEqual(200);
  });
});
