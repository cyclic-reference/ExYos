const {generateResponse} = require('../src/ResponseGenerator');

const BASE_REQUEST = {
  'token': 'gIkuvaNzQIHg97ATvDxqgjtO',
  'team_id': 'T0001',
  'team_domain': 'example',
  'enterprise_id': 'E0001',
  'enterprise_name': 'Globular%20Construct%20Inc',
  'channel_id': 'C2147483705',
  'channel_name': 'test',
  'user_id': 'U2147483697',
  'user_name': 'Steve',
  'command': '/weather',
  'text': 'flip Thanks Obama',
  'response_url': 'https://hooks.slack.com/commands/1234/5678',
  'trigger_id': '13345224609.738474920.8088930838d88f008e0',
};

describe('ResponseGenerator', () => {
  describe('generateResponse', () => {

    it('should reject when not given a slack request', () => {
      const headers = {};
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST
        }
      };
      const result = generateResponse(request);
      return expect(result).rejects.toEqual("Not a Slack Request")
    });


    it('should return usage when given an unknown command', () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'doabarrelroll'
        }
      };
      const result = generateResponse(request);
      return expect(result).resolves.toEqual({
        "exyosResponse": {
          "attachments": [{"text": "Available Commands: flip, unflip"}],
          "response_type": "ephemeral",
          "text": "Usage: <Command> <Argument>"
        }, "slackUrl": "https://hooks.slack.com/commands/1234/5678"
      })
    });

    it('should return flipped phrase when given phrase to flip', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('(╯°□°)╯︵ɐɯɐqO sʞuɐɥ┴');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return unflipped phrase when given phrase to unflip', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'unflip Thanks Obama'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('Thanks Obamaノ(º _ ºノ)');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return flipped table when told to flip table', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -table'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('(╯°□°)╯︵┻━┻');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return raged phrase flipping when told to flip phrase ragefully', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -rage Thanks Obama'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(text).toEqual('(╯ಠ益ಠ)╯彡ɐɯɐqO sʞuɐɥ┴');
      expect(response_type).toEqual("in_channel");
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return raged phrase flipping when told to flip phrase ragefully (after phrase)', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip Thanks Obama -rage'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(text).toEqual('(╯ಠ益ಠ)╯彡ɐɯɐqO sʞuɐɥ┴');
      expect(response_type).toEqual("in_channel");
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return raged flipped table when told to flip table ragefully', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -table -rage'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('(╯ಠ益ಠ)╯彡┻━┻');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return raged flipped table when told to flip table ragefully arguments permuted', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -rage -table'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('(╯ಠ益ಠ)╯彡┻━┻');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return flipped table when told to flip table and ignore anything else', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -table Thanks Obama'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('(╯°□°)╯︵┻━┻');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return unflipped table when told to unflip table', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'unflip -table'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('┳━┳ノ(º _ ºノ)');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return unflipped table when told to unflip table and ignore anything else', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'unflip -table Thanks Obama'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('<@U2147483697>');
      expect(response_type).toEqual("in_channel");
      expect(text).toEqual('┳━┳ノ(º _ ºノ)');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return help response when given bad flip argument', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'flip -loaded-god-complex-cock-it-and-pull-it'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('Available Arguments: -table');
      expect(response_type).toEqual("ephemeral");
      expect(text).toEqual('Unknown Argument: -loaded-god-complex-cock-it-and-pull-it');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });

    it('should return help response when given bad unflip argument', async () => {
      const headers = {
        'X-Slack-Request-Timestamp': 'aoeu'
      };
      const request = {
        header: header => headers[header],
        body: {
          ...BASE_REQUEST,
          text: 'unflip -wee-wee-weapon'
        }
      };
      const {exyosResponse : { attachments, response_type, text }, slackUrl} = await generateResponse(request);
      expect(attachments[0].text).toContain('Available Arguments: -table');
      expect(response_type).toEqual("ephemeral");
      expect(text).toEqual('Unknown Argument: -wee-wee-weapon');
      expect(slackUrl).toEqual('https://hooks.slack.com/commands/1234/5678');
    });
  });
});