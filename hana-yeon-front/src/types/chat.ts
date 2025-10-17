export type TChatOption = {
  label: string;
  nextId?: string;
};

export type TChatMessage = {
  id: string;
  question: string;
  answer: string;
  contents: { type: string; text: string }[];
  options?: TChatOption[];
  message?: string;
};
