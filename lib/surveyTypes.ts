export type PathType = "player_path" | "viewer_path" | "future_player_path";

export type SurveyAnswers = Record<string, string | string[] | number | undefined>;

export type Option = { value: string; label: string };

export type StepBase = {
  id: string;
  title: string;
};

export type StepRadio = StepBase & {
  kind: "radio";
  options: Option[];
};

export type StepRadioOther = StepBase & {
  kind: "radio_other";
  options: Option[];
  otherValue: string;
  otherPlaceholder?: string;
};

export type StepCheckbox = StepBase & {
  kind: "checkbox";
  options: Option[];
};

export type StepRating = StepBase & {
  kind: "rating";
  max?: number;
};

export type StepTextarea = StepBase & {
  kind: "textarea";
  placeholder?: string;
};

export type StepRatingOrSkip = StepBase & {
  kind: "rating_or_skip";
  skipLabel: string;
  skipValue: string;
  max?: number;
};

export type SurveyStep =
  | StepRadio
  | StepRadioOther
  | StepCheckbox
  | StepRating
  | StepTextarea
  | StepRatingOrSkip;
