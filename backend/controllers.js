const { openai } = require("./openaiService");

const generateQuestions = async (req, res) => {
  const topic = req.body.topic;
  try {
    let allQuestions = [];

    // Generate 10 different questions
    for (let i = 0; i < 10; i++) {
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Generate UX interview questions about: ${topic} to show the complete process`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });
      const mainQuestion = gptResponse.data.choices[0].message.content.trim();
      console.log("GPT Response:", gptResponse); // Add this line

      // Generate 4 similar questions for each main question
      let similarQuestions = [mainQuestion];
      for (let j = 0; j < 3; j++) {
        const similarResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `Generate a similar question to: ${mainQuestion}`,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        });
        similarQuestions.push(
          similarResponse.data.choices[0].message.content.trim()
        );
      }

      allQuestions.push(similarQuestions);
    }

    res.json({ allQuestions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Error generating questions" });
  }
};

const analyzeSentiment = async (req, res) => {
  const text = req.body.text;
  const prompt = `The following text: "${text}" expresses a sentiment that is:`;
  try {
    const response = await openai.chat.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 10,
      temperature: 0.0,
    });
    const sentiment = response.data.choices[0].text.trim();
    res.json({ sentiment: sentiment });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Error analysis" });
  }
};

module.exports = {
  generateQuestions,
  analyzeSentiment,
};
