const express = require('express')
const cors = require('cors')

const dataRoutes = require('./routes/data.routes')
const dataHandler = require('./data.handler')

const initServer = async () => {
    const PORT = process.env.PORT || 7002
    const app = express()
    app.use(cors())
    app.use(express.json())
    
    app.use('/api/v1/data', dataRoutes)
    app.get('/', (req, res) => {
        return res.status(200).json({ message: 'SkyGeni backend is accessible' });
    })
    
    app.listen(PORT, () => {
        console.log(`SkyGeni Backend started on PORT: ${PORT}`)
        dataHandler.initData()
    }).on('error', (err) => {
        console.log(`Error while starting SkyGeni Backend`)
        console.log({err})
        process.exit()
    })
}

initServer()