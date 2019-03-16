"use strict";
import { success, failure, serverFailure } from "./libs/response-lib";

export async function main(event, context) {
  console.log({ context });
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
    // verify the event buy fetching it from Paystack
    // console.log("Paystack Event: %j", jsonData);
    const { status, data } = await paystack.transaction.verify(
      jsonData.data.reference
    );
    const eventType = status ? jsonData.event : "failed.verification";
    console.log(`Paystack Event: ${eventType}`);

    let message = "";
    let stage = requestContextStage;
    switch (eventType) {
      case "charge.success":
        message = "Success! Paystack webhook incoming!";
        return success({ message, stage });
      case "failed.verification":
        message = "Fail! Paystack webhook incoming!";
        return failure({ message, stage });
      default:
        break;
    }
  } catch (err) {
    return serverFailure(err.message || "Internal server error");
  }
}
