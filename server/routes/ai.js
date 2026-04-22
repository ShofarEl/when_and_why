const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Dataset definitions for tasks
const datasets = {
  1: {
    title: "Health Insurance Claims Dataset",
    description: "A comprehensive healthcare dataset containing patient demographics (age, gender, location), treatment costs, diagnosis codes (ICD-10), physician specialties, insurance plan types, claim approval rates, and treatment outcomes. The dataset spans 3 years and includes 50,000+ patient records from a regional insurance network.",
    variables: ["patient_age", "gender", "location", "diagnosis_code", "treatment_cost", "physician_specialty", "insurance_plan", "claim_status", "treatment_outcome", "hospital_type"]
  },
  2: {
    title: "University Student Success Dataset", 
    description: "Educational data tracking student progression through a 4-year computer science program. Includes demographics, course grades, study habits, extracurricular activities, financial aid status, housing arrangements, and graduation outcomes. Contains records for 8,000 students over 10 years.",
    variables: ["student_id", "demographics", "gpa_by_semester", "course_grades", "study_hours", "extracurriculars", "financial_aid", "housing_type", "graduation_status", "time_to_degree"]
  },
  3: {
    title: "E-commerce Customer Behavior Dataset",
    description: "Online retail platform data capturing customer purchase patterns, browsing behavior, product interactions, and demographic information. Includes session data, cart abandonment, product reviews, seasonal trends, and customer lifetime value metrics from 100,000+ customers.",
    variables: ["customer_id", "session_duration", "pages_viewed", "products_clicked", "cart_items", "purchase_amount", "review_ratings", "return_frequency", "seasonal_activity", "device_type"]
  },
  4: {
    title: "Climate and Environmental Monitoring Dataset",
    description: "Multi-sensor environmental data from urban monitoring stations tracking air quality, temperature, humidity, precipitation, wind patterns, and pollution levels. Includes traffic density, industrial activity, and vegetation indices across 50 monitoring locations over 5 years.",
    variables: ["station_id", "temperature", "humidity", "air_quality_index", "pollution_levels", "wind_speed", "precipitation", "traffic_density", "vegetation_index", "industrial_activity"]
  },
  5: {
    title: "Social Media Engagement Dataset",
    description: "Platform analytics data examining user engagement patterns, content performance, and community interactions. Includes post metrics, user demographics, engagement timing, content categories, and viral spread patterns from a social platform with 1M+ active users.",
    variables: ["user_id", "post_type", "engagement_rate", "follower_count", "posting_frequency", "content_category", "interaction_type", "time_of_day", "hashtag_usage", "viral_coefficient"]
  },
  6: {
    title: "Urban Transportation Dataset",
    description: "City-wide transportation data combining public transit usage, traffic patterns, ride-sharing services, and pedestrian flows. Includes route efficiency, peak hour analysis, weather impact, and accessibility metrics across different neighborhoods and transportation modes.",
    variables: ["route_id", "passenger_count", "travel_time", "delay_minutes", "weather_conditions", "peak_hours", "transportation_mode", "neighborhood", "accessibility_score", "cost_efficiency"]
  }
};

// Generate AI suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const { taskId, existingIdeas, participantId, refinementRequest, interactionHistory } = req.body;
    
    if (!datasets[taskId]) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const dataset = datasets[taskId];
    const existingIdeasText = existingIdeas && existingIdeas.length > 0 
      ? existingIdeas.map(idea => `- ${idea}`).join('\n')
      : 'None yet';
    
    // Build context from interaction history
    const interactionContext = interactionHistory && interactionHistory.length > 0
      ? `\n\nPrevious interaction context:\n${interactionHistory.slice(-3).map(i => 
          `- ${i.type}: ${i.refinementRequest || 'Generated suggestions'}`
        ).join('\n')}`
      : '';
    
    // Handle refinement requests
    let refinementPrompt = '';
    if (refinementRequest) {
      refinementPrompt = `\n\nUser's refinement request: "${refinementRequest}"
Please adjust your suggestions based on this feedback.`;
    }
    
    const prompt = `You are helping a data science student practice problem framing.

Dataset: ${dataset.title}
Description: ${dataset.description}
Available variables: ${dataset.variables.join(', ')}

Student's existing ideas:
${existingIdeasText}${interactionContext}${refinementPrompt}

${existingIdeas && existingIdeas.length > 0 
  ? `Based on the student's existing ideas${refinementRequest ? ' and their feedback' : ''}, provide 2-3 suggestions that either:
1. Refine or extend their current ideas with more specific approaches
2. Suggest complementary angles that build on their thinking
3. Propose methodological improvements or additional variables to consider

Focus on helping them develop their own thinking rather than replacing it.`
  : `Provide 2-3 creative research questions or project ideas that explore different angles of this dataset. Focus on encouraging exploration of relationships between variables, potential insights, or practical applications.`
}

Format each as a brief suggestion (1-2 sentences). Make suggestions actionable and specific to help guide their research direction.

Format your response as a simple list with each suggestion on a new line starting with "- ".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for data science education. Provide creative, diverse research ideas that encourage student exploration and build upon their existing thinking."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(suggestion => suggestion.length > 0);

    res.json({
      suggestions,
      success: true
    });

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      suggestions: [
        "Explore relationships between key variables in your dataset",
        "Consider how external factors might influence the patterns you see",
        "Think about practical applications of insights from this data"
      ]
    });
  }
});

// Refine user's own idea
router.post('/refine', async (req, res) => {
  try {
    const { taskId, userIdea, participantId } = req.body;
    
    if (!datasets[taskId]) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    if (!userIdea || userIdea.trim().length === 0) {
      return res.status(400).json({ error: 'No idea provided to refine' });
    }
    
    const dataset = datasets[taskId];
    
    const prompt = `You are helping a data science student refine their research question or project idea.

Dataset: ${dataset.title}
Description: ${dataset.description}
Available variables: ${dataset.variables.join(', ')}

Student's original idea:
"${userIdea}"

Your task is to refine and improve this idea while keeping the core concept intact. Make it:
1. More specific and actionable
2. Better phrased and clearer
3. More aligned with the dataset's capabilities

Provide ONE refined version that improves their original idea. Keep their voice and intent, just make it better.

Return ONLY the refined idea text, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for data science education. Refine student ideas while preserving their original intent and giving them ownership."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const refinedIdea = completion.choices[0].message.content.trim();

    res.json({
      refinedIdea,
      originalIdea: userIdea,
      success: true
    });

  } catch (error) {
    console.error('Error refining idea:', error);
    res.status(500).json({ 
      error: 'Failed to refine idea',
      message: 'Please try again or continue with your original idea.'
    });
  }
});

// Get dataset information
router.get('/datasets/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  
  if (!datasets[taskId]) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  res.json(datasets[taskId]);
});

// Get all datasets
router.get('/datasets', (req, res) => {
  res.json(datasets);
});

module.exports = router;