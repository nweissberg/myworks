// import axios from 'axios';
// import jpeg from 'jpeg-js';
import { async } from "@firebase/util";
import { HfInference } from "@huggingface/inference";
import {
  averageBlob,
  fetchWithTimeout,
  imgToBase64,
  normalize,
  replaceAll,
  shorten,
  similarText,
  splitStringWithPunctuation,
  toType,
} from "../utils";

export const HFK = [
  new HfInference("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"),
  new HfInference("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"),
  new HfInference("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"),
];

export const tokens = {
  imagine: {
    masterpiece: 1.0,
    "best quality": 0.952,
    "1girl": 0.871,
    solo: 0.57,
    "looking at viewer": 0.38,
    realistic: 0.301,
    "8k": 0.27,
    "sharp focus": 0.25,
    photorealistic: 0.24,
    "long hair": 0.23,
    smile: 0.22,
    "full body": 0.21,
    highres: 0.2,
    "highly detailed": 0.19,
    "ultra-detailed": 0.185,
    intricate: 0.18,
    standing: 0.17,
    blush: 0.168,
    "cinematic lighting": 0.165,
    nsfw: 0.16,
    breasts: 0.156,
    bangs: 0.152,
    "large breasts": 0.15,
    hdr: 0.147,
    "intricate details": 0.145,
    "depth of field": 0.143,
    "extremely detailed": 0.14,
    absurdres: 0.135,
    "4k": 0.13,
    "high quality": 0.125,
    "blue eyes": 0.12,
    outdoors: 0.118,
    "upper body": 0.115,
    "extremely detailed cg unity 8k wallpaper": 0.11,
    "raw photo": 0.105,
    "detailed eyes": 0.1,
    "short hair": 0.099,
    "black hair": 0.094,
    cleavage: 0.09,
    "detailed face": 0.088,
    outdoors: 0.085,
    "medium breasts": 0.08,
    detailed: 0.072,
    "ultra high res": 0.071,
    "trending on artstation": 0.07,
    portrait: 0.06,
    jewelry: 0.055,
    "high detail": 0.05,
    "cowboy shot": 0.043,
    night: 0.04,
  },
  forget: {
    "low quality": 1.0,
    blurry: 0.55,
    "bad anatomy": 0.5,
    "worst quality": 0.45,
    text: 0.44,
    watermark: 0.43,
    "normal quality": 0.424,
    ugly: 0.32,
    signature: 0.29,
    lowres: 0.28,
    deformed: 0.27,
    "extra limbs": 0.26,
    disfigured: 0.25,
    cropped: 0.24,
    "jpeg artifacts": 0.23,
    "bad hands": 0.22,
    error: 0.21,
    mutation: 0.2,
    "missing fingers": 0.198,
    username: 0.195,
    "poorly drawn hands": 0.19,
    "poorly drawn face": 0.188,
    monochrome: 0.186,
    "extra digit": 0.183,
    "fewer digits": 0.18,
    "out of frame": 0.173,
    "extra fingers": 0.17,
    "mutated hands": 0.162,
    "extra legs": 0.16,
    "extra arms": 0.155,
    "bad promotions": 0.15,
    "long neck": 0.14,
    easynegative: 0.134,
    "fused fingers": 0.13,
    "missing arms": 0.122,
    duplicate: 0.1,
    mutated: 0.09,
    "missing legs": 0.08,
    "too many fingers": 0.07,
    multilated: 0.06,
    "malformed limbs": 0.05,
    "3d": 0.04,
    "artist name": 0.03,
    "gross proportions": 0.02,
    "cloned face": 0.016,
    morbid: 0.015,
    "bad art": 0.014,
    cartoon: 0.013,
    grayscale: 0.012,
    logo: 0.01,
  },
};

// await inference.translation({
//   model: 't5-base',
//   inputs: 'My name is Wolfgang and I live in Berlin'
// })

// var max_imagine = parseFloat(Object.values(tokens.imagine).reduce((x,y)=>x + y, 0)).toFixed(3);
// var max_forget = parseFloat(Object.values(tokens.forget).reduce((x,y)=>x + y, 0)).toFixed(3);
// console.log(max_imagine)

function sum_prompt_array(p_array, mode) {
  return p_array
    .map((i) => tokens[mode][i] || 0.0)
    .reduce((x, y) => x + y, 0)
    .toFixed(3);
}

export function prompt_score(prompts, mode = "imagine", min = 6) {
  var prompt_array = prompts.toLowerCase().replace(/\s+/g, " ").split(", ");
  var score = 0;
  var options = Object.keys(tokens[mode]).filter(
    (i) => prompt_array.includes(i) == false
  );
  let item = null;
  while (score < min) {
    const index = Math.floor(options.length * Math.random());
    options = options.filter((obj, i) => {
      if (i == index) item = obj;
      return i != index;
    });
    prompt_array.push(item);
    score = sum_prompt_array(prompt_array, mode);
  }
  console.log(score);
  return prompt_array.join(", ");
}

var req_count = 0;

export async function generate_prompts(text) {
  return new Promise(async (res) => {
    res(await generate_text(text));
  });
}
//make a painting of the museum of art of Sao Paulo, The MASP, viewd from Paulista avanue, architecture visualization building by Oscar Niemeyer, in leonardo davinci style.
var output = "";
var genText = "";
async function generate_text(text) {
  let inference = HFK[Date.now() % HFK.length];
  await inference
    .textGeneration({
      model: "succinctly/text2image-prompt-generator",
      inputs: text,
      wait_for_model: true,
      do_sample: true,
      use_cache: false,
      max_new_tokens: 222,
      return_full_text: false,
    })
    .then(async (gen_data) => {
      genText = gen_data.generated_text;
      // console.log(genText)
      if (genText.length != output.length) {
        output = genText;
        return await generate_text(genText);
      }
    });

  genText = "";
  // console.log(output)
  return output;
}

// export async function caption_image(img){
//     let inference = HFK[Date.now() % HFK.length]
//     return new Promise((req=img,res)=>{
//         inference.imageClassification({
//             model: 'Salesforce/blip-image-captioning-large',
//             data: req,
//         }).then(async response=>{
//             output = response
//         })
//         console.log(output)
//         res.text(output)
//     })
// }
// async function query(filename) {
// 	const data = fs.readFileSync(filename);
// 	const response = await fetch(
// 		"https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic",
// 		{
// 			headers: { Authorization: "Bearer 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" },
// 			method: "POST",
// 			body: data,
// 		}
// 	);
// 	const result = await response.json();
// 	return result;
// }

// query("cats.jpg").then((response) => {
// 	console.log(JSON.stringify(response));
// });

export function toEndQuote(text) {
  return normalize(
    text
      .split("”")[0]
      .split('".')[0]
      .split('."')[0]
      .split('";')[0]
      .split('"\n')[0]
  );
}

export function uniqueWords(text) {
  var sentence_array = text;
  if (typeof text == "string")
    sentence_array = splitStringWithPunctuation(sentence_array);
  sentence_array = sentence_array
    .map((f) => normalize(f))
    .join(" ")
    .split(" ")
    .filter((a) => a != "" && a.length > 3);
  return sentence_array.filter((o, i) => sentence_array.indexOf(o) == i);
}

export function scorePrompt(text, test_array) {
  return text
    .split(" ")
    .filter((a) => a != "")
    .map((word) => (test_array.includes(word) ? 1 : 0))
    .reduce((a, b) => a + b);
}

// https://johnrobinsn-midasdepthestimation.hf.space/api/predict
// https://nielsr-dpt-depth-estimation.hf.space/api/predict/ ### 3D ###
// https://jonjhiggins-midas.hf.space/run/predict ### PRECISE ###
// https://keras-io-monocular-depth-estimation.hf.space/api/predict ### REAL-TIME ###
export async function depth_image(img) {
  return new Promise(async (resolve, reject) => {
    let img_data_string = imgToBase64(img, "image/jpeg", 0.5, 640 / 480);

    const response = await fetch(
      "https://keras-io-monocular-depth-estimation.hf.space/api/predict",
      {
        headers: {
          "X-Wait-For-Model": "true",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ data: [img_data_string] }),
      }
    );

    const result = await response.json();
    if (result) {
      // console.log(result)
      resolve(result.data[0]);
    }
  });
}

// export async function text_to_voice(text, language='en') {
//     var audio_data = null
//     var data = {inputs: text}
//     console.log(data)
//     return new Promise(async (resolve, reject) => {

//         const response = await fetch(
//             "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits",
//             {
//                 headers: {
//                     "Authorization": "Bearer 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",
//                     "X-Wait-For-Model":"true",
//                     "Content-Type": "application/json"
//                 },
//                 method: "POST",
//                 inputs: JSON.stringify({inputs:text})
//             }
//         );
//         const result = await response.json();
//         resolve(result)
//         return result;

//     })
// }

export async function image_inpainting(img, mask, prompt) {
  console.log;
  var audio_data = null;
  console.log(text_string, JSON.stringify(text_string));
  return new Promise(async (resolve, reject) => {
    try {
      audio_data = await fetchWithTimeout(
        "https://awacke1-text-to-speech-espnet-kan-bayash-2eb8bb8.hf.space/run/predict",
        {
          headers: {
            Authorization: "Bearer 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",
            "X-Wait-For-Model": "true",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ data: [text_string] }),
        },
        120000
      );

      console.log(audio_data);

      resolve(audio_data);
    } catch (error) {
      console.error(error);
      reject(error.message);
    }
  });
}

export async function text_to_voice(text_string, language = "en") {
  var audio_data = null;
  console.log(text_string, JSON.stringify(text_string));
  return new Promise(async (resolve, reject) => {
    try {
      audio_data = await fetchWithTimeout(
        "https://awacke1-text-to-speech-espnet-kan-bayash-2eb8bb8.hf.space/run/predict",
        {
          headers: {
            Authorization: "Bearer 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",
            "X-Wait-For-Model": "true",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ data: [text_string] }),
        },
        120000
      );

      console.log(audio_data);

      resolve(audio_data);
    } catch (error) {
      console.error(error);
      reject(error.message);
    }
  });
}

// text_to_voice("The answer to the universe is 42").then((response) => {

//     response.audio = playAudioFromObject(response)

//     console.log(response);
// });

export async function playBase64EncodedFlacAudio(base64Audio) {
  console.log(base64Audio);
  // return
  // var audioData = new Uint8Array(base64Audio.data[0]);
  // const blob = new Blob([audioData.buffer],{type:'audio/flac'});
  // const new_audio = new Audio( URL.createObjectURL(blob) );

  // new_audio.play()
  // Decode the base64 data to a binary string
  var binaryData = new Uint8Array(base64Audio.data);

  // Convert the binary string to a Uint8Array
  const uint8Array = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  // Create a blob from the audio data
  const blob = new Blob([uint8Array], { type: "audio/flac" });

  // Create a URL for the blob
  const audioURL = URL.createObjectURL(blob);

  // Create an Audio element with the URL as its source
  const audio = new Audio(audioURL);

  // Wait for the audio to be loaded and play it
  await new Promise((resolve, reject) => {
    audio.onloadedmetadata = () => {
      audio.play();
    };
    audio.onerror = reject;
  });
  resolve(audio);
  // return audio;
}

export async function compare_captions(img, base64 = true) {
  let img_data_string = img;
  if (base64) img_data_string = imgToBase64(img, "image/jpeg", 0.5);
  var captions = null;
  // console.log(img_data_string)
  //https://nielsr-comparing-captioning-models.hf.space/run/predict
  //https://awacke1-image-to-text-salesforce-blip-im-e07f326.hf.space/run/predict
  try {
    captions = await fetchWithTimeout(
      "https://nielsr-comparing-captioning-models.hf.space/run/predict",
      {
        headers: {
          "X-Wait-For-Model": "true",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ data: [img_data_string] }),
      },
      15000
    );
    // console.log(captions);
  } catch (error) {
    console.error(error);
    return error.message;
  }
  return captions;
}

export async function caption_image(
  img,
  prompts,
  onStep = (text) => {
    console.log(text);
  }
) {
  // console.log('Analysing image from the prompts: '+ prompts)
  console.log("Analysing the image...");
  onStep({ state: "0-ViewImage", data: "Analysing the image" });
  // let inference = HFK[2]
  return new Promise(async (resolve, reject) => {
    let captions = await compare_captions(img);
    if (captions?.data) {
      onStep({ state: "1-CaptionAI", data: captions.data });
      const filtered = captions.data
        .sort((a, b) => b.length - a.length)
        .filter((o, i) => !i || similarText(o, captions.data[i - 1]) <= 0.8);
      let final_text = filtered[0];
      let validated_text = filtered.at(-1);
      let validate_array = uniqueWords(filtered);
      let conclusion_text = "";
      // console.log(validate_array)
      var promts_array = replaceAll(prompts.replace("/imagine", ""), " ", "_")
        .split(",")
        .filter((a) => a != "" && a.length >= 3);
      promts_array = promts_array
        .filter((o, i) => promts_array.indexOf(o) == i)
        .map((k) => {
          return replaceAll(k, "_", " ");
        });

      const score_array = promts_array.map((p) =>
        scorePrompt(p, validate_array)
      );
      // “”
      var prompts_short = promts_array
        .map((o, i) => {
          return { text: o, score: score_array[i] };
        })
        .filter((o) => o.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((p) => p.text);
      // var prompts_short = promts_array.slice(0,Math.min(15,promts_array.length)).join(', ')
      prompts_short = prompts_short
        .concat(
          validate_array.filter(
            (v) => prompts_short.join(" ").includes(v) == false
          )
        )
        .join(", ");
      // console.log(prompts_short)
      const brain = {
        self: "I am Athena Wizpik, an award-winning designer and expert photographer, with 32 years in the field. Recognized for my concise yet fascinating descriptions of images.",
        task: "I was given the task, of describing the photo, with just the following information about it.\n",
        info: `The prompts that generated the picture:\n“${prompts_short}”.\nI have also recieved these ${
          filtered.length
        } descriptions, of this one photo, made by an AI about the image:\n“${filtered.join(
          "”,\n“"
        )}”;`,
        action: `With all this in mind, I can finally “frame the picture”, from a expert's standpoint, with this captivating description: “`,
        review: `Also, I was able to describe the photo in a way that is still unique, amazing, succinct, and doesn't give away too much. Here is the new description, that is still fascinating: “`,
        conclude: (a, b) =>
          `“${b}” this is my second option, if I where to combine with “${a}” this would be my final conclusion: “`,
      };

      const query = `${brain.self}\n${brain.task}\n${brain.info}\n${brain.action}`;
      await generate_text_stream(query, 128)
        .then((response) => {
          final_text = toEndQuote(response.substr(query.length));
          onStep({ state: "2-Descrition", data: final_text });
        })
        .catch((e) => {
          console.log("Error while summerizing text: " + e.message);
        });
      conclusion_text = final_text;
      const validate = `${query} "${final_text}."\n${brain.review}`;
      await generate_text_stream(validate, 128)
        .then((response) => {
          validated_text = toEndQuote(response.substr(validate.length));
          onStep({ state: "3-Validation", data: validated_text });
        })
        .catch((e) => {
          console.log("Error while summerizing text: " + e.message);
        });
      conclusion_text = validated_text;

      if (similarText(final_text, validated_text) < 0.6) {
        const conclude = brain.conclude(final_text, validated_text);
        await generate_text_stream(conclude, 128)
          .then((response) => {
            conclusion_text = toEndQuote(response.substr(conclude.length));
            onStep({ state: "4-Conclusion", data: conclusion_text });
          })
          .catch((e) => {
            console.log("Error while summerizing text: " + e.message);
          });
      }

      // resolve(validated_text)
      // summerize_text(validated_text,150).then(resolve).catch((e)=>{resolve(final_text)})
      // const max_length = (final_text+" "+validated_text).length
      // console.log(max_length)

      summerize_text(conclusion_text, 156, "google/pegasus-large")
        .then((final_comment) => {
          resolve(final_comment);
        })
        .catch((error) => {
          console.log(error);
          resolve(conclusion_text);
        });
    } else {
      reject({ message: "An error occurred when captioning the image..." });
    }
  });
}

export async function upscale_image(img) {
  // const img = new Image();
  // img.crossOrigin = "anonymous";
  let inference = HFK[Date.now() % HFK.length];
  let img_data_string = imgToBase64(img);
  console.log(img_data_string);
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      "https://manjushri-sd-2x-and-4x-upscaler-gpu.hf.space/run/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            img_data_string,
            "Upscaler 2x",
            "hello world",
            "hello world",
            1,
            5,
            1714128522083220,
          ],
        }),
      }
    );

    const data = await response.json();
    resolve(data);
  });
}

export async function generate_text_stream(
  input,
  max = 100,
  inference = HFK[Date.now() % HFK.length]
) {
  // console.log('Continue text: '+input)
  return new Promise((resolve, reject) => {
    console.log("generating...");
    inference
      .textGeneration({
        model: "bigscience/bloom-560m",
        inputs: input,
        parameters: {
          max_new_tokens: max,
          top_p: 0.9,
          num_beams: 1,
        },
      })
      .then((output) => {
        // console.log(output);
        resolve(output.generated_text);
      });
  });
}
// philschmid/bart-large-cnn-samsum
// facebook/bart-large-cnn
// facebook/bart-large-xsum
// google/pegasus-xsum
// google/pegasus-large
// knkarthick/MEETING_SUMMARY
// lidiya/bart-large-xsum-samsum
// csebuetnlp/mT5_multilingual_XLSum
// sshleifer/distilbart-cnn-12-6
// pszemraj/long-t5-tglobal-base-16384-book-summary
export async function summerize_text(
  input,
  max = 100,
  model = "google/pegasus-large",
  inference = HFK[Date.now() % HFK.length]
) {
  return new Promise((resolve, reject) => {
    console.log("summerizing text...");
    inference
      .summarization({
        wait_for_model: true,
        cache: false,
        model: model,
        inputs: input,
        parameters: {
          max_length: max,
        },
      })
      .then((output) => {
        resolve(output.summary_text);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
}

// summerize_text('The soul is the result of the brain activity. In human beings, this activity is associated with consciousness, and when this activity is associated with the evolution of the human mind, this activity turns into understanding. And, as the mind develops from the world of images, through the interaction with the physical world, the minds is increasingly transcendent in relation to the physical world. My question: how can we attribute consciousness, in a similar way, to all beings, in the evolution of their species.')
// .then(response=>{
//     console.log(response)
// })
// generate_text_stream(`The following is a conversation with an AI assistant named Athena, created by Nyco 3D. The assistant is helpful, creative, friendly, and very descriptive. The AI strongly avoids misinformation and step-by-step replies. If does not know the answer, it replies with an apology.

// Human: Hello, who are you?
// AI: I am a AI assistant. How can I help you today?
// Human: What can you do for me?
// AI: `)
// .then(text_output=>{
//     console.log(text_output)
// })

// export async function caption_image(img){
//     // const img = new Image();
//     // img.crossOrigin = "anonymous";
//     let inference = HFK[Date.now() % HFK.length]
//     let data = imgToBase64(img)
//     console.log(data)
//     return new Promise((resolve, reject)=>{
//         inference.imageClassification({
//             model: 'Salesforce/blip-image-captioning-large',
//             inputs: data,
//             data: data,
//         }).then(response=>{
//             console.log(response)
//             resolve(response);
//         }).catch(err=>{
//             reject(err.message);
//         });
//     });
// }

// .then( gen_txt=>{
//     var output = ''
//     console.log(gen_txt)
//     if(gen_txt){
//         generate_text(output).then(text_continue=>{
//             output = text_continue
//         })
//     }
//     console.log(output)
// })

function getHighestOption(obj) {
  let sum = obj.reduce((acc, val) => {
    return acc + val.scores.reduce((a, v) => a + v, 0);
  }, 0);
  let average = sum / (obj.length * obj[0].scores.length);
  let highestScore = 0;
  let highestLabel = "";
  obj[0].labels.forEach((label, index) => {
    if (
      obj.reduce((acc, val) => acc + val.scores[index], 0) / obj.length >
      highestScore
    ) {
      highestScore =
        obj.reduce((acc, val) => acc + val.scores[index], 0) / obj.length;
      highestLabel = label;
    }
  });
  return highestLabel;
}

//   textClassification
// papluca/xlm-roberta-base-language-detection

export async function text_language_detection(
  inputs,
  inference = HFK[Date.now() % HFK.length]
) {
  console.log(toType(inputs), inputs.length);
  return new Promise((resolve, reject) => {
    console.log("Detection Language...");
    inference
      .textClassification({
        model: "papluca/xlm-roberta-base-language-detection",
        inputs: inputs,
      })
      .then((output) => {
        resolve(output.slice(0, 3));
      })
      .catch((e) => {
        console.log(e.message);
        reject(e.message);
      });
  });
}

export async function zero_shot_classification(
  inputs = [],
  options = ["written in portuguese", "english text"],
  inference = HFK[Date.now() % HFK.length]
) {
  if (toType(inputs) == "string") {
    if (inputs.length > 1000) {
      inputs = shorten(normalize(inputs), inputs.length / 2);
    }
    console.log(toType(inputs), inputs);
    inputs = splitStringWithPunctuation(inputs + ";");
  }
  console.log(toType(inputs), inputs.length);
  return new Promise((resolve, reject) => {
    console.log("classifying text...");
    inference
      .zeroShotClassification({
        model: "valhalla/distilbart-mnli-12-1",
        inputs: inputs.filter((t) => normalize(t).length > 2),
        parameters: { candidate_labels: options },
        truncation: "only_first",
      })
      .then((output) => {
        console.log(output);
        resolve({ option: getHighestOption(output), data: output });
      })
      .catch((e) => {
        console.log(e.message);
        reject(e.message);
      });
  });
}

// text_0Shot_classification([
//     'Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!',
//     'summeize this text: Welcome to Nitro Diffusion - the first Multi-Style Model trained from scratch! This is a fine-tuned Stable Diffusion model trained on three artstyles simultaniously while keeping each style separate from the others. This allows for high control of mixing, weighting and single style use. Use the tokens archer style, arcane style or modern disney style in your prompts for the effect.',
//     'imagine a very fluffy black cat, Sitting on a red pillow, on top of a black sofa.',
//     'Isso é só um teste de comparação entre as proprias frases?',
// ],['portugues','english','french','spanish']).then(response=>{
//     console.log(response)
// })

export async function generate_chat(inference = HFK[Date.now() % HFK.length]) {
  return inference.conversational({
    model: "facebook/blenderbot-400M-distill",
    inputs: {
      past_user_inputs: ["Which movie is the best ?"],
      generated_responses: ["It is Die Hard for sure."],
      text: "Can you explain why ?",
    },
  });
}

// generate_chat().then(return_text=>{
//     console.log(return_text)
//     "It's the best movie ever."
//     " It is based on the book of the same name by James Fenimore Cooper."
// })

export default async function generate_image(
  options = {},
  onLoad = (image_blob) => {
    console.log(image_blob);
  },
  req_count = 0
) {
  let inference = HFK[req_count % HFK.length];

  var config = {
    ...{
      imagine: "",
      forget: "easynegative, low quality, worst quality, bad composition",
      images: ["prompthero/openjourney-v4"],
      seed: 1,
      sampler: "k_euler_ancestral",
      cfg_scale: 7,
      noise: 0.5,
      steps: 20,
      cache: true,
      width: 256,
      height: 256,
    },
    ...options,
  };

  console.log(config.images);
  var all_requests = [];
  var all_generations = {};
  config.images.map((img_req) => {
    all_generations[img_req.id] = img_req;
  });
  all_requests = config.images.map(async (image_data, index) => {
    req_count += 1;
    console.log("Requests:" + req_count);
    let query = {
      cache: false,
      wait_for_model: true,
      inputs: config.imagine,
      use_cache: config.cache,
      model: image_data.model,
      sampler: config.sampler,
      steps: config.steps,
      seed: config.seed,
      noise_level: config.noise,
      cfg_scale: config.cfg_scale,
      // width:config.width,
      // height:config.height,
      // model_hash:'b09d6d6871',
      negative_prompt: config.forget,
      parameters: {
        // negative_prompt: config.forget,
        // sampler: config.sampler,
        // steps: config.steps,
        // seed: config.seed,
        // guidance_scale:config.cfg_scale,
        width: config.width,
        height: config.height,
        // noise_level:config.noise
      },
    };
    return inference.textToImage(query).then(async (image_blob) => {
      await averageBlob(image_blob).then(async (avg) => {
        if (avg == 0) {
          console.warn("Regenerating Empty image generation");
          await get_image(query).then((image_blob) => {
            image_blob = image_blob;
          });
        }
        image_data.blob = image_blob;
        console.log(image_data, image_blob);
        all_generations[image_data.id] = image_data;
        onLoad(image_data);
      });
    });
  });
  await Promise.all(all_requests).then(() => {});
  return all_generations;
}

export function get_image(query, inference = HFK[0]) {
  console.log(query)
  let finished = false;
  let cancel = () => {
    finished = true;
  };

  const promise = new Promise((resolve, reject) => {
    const resultPromise = inference.textToImage(query);

    resultPromise
      .then((blob) => {
        if (!finished) {
          resolve(blob);
        }
      })
      .catch((error) => {
        if (!finished) {
          reject(error);
        }
      });

    cancel = (error) => {
      if (finished) {
        return;
      }
      finished = true;
      reject(error || { message: "Canceled by client" });
    };

    if (finished) {
      cancel();
    }
  });

  return { promise, cancel };
}

// make an image of a superhuman flying on an epic pose and the background is matrix code and he is taking bullets. , mdjrny-v4, masterpiece, best quality, 8 k, trending on artstation, hyperrealism, octane render, unreal engine 5, path tracing, breathtaking landscape, dramatic lighting, cinematic, high coherence, symmetrical, high contrast, digital art, high detailed , detailed face, ultra high res, 4k, intricate details, full body, high quality, detailed, highres, realistic, high detail, looking at viewer, photorealistic, cinematic lighting, outdoors, highly detailed, detailed eyes, hdr, extremely detailed, absurdres, extremely detailed cg unity 8k wallpaper, ultra-detailed, depth of field, raw photo, sharp focus, 8k
