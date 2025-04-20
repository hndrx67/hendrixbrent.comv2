const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Add method to get visits by date range
visitSchema.statics.getVisitsByDateRange = async function(startDate, endDate) {
    return this.find({
        timestamp: {
            $gte: startDate,
            $lte: endDate
        }
    });
};

module.exports = mongoose.models.Visit || mongoose.model('Visit', visitSchema);