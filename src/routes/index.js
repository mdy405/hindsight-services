import pkg from "express";
const { Router } = pkg;

import AuthRouter from "./auth.js";
import Insights from "./insights.js";
import Positions from "./positions.js";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/auth", AuthRouter);
router.use("/insights", Insights);
router.use("/positions", Positions);
// Export the base-router
export default router;
