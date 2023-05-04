const express=require('express')
const Router=express.Router()
const Conversation=require('../Model/Conversation')
const { savemembers,getConversation,AddMessage,getMessages,SearchConv } = require('../controller/chatController')


Router.post('/Chat/conversation',savemembers)
Router.get('/chat/conversation/:userId',getConversation)
Router.post('/chat/message',AddMessage)
Router.get('/chat/message/:conversationId',getMessages)
Router.get('/chat/newConversation/:firstUserID/:secondUserID',SearchConv)




module.exports=Router