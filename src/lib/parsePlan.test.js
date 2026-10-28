import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseProjectPlanFile, getDefaultItems } from "./parsePlan.js";

test("project plan parsing and defaults", async (t) => {
  await t.test("provides default items when requested", () => {
    const items = getDefaultItems();
    assert.equal(Array.isArray(items), true);
    assert.ok(items.length >= 10);
    assert.equal(items.some((i) => i.isMilestone), true);
    assert.equal(items.some((i) => i.isGroup), true);
    assert.equal(items.some((i) => i.isSubtask), true);
  });

  await t.test("parses CSV project plan content", async () => {
    const csvContent =
      "Task,Owner,Start Date,End Date,Duration,Status,Progress,Related Milestones\n" +
      "Requirements,Priya Shah,2026-10-27,2026-10-30,4 days,In Progress,75,Requirements Sign-off\n" +
      "Dev Milestone,Priya Shah,2026-11-13,2026-11-13,Milestone,In Progress,50,Development";

    const mockFile = {
      name: "Customer_Onboarding_Plan.csv",
      text: async () => csvContent
    };

    const result = await parseProjectPlanFile(mockFile);
    assert.equal(result.name, "Customer Onboarding Plan");
    assert.equal(result.fn, "Enterprise Services");
    assert.ok(result.projectPlan.items.length >= 2);
  });

  await t.test("parses actual AXIOM xlsx spreadsheet file if available", async () => {
    const samplePath =
      "C:/Users/b.dinesh/.gemini/antigravity/brain/a3e3da76-267a-4c4e-bd8e-004708145f8b/.user_uploaded/media_1793194529756_f843d783.xlsx";
    if (fs.existsSync(samplePath)) {
      const buffer = fs.readFileSync(samplePath);
      const mockFile = {
        name: "AXIOM_Project_Plan_Wireframe_(1)_1.xlsx",
        arrayBuffer: async () =>
          buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      };

      const result = await parseProjectPlanFile(mockFile);
      assert.equal(result.name, "AXIOM Project Plan Wireframe 1");
      assert.equal(result.fn, "Enterprise Services");
      assert.ok(result.businessProblem.includes("Plan and track tasks"));
      assert.equal(result.projectPlan.stats.totalTasks, 24);
      assert.equal(result.projectPlan.stats.completed, 8);
      assert.equal(result.projectPlan.stats.inProgress, 10);
      assert.equal(result.projectPlan.stats.overdue, 2);
      assert.equal(result.projectPlan.stats.milestones, 4);
      assert.ok(result.projectPlan.items.length >= 10);
    }
  });
});

