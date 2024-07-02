const slackService = require('../services/slackService');

exports.handleEvent = async (req, res) => {
  const { type, user_id, text, trigger_id } = req.body;

  if (type === 'url_verification') {
    return res.status(200).send(req.body.challenge);
  }

  if (type === 'event_callback') {
    const event = req.body.event;
    if (event.type === 'app_mention') {
      // Handle app mention event
    } else if (event.type === 'message') {
      // Handle message event
    }
  }

  if (req.body.command === '/approval-test') {
    try {
      await slackService.openApprovalModal(trigger_id);
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
};

exports.handleInteraction = async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const { type, user, trigger_id, actions } = payload;

  if (type === 'view_submission') {
    const approverId = payload.view.state.values.approver_block.approver_select.selected_user;
    const approvalText = payload.view.state.values.text_block.approval_text.value;
    await slackService.sendApprovalRequest(user.id, approverId, approvalText);
    return res.status(200).send();
  }

  if (type === 'block_actions') {
    const actionId = actions[0].action_id;
    const requesterId = payload.message.metadata.requester_id;

    if (actionId === 'approve') {
      await slackService.notifyRequester(requesterId, 'approved');
    } else if (actionId === 'reject') {
      await slackService.notifyRequester(requesterId, 'rejected');
    }
    return res.status(200).send();
  }

  res.status(400).send();
};
