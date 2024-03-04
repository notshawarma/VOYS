const Test = require('../models/test');
const axios = require('axios');
const TestProgram = require('../models/testprogram');
const Program = require('../models/program');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.newTextAnalysis = async (req, res, next) => {
	try {
		const { text } = req.body;

    const options = {
			method: "POST",
			url: "https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1",
			headers: {
				"content-type": "application/json",
				"x-rapidapi-host": "text-analysis12.p.rapidapi.com",
				"x-rapidapi-key": "d8ca78a0demshf822ecdc63bdb3ep1ca364jsn9b5bb6bba77e",
			},
			data: {
				language: "english",
				text: text,
			},
		};
		const response = await axios.request(options);

		const { sentiment } = response.data;
		const test = new Test({ text, sentiment });
		await test.save();

		res.status(201).json({ success: true, message: 'Text sentiment data saved successfully' });
	} catch (error) {
		console.error('Error saving text sentiment data:', error);
		res.status(500).json({ success: false, message: 'Failed to save text sentiment data' });
	}
};

exports.newProgramAnalysis = async (req, res, next) => {
  try {
      const { text, programId } = req.body;

      const program = await Program.findById(programId);
      if (!program) {
          return res.status(404).json({ success: false, message: 'Program not found', programId });
      }

      const translationOptions = {
          method: 'POST',
          url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
          headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-RapidAPI-Key': 'ea98521173msh09acc3df674a20fp17fe08jsn7e35691b0240',
              'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
          },
          data: new URLSearchParams({
              from: 'auto',
              to: 'en',
              text: text
          }),
      };
      const translationResponse = await axios.request(translationOptions);

      console.log("Translation Response:", translationResponse.data);

      if (!translationResponse.data || !translationResponse.data.trans) {
          throw new Error("Translation failed");
      }

      const translatedText = translationResponse.data.trans;
      console.log("Translated Text:", translatedText);

      const sentimentOptions = {
          method: 'POST',
          url: 'https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1',
          headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': 'd8ca78a0demshf822ecdc63bdb3ep1ca364jsn9b5bb6bba77e',
              'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
          },
          data: {
              language: 'english',
              text: translatedText
          }
      };
      const sentimentResponse = await axios.request(sentimentOptions);

      console.log("Sentiment Response:", sentimentResponse.data);

      if (!sentimentResponse.data || !sentimentResponse.data.sentiment) {
          throw new Error("Sentiment analysis failed");
      }

      const sentimentResult = sentimentResponse.data.sentiment;
      console.log("Sentiment Result:", sentimentResult);

      const testprogram = new TestProgram({ program: program._id, text: translatedText, sentiment: sentimentResult });
      await testprogram.save();

      res.status(201).json({ success: true, message: 'Text sentiment data saved successfully' });
  } catch (error) {
      console.error('Error saving text sentiment data:', error);
      res.status(500).json({ success: false, message: 'Failed to save text sentiment data', error: error.message });
  }
};

exports.getProgramAnalysis = async (req, res, next) => {
    try {
        const sentiments = await TestProgram.find();
        res.status(200).json({
            success: true,
            sentiments,
        });
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.getSingleProgramAnalysis = async (req, res, next) => {
	const testprogram = await TestProgram.findById(req.params.id);
	if (!testprogram) {
		return res.status(404).json({
			success: false,
			message: 'TestProgram not found'
		})
	}
	res.status(200).json({
		success: true,
		testprogram
	})
}

exports.getAllSentiments = async (req, res) => {
    try {
      console.log('Received Program ID:', req.query.programId);
  
      if (req.query.programId) {
        const selectedProgram = await Program.findById(req.query.programId);
        console.log('Selected Program:', selectedProgram);
  
        const fieldId = selectedProgram._id; // Replace 'fieldId' with the actual field id property
        console.log('Field ID:', fieldId);
      // Use fieldId in the aggregation pipeline
      const sentimentCounts = await TestProgram.aggregate([
        {
          $match: {
              "program": new ObjectId(req.query.programId),
              "sentiment": { $in: ["positive", "negative", "neutral"] }
          }
      },
      {
          $group: {
              _id: "$sentiment",
              count: { $sum: 1 }
          }
      }
  ]);

      const result = {
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
      };

      sentimentCounts.forEach(sentiment => {
        result[`${sentiment._id}Count`] = sentiment.count;
      });

      res.json(result);
    } else {
      // If no program is selected, perform the aggregation without considering field id
      const sentimentCounts = await TestProgram.aggregate([
        {
          $match: {
            "sentiment": { $in: ["positive", "negative", "neutral"] }
          }
        },
        {
          $group: {
            _id: "$sentiment",
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
      };

      sentimentCounts.forEach(sentiment => {
        result[`${sentiment._id}Count`] = sentiment.count;
      });

      res.json(result);
    }
  } catch (error) {
    console.error('Error counting sentiments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
