import { success, failure, serverFailure } from "./libs/response-lib";

export const main = async (event, context) => {
  const requestContextStage = event.requestContext
    ? event.requestContext.stage
    : "test";

  const paystackApiKey =
    requestContextStage === "test"
      ? process.env.TEST_SECRET_KEY
      : process.env.LIVE_SECRET_KEY;

  const paystack = require("paystack")(paystackApiKey);

  try {
    // parse data
    const jsonData = JSON.parse(event.body);
    // verify the event by fetching it from Paystack
    const txRef = jsonData.data.reference;
    const { status, message } = await paystack.transaction.verify(txRef);
    // status is type boolean
    const eventType = status ? jsonData.event : "failed.verification";

    let msg = "";
    let stage = requestContextStage;
    switch (eventType) {
      case "charge.success":
        msg = "Success! Paystack webhook incoming!";
        console.log(
          `Paystack Event: ${eventType} | Verify Message: ${message}`
        );
        return success({ msg, stage });
      case "failed.verification":
        msg = "Fail! Paystack webhook incoming!";
        console.log(
          `Paystack Event: ${eventType} | Verify Message: ${message}`
        );
        return failure({ msg, stage });
      default:
        break;
    }
  } catch (err) {
    return serverFailure(err.message || "Internal server error");
  }
};
