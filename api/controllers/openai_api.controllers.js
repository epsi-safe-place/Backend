const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

// OpenAI API base URL
const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Moderation API: Handle moderation for text and image URLs
exports.moderateContent = async (req, res) => {
  try {
    // Example request body for moderation
    const moderationRequestBody = {
      model: "omni-moderation-latest",
      input: req.body.input // Expect input from the request to be an array of text/image moderation types
    };

    // Request to OpenAI Moderation API
    const response = await fetch(`${OPENAI_API_BASE_URL}/moderations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moderationRequestBody)
    });

    const data = await response.json();

    res.status(200).json(data); // Send the moderation results
  } catch (error) {
    console.error('Error with OpenAI Moderation API:', error.message);
    res.status(500).json({ error: 'Failed to moderate content' });
  }
};

// Rephrasing API: Handle rephrasing using the provided logic and GPT-4o-mini
exports.rephraseContent = async (req, res) => {
  try {
    const { analysisResult, originalMessage } = req.body;

    // Generate the messages using the custom function you provided
    const messages = generateRephrasingMessage(analysisResult, originalMessage);

    // Request to OpenAI GPT-4o-mini for rephrasing
    const response = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages
      })
    });

    const data = await response.json();
    const rephrasedContent = data.choices[0].message.content.replaceAll("\"","");

    res.status(200).json({ rephrasedContent }); // Send the rephrased content
  } catch (error) {
    console.error('Error with OpenAI Rephrasing API:', error.message);
    res.status(500).json({ error: 'Failed to rephrase content' });
  }
};

// Function to generate messages based on the analysis result and original message
const generateRephrasingMessage = (analysisResult, originalMessage) => {
  const { results } = analysisResult;

  // Extract detected toxic categories
  const toxicCategories = Object.keys(results.categories).filter(
    (category) => results.categories[category] === true
  );

  // Map categories to readable names
  const readableCategories = toxicCategories.map(
    (cat) => traductionsCategories[cat] || cat
  );

  // Build system content based on detected toxic categories
  let systemContent = `Vous êtes un expert en communication saine.`;

  if (readableCategories.length > 0) {
    systemContent += ` Le message de l'utilisateur contient des éléments pouvant être considérés comme ${readableCategories.join(
      ', '
    )}. Veuillez aider à reformuler le message pour qu'il soit plus positif et moins toxique tout en conservant son intention initiale.`;
  } else {
    systemContent += ` Le message de l'utilisateur est généralement acceptable, mais veuillez vous assurer qu'il promeut une communication saine en le reformulant si besoin.`;
  }

  // Create the messages for the API call
  const messages = [
    {
      role: 'system',
      content: systemContent,
    },
    {
      role: 'user',
      content: `Message original : "${originalMessage}"`,
    },
    {
      role: 'assistant',
      content: 'Message reformulé :',
    },
  ];

  console.log(messages)
  return messages;
};
