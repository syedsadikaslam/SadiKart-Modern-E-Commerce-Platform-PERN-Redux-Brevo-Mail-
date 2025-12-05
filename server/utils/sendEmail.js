import brevo from "@getbrevo/brevo";

export const sendEmail = async ({ email, subject, message }) => {
  const apiInstance = new brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = message;
  sendSmtpEmail.sender = { email: process.env.BREVO_SENDER };
  sendSmtpEmail.to = [{ email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email Sent Successfully");
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw new Error("Email could not be sent.");
  }
};
