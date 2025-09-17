
const longPollingRouter = require('express').Router()

let data = 'initial data'

const waitingClientsList = []

longPollingRouter.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

longPollingRouter.get('/getData',(req,res)=>{
    const lastData = req.query.lastData
    if(data !== lastData){
        res.send({data})
    }else{
        waitingClientsList.push(res)
    }
}) 

longPollingRouter.put('/updateData',(req,res)=>{
    data = req.body.data
    while(waitingClientsList.length > 0){
        const client = waitingClientsList.pop()
        client.send({data})
    }
    res.send({message:"Success"})
})

module.exports = longPollingRouter