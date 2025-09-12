import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export const checkSpam = async (text) => {
  try {
    const response = await axios.post(
      "https://api.aispamcheck.com/api/v1/check",
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AISPAMCHECK_API_KEY}`,
        },
      }
    )

    const data = response.data
    console.log("Spam API raw response:", data)

    let spamScore

    if (data.is_spam) {
      // If it's spam, confidence_score is probability of spam
      spamScore = data.confidence_score
    } else {
      // If it's NOT spam, invert the probability
      spamScore = 1 - data.confidence_score
    }

    return {
      spamScore: Number(spamScore.toFixed(2)), // 0 → not spam, 1 → spam
      isSpam: data.is_spam,
      label: data.is_spam ? "spam" : "ham",
    }
  } catch (error) {
    console.error("Spam check failed:", error.message)
    return { spamScore: 0, isSpam: false, label: "unknown" }
  }
}

export const checkToxicityHF = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    )
    if (!Array.isArray(response.data) || !Array.isArray(response.data[0])) {
      console.warn("Unexpected HF response:", response.data)
      return 0
    }

    const toxicityScoreObj = response.data[0].find(
      (r) => r.label && r.label.toLowerCase() === "toxic"
    )

    const toxicityScore = toxicityScoreObj ? toxicityScoreObj.score : 0
    return parseFloat(toxicityScore.toFixed(2))
  } catch (error) {
    console.error(
      "Hugging Face toxicity check failed:",
      error.response?.data || error.message
    )
    return 0
  }
}
