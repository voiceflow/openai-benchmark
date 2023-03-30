# Voiceflow OpenAI Benchmark

Be sure to add a `.env` file into this repo with the following filled out:

```
OPENAI_ORG_ID='...'
OPENAI_API_KEY='...'
```

Run `yarn` to make sure all dependencies are installed.

Everything controlled is in `config.ts`, comment out the models you don't need tested against each other.
It should be intuitive what each value does.

Run `yarn start` to generate the output `csv` file, it will appear in this folder.

The first row will be `TIME <MODEL_NAME>, RESPONSE <MODEL_NAME>`, giving the time and response of each model for the given prompt.
