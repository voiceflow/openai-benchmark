import { GPT_MODELS } from "./constants";

// comment out models that don't need testing
export const MODELS = [
  GPT_MODELS.DaVinci_003,
  //   GPT_MODELS.GPT_4,
  //   GPT_MODELS.GPT_3_5_turbo,
];

export const FILE_NAME = "metrics";

// how many to requests to run for each model
export const ITERATIONS = 10;

// the actual prompt to send to the API
export const TEST_MESSAGE =
  "give me 5 car brands and their country of origin in JSON format.";
