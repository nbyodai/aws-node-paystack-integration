"use strict";

const config = {
  paystack: {
    test_sk: "pk_test_3cd3786a478961c06c92fc99df625d5fbf952e57",
    live_sk: "sk_live_XXXXXXXXXXXXXXXXXXXXXXXX"
  }
};

export async function main(event, context, callback) {
  const requestContextStage = event.requestContext
    ? event.requestContext.stage
    : "test";

  const paystackApiKey =
    requestContextStage === "test"
      ? config.paystack.test_sk
      : config.paystack.live_sk;

  const paystack = require("paystack")(paystackApiKey);

  try {
    // parse data
    const jsonData = JSON.parse(event.body);

    // verify the event buy fetching it from Paystack
    // console.log("Paystack Event: %j", jsonData);
    const { status, data } = await paystack.transaction.verify(
      jsonData.data.reference
    );

    const eventType = status ? jsonData.event : "";
    let response = {};
    console.log(`Paystack Event: ${eventType}`);
    switch (eventType) {
      case "charge.success":
        response = {
          statusCode: 200,
          body: JSON.stringify({
            message: "Success! Paystack webhook incoming!",
            stage: requestContextStage
          })
        };
        break;
      default:
        response = {
          statusCode: 400,
          body: JSON.stringify({
            message: "Fail! Paystack webhook incoming!",
            stage: requestContextStage
          })
        };
        break;
    }
    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Internal server error"
    });
  }
}
