const cron = require("node-cron");
const Request = require("./models/WorkerCustomerRequest")
const moment = require("moment");

cron.schedule("*/3 * * * *", async () => {
  try {
    const now = moment();
    const allRequests = await Request.find({
      workerStatus: { $in: ["pending", "accepted"] }
    });

    for (let request of allRequests) {
      const [startTime] = request.timeSlot.split(" - ");
      const scheduled = moment(request.scheduleDate).set({
        hour: moment(startTime, ["h:mm A"]).hour(),
        minute: moment(startTime, ["h:mm A"]).minute()
      });

      if (now.isAfter(scheduled)) {
        if (request.workerStatus === "pending") {
          request.workerStatus = "cancelled";
        } else if (request.workerStatus === "accepted") {
          console.log(request.workerStatus)
          request.workerStatus = "completed";
        }
        await request.save();
      }
      console.log(`[CRON] Checked ${allRequests.length} requests at ${now.format('HH:mm:ss')}`);
    }
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});
