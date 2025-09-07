// const generateUploadUrl = require("../utils/generateUploadUrl");

export const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body
    // const { url, finalUrl } = await generateUploadUrl(fileName, fileType);
    res.json({ url, finalUrl })
  } catch (error) {
    console.error("Error generating upload URL:", error)
    res.status(500).json({ error: "Could not generate upload URL" })
  }
}
