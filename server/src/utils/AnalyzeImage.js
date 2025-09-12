import * as tf from "@tensorflow/tfjs" // Use tfjs-node for speed
import * as mobilenet from "@tensorflow-models/mobilenet"
import { createCanvas, loadImage } from "canvas"

// Preload model once
let model
const loadModel = async () => {
  if (!model) {
    model = await mobilenet.load()
  }
  return model
}

/**
 * Analyze multiple images but return only one final object
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<{severity: string, category: string, confidence: number}>}
 */
export const analyzeImageSeverity = async (imageUrls) => {
  try {
    const model = await loadModel()

    // Define category keywords
    const categoryMap = {
      INFRASTRUCTURE: [
        "building",
        "construction",
        "bridge",
        "road",
        "house",
        "architecture",
      ],
      SANITATION: ["garbage", "trash", "waste", "pollution", "litter", "dump"],
      TRAFFIC: [
        "car",
        "traffic",
        "vehicle",
        "automobile",
        "bus",
        "truck",
        "accident",
      ],
    }

    let bestResult = {
      severity: "LOW",
      category: "UNKNOWN",
      confidence: 0,
    }

    for (const imageUrl of imageUrls) {
      try {
        const img = await loadImage(imageUrl)
        const canvas = createCanvas(img.width, img.height)
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        const predictions = await model.classify(canvas)

        let maxScore = 0
        let detectedCategory = "UNKNOWN"

        predictions.forEach((prediction) => {
          for (const [category, keywords] of Object.entries(categoryMap)) {
            if (
              keywords.some((keyword) =>
                prediction.className.toLowerCase().includes(keyword)
              ) &&
              prediction.probability > maxScore
            ) {
              maxScore = prediction.probability
              detectedCategory = category
            }
          }
        })

        let severity = "LOW"
        if (maxScore >= 0.7) severity = "CRITICAL"
        else if (maxScore >= 0.5) severity = "HIGH"
        else if (maxScore >= 0.3) severity = "MEDIUM"

        // Keep only the best result overall
        if (maxScore > bestResult.confidence) {
          bestResult = {
            severity,
            category: detectedCategory,
            confidence: Math.round(maxScore * 100) / 100,
          }
        }
      } catch (imgError) {
        console.warn(
          `Skipping image ${imageUrl} due to load/classify error:`,
          imgError.message
        )
      }
    }

    return bestResult
  } catch (error) {
    console.error("Image severity analysis failed:", error)
    return { severity: "LOW", category: "UNKNOWN", confidence: 0 }
  }
}
