const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// AWS configuration
AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: 'AKIAYOA2ZBSYCR4DDCVA',
  secretAccessKey: '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'
});

// Create an instance of DynamoDB
const dynamoDB = new AWS.DynamoDB();

// Define the API routes
app.post('/api/vips', (req, res) => {
  // Extract the VIP registration data from the request body
  const { name, email, company } = req.body;

  // Create a unique identifier for the VIP attendee
  const attendeeId = Date.now().toString();

  // Create a DynamoDB item with the VIP attendee details
  const params = {
    TableName: 'vip_attendees',
    Item: {
      AttendeeId: { S: attendeeId },
      Name: { S: name },
      Email: { S: email },
      Company: { S: company },
    },
  };

  // Put the item into the DynamoDB table
  dynamoDB.putItem(params, (err, data) => {
    if (err) {
      console.error('Error adding VIP attendee to DynamoDB:', err);
      res.status(500).json({ error: 'Failed to register VIP attendee' });
    } else {
      res.json({ attendeeId, name, email, company });
    }
  });
});

app.get('/api/vips', (req, res) => {
  // Scan the DynamoDB table to retrieve all VIP attendees
  const params = {
    TableName: 'vip_attendees',
  };

  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error retrieving VIP attendees from DynamoDB:', err);
      res.status(500).json({ error: 'Failed to fetch VIP attendees' });
    } else {
      const attendees = data.Items.map(item => {
        return {
          attendeeId: item.AttendeeId.S,
          name: item.Name.S,
          email: item.Email.S,
          company: item.Company.S,
        };
      });
      res.json(attendees);
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});