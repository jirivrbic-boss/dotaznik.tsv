"use client";

import type { SurveyAnswers, SurveyStep } from "@/lib/surveyTypes";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  step: SurveyStep;
  answers: SurveyAnswers;
  setAnswers: (next: SurveyAnswers) => void;
};

export function SurveyStepForm({ step, answers, setAnswers }: Props) {
  const patch = (partial: SurveyAnswers) =>
    setAnswers({ ...answers, ...partial });

  switch (step.kind) {
    case "radio":
      return (
        <div className="flex flex-col gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                answers[step.id] === opt.value
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 hover:border-arena-orange/50"
              }`}
            >
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={answers[step.id] === opt.value}
                onChange={() => patch({ [step.id]: opt.value })}
                className="h-4 w-4 accent-arena-neon"
              />
              <span className="text-sm text-white">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case "radio_other": {
      const selected = answers[step.id] as string | undefined;
      const otherKey = `${step.id}_other` as keyof SurveyAnswers;
      return (
        <div className="flex flex-col gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                selected === opt.value
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 hover:border-arena-orange/50"
              }`}
            >
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => patch({ [step.id]: opt.value })}
                className="h-4 w-4 accent-arena-neon"
              />
              <span className="text-sm text-white">{opt.label}</span>
            </label>
          ))}
          {selected === step.otherValue && (
            <Input
              placeholder={step.otherPlaceholder ?? "Upřesni…"}
              value={(answers[otherKey] as string) ?? ""}
              onChange={(e) => patch({ [otherKey]: e.target.value })}
            />
          )}
        </div>
      );
    }
    case "checkbox": {
      const raw = answers[step.id];
      const selected = Array.isArray(raw) ? raw : [];
      const toggle = (value: string) => {
        const next = selected.includes(value)
          ? selected.filter((x) => x !== value)
          : [...selected, value];
        patch({ [step.id]: next });
      };
      return (
        <div className="flex flex-col gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                selected.includes(opt.value)
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 hover:border-arena-orange/50"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="h-4 w-4 rounded accent-arena-neon"
              />
              <span className="text-sm text-white">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }
    case "rating": {
      const max = step.max ?? 5;
      const val = answers[step.id] as number | undefined;
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => patch({ [step.id]: n })}
              className={`h-12 min-w-[3rem] rounded-lg border text-lg font-bold transition-all ${
                val === n
                  ? "border-arena-neon bg-arena-neon/20 text-arena-neon shadow-neon"
                  : "border-white/15 text-arena-muted hover:border-arena-orange/60 hover:text-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      );
    }
    case "rating_or_skip": {
      const val = answers[step.id] as number | string | undefined;
      const max = step.max ?? 5;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => patch({ [step.id]: n })}
                className={`h-12 min-w-[3rem] rounded-lg border text-lg font-bold transition-all ${
                  val === n
                    ? "border-arena-neon bg-arena-neon/20 text-arena-neon shadow-neon"
                    : "border-white/15 text-arena-muted hover:border-arena-orange/60 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              val === step.skipValue
                ? "border-arena-orange/80 bg-arena-orange/10 shadow-orange"
                : "border-white/10 hover:border-arena-orange/50"
            }`}
          >
            <input
              type="radio"
              name={`${step.id}_skip`}
              checked={val === step.skipValue}
              onChange={() => patch({ [step.id]: step.skipValue })}
              className="h-4 w-4 accent-arena-orange"
            />
            <span className="text-sm text-white">{step.skipLabel}</span>
          </label>
        </div>
      );
    }
    case "textarea":
      return (
        <Textarea
          placeholder={step.placeholder}
          value={(answers[step.id] as string) ?? ""}
          onChange={(e) => patch({ [step.id]: e.target.value })}
        />
      );
    default:
      return null;
  }
}
