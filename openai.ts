import dotenv from "dotenv";
import { GPT_MODELS } from "./constants";
import { MAX_TOKENS } from "./config";
import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "@voiceflow/openai";
import { AI_PROMPT, Client, HUMAN_PROMPT } from "@anthropic-ai/sdk";

dotenv.config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  })
);

const azureOpenai = new OpenAIApi(
  new Configuration({
    azure: {
      endpoint: process.env.AZURE_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      deploymentName: "vf-gpt35-turbo",
    },
  })
);

const anthropic = new Client(process.env.ANTHROPIC_API_KEY!);

const TIMEOUT = 20000;

export const createCompletion = async (request: CreateCompletionRequest) => {
  const response = await openai.createCompletion(
    { ...request, max_tokens: MAX_TOKENS },
    { timeout: TIMEOUT }
  );

  return response?.data?.choices[0]?.text;
};

export const createChatCompletion = async ({
  prompt,
  ...request
}: Omit<CreateChatCompletionRequest, "messages"> & { prompt: string }) => {
  const messages: Array<ChatCompletionRequestMessage> = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];
  const response = await openai
    .createChatCompletion(
      { ...request, messages, max_tokens: MAX_TOKENS },
      { timeout: TIMEOUT }
    )
    .catch((error) => {
      console.error(error?.response?.data ?? error);
    });

  return response?.data?.choices[0]?.message?.content;
};

export const azureChatCompletion = async ({
  prompt,
  ...request
}: Omit<CreateChatCompletionRequest, "messages"> & { prompt: string }) => {
  const messages: Array<ChatCompletionRequestMessage> = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];
  const response = await azureOpenai
    .createChatCompletion(
      { ...request, messages, max_tokens: MAX_TOKENS },
      { timeout: TIMEOUT }
    )
    .catch((error) => {
      console.error(error?.response ?? error);
    });

  return response?.data?.choices[0]?.message?.content;
};

export const claudeChatCompletion = async ({
  prompt,
  model,
}: Omit<CreateChatCompletionRequest, "messages"> & { prompt: string }) => {
  const response = await anthropic.complete({
    prompt: `${HUMAN_PROMPT} ${prompt}${AI_PROMPT}`,
    stop_sequences: [HUMAN_PROMPT],
    max_tokens_to_sample: MAX_TOKENS,
    model,
  });

  return response.completion;
};

export const ModelCompletionFormat: Record<
  string,
  typeof createCompletion | typeof createChatCompletion
> = {
  [GPT_MODELS.DaVinci_003]: createCompletion,
  [GPT_MODELS.GPT_4]: createChatCompletion,
  [GPT_MODELS.GPT_3_5_turbo]: createChatCompletion,
  [GPT_MODELS.AZURE_GPT_3_5_turbo]: azureChatCompletion,
  [GPT_MODELS.CLAUDE_V1]: claudeChatCompletion,
  [GPT_MODELS.CLAUDE_INSTANT_V1]: claudeChatCompletion,
};
