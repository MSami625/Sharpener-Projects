const Sib = require("sib-api-v3-sdk");

const defaultClient = Sib.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


const apiInstance = new Sib.TransactionalEmailsApi();

exports.sendEmail = async (req, res) => {
  const  recipientEmail  = req.body.email;

  if (!recipientEmail) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are missing'
    });
  }

  try {
    const response = await apiInstance.sendTransacEmail({
      to: [{ email: recipientEmail }],
      sender: { email: 'expensetracker-customersupport@gmail.com', name: 'Expense Tracker' },
      subject: 'Password Reset Request',
      htmlContent: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                background: #f4f4f4;
                border-radius: 8px;
              }
              h2 {
                color: #007bff;
              }
              p {
                margin: 0 0 10px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                color: #fff;
                background: #007bff;
                text-decoration: none;
                border-radius: 5px;
              }
              .button:hover {
                background: #0056b3;
              }
              .footer {
                font-size: 0.8em;
                color: #888;
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Password Reset Request</h2>
              
              <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
           
              <p>If you did not request this, please ignore this email.</p>
              <p>Thank you,</p>
              <p>The Expense Tracker Team</p>
              <div class="footer">
                <p>Expense Tracker</p>
                <p>1234 Expense Lane, Suite 100, Finance City, 12345</p>
                <p><a href="[UNSUBSCRIBE_LINK]" class="button">Unsubscribe</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log('Email sent successfully:', response);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
};
