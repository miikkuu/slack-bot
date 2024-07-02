const axios = require('axios');
const qs = require('qs');
const { SLACK_BOT_TOKEN } = process.env;

const slackApiUrl = 'https://slack.com/api';

exports.openApprovalModal = async (trigger_id) => {
  const modalView = {
    "type": "modal",
    "callback_id": "approval_modal",
    "title": {
      "type": "plain_text",
      "text": "Request Approval"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "approver_block",
        "label": {
          "type": "plain_text",
          "text": "Select Approver"
        },
        "element": {
          "type": "users_select",
          "action_id": "approver_select"
        }
      },
      {
        "type": "input",
        "block_id": "text_block",
        "label": {
          "type": "plain_text",
          "text": "Approval Text"
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "approval_text",
          "multiline": true
        }
      }
    ],
    "submit": {
      "type": "plain_text",
      "text": "Submit"
    }
  };

  await axios.post(`${slackApiUrl}/views.open`, qs.stringify({
    token: SLACK_BOT_TOKEN,
    trigger_id,
    view: JSON.stringify(modalView)
  }));
};

exports.sendApprovalRequest = async (requesterId, approverId, approvalText) => {
  const message = {
    "channel": approverId,
    "text": `Approval request from <@${requesterId}>`,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Approval request from <@${requesterId}>*\n\n${approvalText}`
        }
      },
      {
        "type": "actions",
        "block_id": "approval_actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Approve"
            },
            "style": "primary",
            "action_id": "approve"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Reject"
            },
            "style": "danger",
            "action_id": "reject"
          }
        ]
      }
    ],
    "metadata": {
      "event_type": "approval_request",
      "requester_id": requesterId
    }
  };

  await axios.post(`${slackApiUrl}/chat.postMessage`, qs.stringify({
    token: SLACK_BOT_TOKEN,
    channel: approverId,
    text: message.text,
    blocks: JSON.stringify(message.blocks)
  }));
};

exports.notifyRequester = async (requesterId, status) => {
  const message = `Your approval request has been ${status}.`;
  await axios.post(`${slackApiUrl}/chat.postMessage`, qs.stringify({
    token: SLACK_BOT_TOKEN,
    channel: requesterId,
    text: message
  }));
};
