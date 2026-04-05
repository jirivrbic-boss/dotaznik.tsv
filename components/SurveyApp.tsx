"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GATEWAY_STEP, MAX_SURVEY_STEPS, pathFlow } from "@/lib/surveySteps";
import type { PathType, SurveyAnswers } from "@/lib/surveyTypes";
import { isStepComplete } from "@/lib/surveyValidation";
import { getDb } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SurveyStepForm } from "@/components/SurveyStepForm";
import { SuccessScreen } from "@/components/SuccessScreen";
import Link from "next/link";

export function SurveyApp() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [path, setPath] = useState<PathType | null>(null);
  const [pathStepIndex, setPathStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flow = useMemo(() => (path ? pathFlow(path) : []), [path]);
  const currentStep = path ? flow[pathStepIndex] : GATEWAY_STEP;

  const totalSteps = path ? 1 + flow.length : MAX_SURVEY_STEPS;
  const currentNumber = path ? 1 + pathStepIndex : 1;
  const progress = Math.min(100, Math.round((currentNumber / totalSteps) * 100));

  const canProceed = currentStep
    ? isStepComplete(currentStep, answers)
    : false;

  const goNext = async () => {
    setError(null);
    if (!currentStep) return;

    if (!path) {
      const role = answers.gateway_role as PathType | undefined;
      if (!role) return;
      setPath(role);
      setPathStepIndex(0);
      return;
    }

    const isLast = pathStepIndex >= flow.length - 1;
    if (!isLast) {
      setPathStepIndex((i) => i + 1);
      return;
    }

    const db = getDb();
    if (!db) {
      setError(
        "Firebase není nakonfigurováno. Zkontroluj soubor .env.local (NEXT_PUBLIC_FIREBASE_*).",
      );
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "survey_responses"), {
        path_type: path,
        timestamp: serverTimestamp(),
        answers,
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setError("Odeslání se nepovedlo. Zkus to prosím znovu.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setError(null);
    if (!path) return;
    if (pathStepIndex > 0) {
      setPathStepIndex((i) => i - 1);
      return;
    }
    setPath(null);
    setAnswers((a) => ({
      gateway_role: a.gateway_role,
    }));
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 pt-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(136,255,0,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(245,131,43,0.06),transparent_45%)]" />

      <header className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
        <Image
          src="/foto/tournament-logo.png"
          alt="ESPORTARENA TSV"
          width={280}
          height={120}
          className="h-auto w-[min(280px,85vw)] object-contain drop-shadow-[0_0_20px_rgba(136,255,0,0.2)]"
          priority
        />
        <p className="text-center text-xs uppercase tracking-[0.2em] text-arena-muted">
          Dotazník — 3. sezóna
        </p>
      </header>

      <div className="relative mx-auto mt-10 max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-arena-muted">
          <span>
            Krok {currentNumber} / {totalSteps}
          </span>
          <span className="font-mono text-arena-neon">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-arena-neon to-[#39FF14] shadow-neon"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <main className="relative mx-auto mt-10 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${path ?? "gateway"}-${pathStepIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-6 sm:p-10">
              <h2 className="text-lg font-black uppercase italic leading-snug text-white sm:text-xl">
                {currentStep.title}
              </h2>
              <div className="mt-8">
                <SurveyStepForm
                  step={currentStep}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              </div>
              {error && (
                <p className="mt-6 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                {path ? (
                  <Button variant="ghost" type="button" onClick={goBack}>
                    Zpět
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canProceed || submitting}
                  onClick={goNext}
                >
                  {path && pathStepIndex >= flow.length - 1
                    ? submitting
                      ? "Odesílám…"
                      : "Odeslat dotazník"
                    : "Další"}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-arena-muted/80">
          <Link
            href="/stats"
            className="underline decoration-arena-orange/60 underline-offset-4 hover:text-arena-orange"
          >
            Admin přehled (/stats)
          </Link>
        </p>
      </main>
    </div>
  );
}
