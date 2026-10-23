"use client";
import dynamic from "next/dynamic";

/** Below-the-fold interactive panels. Declared in a client module so webpack splits them out of the
 *  page's first-load JavaScript; the HTML is still server-rendered and the script arrives after paint. */
export const LazyLoopExplorer = dynamic(() => import("./LoopExplorer").then((m) => m.LoopExplorer));
export const LazyWorkflowAssessment = dynamic(() => import("./WorkflowAssessment").then((m) => m.WorkflowAssessment));
