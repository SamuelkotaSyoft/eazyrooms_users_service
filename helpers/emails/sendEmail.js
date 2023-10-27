import axios from "axios";

export default async function sendEmail({
  email,
  subject,
  templateName,
  variables,
  authToken = null,
}) {
  let axiosConfig = {
    email: email,
    subject: subject,
    templateName: templateName,
    variables: variables,
  };

  if (authToken) {
    axiosConfig.headers = {
      "eazyrooms-token": authToken,
    };
  }

  let res = await axios.post(
    `${process.env.CAMPAIGNS_SERVICE_URL}/sendTransactionalEmail`,
    axiosConfig
  );

  return res.data;
}
