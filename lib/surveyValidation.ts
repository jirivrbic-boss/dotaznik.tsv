import type { SurveyAnswers } from "./surveyTypes";
import type { SurveyStep } from "./surveyTypes";

export function isStepComplete(step: SurveyStep, answers: SurveyAnswers): boolean {
  const v = answers[step.id];
  switch (step.kind) {
    case "radio":
      return typeof v === "string" && v.length > 0;
    case "radio_other": {
      if (typeof v !== "string" || !v) return false;
      if (v === step.otherValue) {
        const o = answers[`${step.id}_other`];
        return typeof o === "string" && o.trim().length > 0;
      }
      return true;
    }
    case "checkbox":
      return Array.isArray(v) && v.length > 0;
    case "rating":
      return typeof v === "number" && v >= 1 && v <= (step.max ?? 5);
    case "textarea":
      return true;
    case "rating_or_skip":
      return (
        v === step.skipValue ||
        (typeof v === "number" && v >= 1 && v <= (step.max ?? 5))
      );
    default:
      return false;
  }
}
