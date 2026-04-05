"use client";

import type { SurveyAnswers, SurveyStep } from "@/lib/surveyTypes";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  step: SurveyStep;
  answers: SurveyAnswers;
  setAnswers: (next: SurveyAnswers) => void;
};

const optionLabelClass =
  "flex min-h-[3rem] cursor-pointer items-start gap-3 rounded-xl border px-3 py-3.5 transition-colors sm:min-h-0 sm:items-center sm:px-4 sm:py-3";

export function SurveyStepForm({ step, answers, setAnswers }: Props) {
  const patch = (partial: SurveyAnswers) =>
    setAnswers({ ...answers, ...partial });

  switch (step.kind) {
    case "radio":
      return (
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`${optionLabelClass} ${
                answers[step.id] === opt.value
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 active:border-arena-orange/50 sm:hover:border-arena-orange/50"
              }`}
            >
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={answers[step.id] === opt.value}
                onChange={() => patch({ [step.id]: opt.value })}
                className="mt-1 h-5 w-5 shrink-0 accent-arena-neon sm:mt-0 sm:h-4 sm:w-4"
              />
              <span className="text-base leading-snug text-white sm:text-sm">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );
    case "radio_other": {
      const selected = answers[step.id] as string | undefined;
      const otherKey = `${step.id}_other` as keyof SurveyAnswers;
      return (
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`${optionLabelClass} ${
                selected === opt.value
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 active:border-arena-orange/50 sm:hover:border-arena-orange/50"
              }`}
            >
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => patch({ [step.id]: opt.value })}
                className="mt-1 h-5 w-5 shrink-0 accent-arena-neon sm:mt-0 sm:h-4 sm:w-4"
              />
              <span className="text-base leading-snug text-white sm:text-sm">
                {opt.label}
              </span>
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
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {step.options.map((opt) => (
            <label
              key={opt.value}
              className={`${optionLabelClass} ${
                selected.includes(opt.value)
                  ? "border-arena-neon/80 bg-arena-neon/10 shadow-neon"
                  : "border-white/10 active:border-arena-orange/50 sm:hover:border-arena-orange/50"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="mt-1 h-5 w-5 shrink-0 rounded accent-arena-neon sm:mt-0 sm:h-4 sm:w-4"
              />
              <span className="text-base leading-snug text-white sm:text-sm">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );
    }
    case "rating": {
      const max = step.max ?? 5;
      const val = answers[step.id] as number | undefined;
      return (
        <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => patch({ [step.id]: n })}
              className={`flex min-h-[48px] items-center justify-center rounded-lg border text-lg font-bold transition-all sm:h-12 sm:min-w-[3rem] ${
                val === n
                  ? "border-arena-neon bg-arena-neon/20 text-arena-neon shadow-neon"
                  : "border-white/15 text-arena-muted active:border-arena-orange/60 active:text-white sm:hover:border-arena-orange/60 sm:hover:text-white"
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
          <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => patch({ [step.id]: n })}
                className={`flex min-h-[48px] items-center justify-center rounded-lg border text-lg font-bold transition-all sm:h-12 sm:min-w-[3rem] ${
                  val === n
                    ? "border-arena-neon bg-arena-neon/20 text-arena-neon shadow-neon"
                    : "border-white/15 text-arena-muted active:border-arena-orange/60 active:text-white sm:hover:border-arena-orange/60 sm:hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <label
            className={`${optionLabelClass} ${
              val === step.skipValue
                ? "border-arena-orange/80 bg-arena-orange/10 shadow-orange"
                : "border-white/10 active:border-arena-orange/50 sm:hover:border-arena-orange/50"
            }`}
          >
            <input
              type="radio"
              name={`${step.id}_skip`}
              checked={val === step.skipValue}
              onChange={() => patch({ [step.id]: step.skipValue })}
              className="mt-1 h-5 w-5 shrink-0 accent-arena-orange sm:mt-0 sm:h-4 sm:w-4"
            />
            <span className="text-base leading-snug text-white sm:text-sm">
              {step.skipLabel}
            </span>
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
