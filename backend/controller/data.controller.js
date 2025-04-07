const dataHandler = require('../data.handler');

module.exports.getTeamData = async (req, res) => {
    return res.status(200).json({ message: 'Team Data', data: dataHandler.team });
}

module.exports.getAccIndData = async (req, res) => {
    return res.status(200).json({ message: 'Team Data', data: dataHandler.accIndustry });
}