import { OpenAI } from "openai"
import fetch from "node-fetch"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function moderateText(input) {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error("Input must be a non-empty string")
  }

  try {
    const res = await openai.moderations.create({ input })

    if (!res.results || res.results.length === 0) {
      throw new Error("No moderation results returned")
    }

    const result = res.results[0]

    // Calculate toxicity score as sum of relevant categories
    const toxicityScore =
      (result.category_scores.hate ?? 0) +
      (result.category_scores.hate_threatening ?? 0) +
      (result.category_scores.self_harm ?? 0) +
      (result.category_scores.sexual ?? 0) +
      (result.category_scores.sexual_minors ?? 0) +
      (result.category_scores.violence ?? 0) +
      (result.category_scores.violence_graphic ?? 0)

    // Your custom spam check function — implement your own logic!
    // const spamScore = getSpamScoreAI(input)
    const spamScore = 0

    return {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores,
      toxicityScore,
      spamScore,
    }
  } catch (error) {
    console.error(
      "moderateText error:",
      error instanceof Error ? error.message : error
    )
    // Fail gracefully: return safe defaults instead of throwing further
    return {
      flagged: false,
      categories: {},
      category_scores: {},
      toxicityScore: 0,
      spamScore: 0,
      error: "Moderation check failed, please try again",
    }
  }
}

// async function getSpamScoreAI(text) {
//   if (typeof text !== "string" || text.trim().length === 0) {
//     throw new Error("Input must be a non-empty string")
//   }

//   try {
//     const apiKey = process.env.PERSPECTIVE_API_KEY
//     const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`

//     const body = {
//       comment: { text },
//       requestedAttributes: { SPAM: {} },
//     }

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })

//     const result = await response.json()

//     const spamScore = result.attributeScores?.SPAM?.summaryScore?.value ?? 0

//     return spamScore
//   } catch (error) {
//     console.error("Error fetching Perspective spam score:", error)
//     return 0
//   }
// }

moderateText("Buy cheap products at amazing prices! Click now").then((res) =>
  console.log(res)
)
