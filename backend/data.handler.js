const fs = require('fs')
const path = require('path');

class DataHandler {
    constructor() {
        this.accIndData = []
        this.acvRangeData = []
        this.cusTypeData = []
        this.teamData = []
    }

    getFileData(filepath) {
        return new Promise((res, rej) => {
            fs.readFile(filepath, 'utf8', (err, file) => {

                // check for any errors
                if (err) {
                    console.error({err})
                    rej(err)
                }
                try {
                    const data = JSON.parse(file)
                    // output the parsed data
                    // console.log({data})
                    res(data)
                } catch (err) {
                    console.error({err})
                    rej(err)
                }
            })
        })
    }

    async readTeamData() {
        const filepath = path.join(__dirname, './data/team.json');
        const { err, data } = await this.getFileData(filepath)
        .then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }))
        if (err) {
            console.error('Error while reading the file')
            return
        }
        this.teamData = data
        // console.log({teamData: this.teamData})
    }

    async readAccountIndustryData() {
        const filepath = path.join(__dirname, './data/account_industry.json');
        const { err, data } = await this.getFileData(filepath)
        .then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }))
        if (err) {
            console.error('Error while reading the file')
            return
        }
        this.accIndData = data
        // console.log({accIndData: this.accIndData})
    }

    async readACVRangeData() {
        const filepath = path.join(__dirname, './data/acv_range.json');
        const { err, data } = await this.getFileData(filepath)
        .then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }))
        if (err) {
            console.error('Error while reading the file')
            return
        }
        this.acvRangeData = data
        // console.log({acvRangeData: this.acvRangeData})
    }

    async readCustomerTypeData() {
        const filepath = path.join(__dirname, './data/customer_type.json');
        const { err, data } = await this.getFileData(filepath)
        .then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }))
        if (err) {
            console.error('Error while reading the file')
            return
        }
        this.cusTypeData = data
        // console.log({cusTypeData: this.cusTypeData})
    }

    async initData() {
        this.readTeamData()
        this.readAccountIndustryData()
        this.readACVRangeData()
        this.readCustomerTypeData()
    }

    get team() {
        return this.teamData
    }

    get accIndustry() {
        return this.accIndData
    }

    get acvRange() {
        return this.acvRangeData
    }

    get cusType() {
        return this.cusTypeData
    }
}

module.exports = new DataHandler()