const cron = require("node-cron");
const Request = require("./models/WorkerCustomerRequest");
const moment = require("moment");
const updateWorkerAvailability = require("./utils/updateWorkerAvailability");

cron.schedule("*/30 * * * * *", async () => {
  try {
    const now = moment();
    const allRequests = await Request.find({
      workerStatus: { $in: ["pending", "accepted"] }
    });

    console.log(`[CRON] Found ${allRequests.length} requests to check at ${now.format('HH:mm:ss')}`);

    for (let request of allRequests) {
      const [startTime] = request.timeSlot.split(" - ");
      const scheduled = moment(request.scheduleDate).set({
        hour: moment(startTime, ["h:mm A"]).hour(),
        minute: moment(startTime, ["h:mm A"]).minute()
      });

      if (now.isAfter(scheduled)) {
        if (request.workerStatus === "pending") {
          request.workerStatus = "cancelled";
          console.log(`[CRON] Request ${request._id} was pending and is now cancelled`);
        } else if (request.workerStatus === "accepted") {
          request.workerStatus = "completed";
          console.log(`[CRON] Request ${request._id} was accepted and is now completed`);

          await request.save();

          await updateWorkerAvailability(request.workerId);

          continue; // Already saved, skip next save
        }

        await request.save(); // Save for 'pending' or remaining cases
      }
    }

  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});
