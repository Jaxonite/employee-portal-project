// @desc    Send a message to the chatbot
// @route   POST /api/chatbot/ask
// @access  Private
const askChatbot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Please provide a message' });
  }

  try {
    let aiResponse;
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        aiResponse = `Hello ${req.user.name}! Welcome to Innovate Inc. How can I help you with your onboarding today?`;
    } else if (lowerCaseMessage.includes('policy') || lowerCaseMessage.includes('handbook')) {
        aiResponse = "You can find the company handbook and all related policies in the 'Documents' section of the portal.";
    } else if (lowerCaseMessage.includes('leave') || lowerCaseMessage.includes('vacation')) {
        aiResponse = "Our leave policy includes 20 paid vacation days per year. For sick leave and other details, please refer to the employee handbook in the 'Documents' section.";
    } else if (lowerCaseMessage.includes('it support') || lowerCaseMessage.includes('email')) {
        aiResponse = "To set up your email or for any IT issues, please contact the IT helpdesk at support@innovate.inc or visit them on the 3rd floor.";
    } else {
        aiResponse = "That's a great question. I'd recommend reaching out to our HR department directly at hr@innovate.inc for the most accurate information.";
    }
    
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('Error with chatbot:', error);
    res.status(500).json({ message: 'Something went wrong with the AI assistant.' });
  }
};

module.exports = { askChatbot };