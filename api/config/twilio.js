import twilio from 'twilio';

// Initialize Twilio client with environment variables
const initTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('⚠️ Twilio credentials missing in environment variables');
    return null;
  }

  return twilio(accountSid, authToken);
};

export const twilioClient = initTwilioClient();

// Utility function to send SMS
export const sendSMS = async (toPhoneNumber, messageBody) => {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Check your environment variables.');
  }

  try {
    const message = await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber,
    });

    return {
      success: true,
      messageSid: message.sid,
      message: 'SMS sent successfully',
    };
  } catch (error) {
    console.error('Twilio SMS error:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
