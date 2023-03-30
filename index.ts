import { GPT_MODELS } from "./constants";

import fs from "fs";

import { TEST_MESSAGE, ITERATIONS, FILE_NAME, MODELS } from "./config";
import { ModelCompletionFormat } from "./openai";

interface CompletionMetrics {
  time: number;
  response?: any;
}

type ModelMetrics = Record<GPT_MODELS, CompletionMetrics[]>;

const modelMetrics = Object.fromEntries(
  MODELS.map((model) => [model, []])
) as unknown as ModelMetrics;

(async () => {
  await Promise.all(
    MODELS.map(async (model) => {
      await Promise.all(
        [...Array(ITERATIONS)].map(async (_, index) => {
          const start = Date.now();

          const response = await ModelCompletionFormat[model]({
            prompt: TEST_MESSAGE,
            model,
          });
          const end = Date.now();

          modelMetrics[model as GPT_MODELS]?.push({
            time: end - start,
            response: response ?? "ERRORED",
          });

          console.log("finished index", index, "for model", model);
        })
      );
    })
  );

  // generate a csv from modelMetrics
  // headers
  let csv =
    Object.keys(modelMetrics)
      .map((name) => `TIME ${name}, RESPONSE ${name}`)
      .join(",") + "\n";

  const maxLength = Math.max(
    ...Object.values(modelMetrics).map((m) => m.length)
  );

  for (let i = 0; i < maxLength; i++) {
    const row = Object.values(modelMetrics)
      .map(
        (m) =>
          `${m[i]?.time ?? ""}, "${
            JSON.stringify(m[i]?.response)?.replace(/\"/g, '""') ?? ""
          }"`
      )
      .join(",");

    csv += row + "\n";
  }

  // write csv to file
  fs.writeFileSync(FILE_NAME + ".csv", csv);

  process.exit(0);
})();
