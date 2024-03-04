const Test = require('../models/test');

exports.getAllSentiments = async (req, res) => {
  try {
    const sentimentCounts = await Test.aggregate([
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

    const result = {};
    sentimentCounts.forEach(sentiment => {
      result[`${sentiment._id}Count`] = sentiment.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error counting sentiments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRecentSentiments = async (req, res) => {
    try {
      const sentiments = await Test.find();
      res.status(200).json({
          success: true,
          sentiments,
      });
    } catch (error) {
      console.error('Error fetching sentiments', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error',
      });
  }
};

