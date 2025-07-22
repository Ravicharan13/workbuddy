const Worker = require("../models/WorkerSignUp");
const Request = require("../models/WorkerCustomerRequest");

const updateWorkerAvailability = async (workerId) => {
  try {
    const activeRequests = await Request.countDocuments({
      workerId,
      workerStatus: "accepted" // Only count still-active requests
    });

    const availability = activeRequests >= 3 ? "unavailable" : "available";

    const updated = await Worker.findByIdAndUpdate(workerId, {
      workerAvailability: availability
    });

    console.log(`[UPDATE] Worker ${workerId}: ${activeRequests} accepted requests, now marked as ${availability}`);
  } catch (error) {
    console.error(`[ERROR] Updating worker availability failed for ${workerId}:`, error.message);
  }
};

module.exports = updateWorkerAvailability;
