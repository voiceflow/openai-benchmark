import { GPT_MODELS } from "./constants";

// comment out models that don't need testing
export const MODELS = [
  // GPT_MODELS.DaVinci_003,
  //   GPT_MODELS.GPT_4,
  // GPT_MODELS.GPT_3_5_turbo,
  GPT_MODELS.AZURE_GPT_3_5_turbo,
  GPT_MODELS.CLAUDE_V1,
  GPT_MODELS.CLAUDE_INSTANT_V1,
];

export const FILE_NAME = "metrics";

// how many to requests to run for each model
export const ITERATIONS = 20;

// the actual prompt to send to the API
export const TEST_MESSAGE =
  "give me 10 clothing brands and their country of origin in JSON format.";
