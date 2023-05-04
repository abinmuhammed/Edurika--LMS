const { response, json } = require("express");
const asynchandler = require("express-async-handler");
const Conversation = require("../Model/Conversation");
const Messages = require("../Model/Message");

//new Conversation Api

const savemembers = asynchandler(async (req, res) => {
  console.log(req.body);
  const members = [req.body.senderId, req.body.receiverId];
  try {
    await Conversation.create({
      members,
    }).then((response) => {
      res.json(response);
    });
  } catch (error) {
    res.json(error);
  }
});

// get Conversation api

const getConversation = asynchandler(async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AddMessages

const AddMessage = asynchandler(async (req, res) => {
  console.log(req.body);
  const newMessage = new Messages(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getMessages = asynchandler(async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.conversationId,
    });
    
    res.status(201).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get Conversation Between Two users

const SearchConv = async (req, res) => {
  const { firstUserID, secondUserID } = req.params;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserID, secondUserID] },
    });
    if (conversation) {
      res.status(200).json({conversation:conversation});
    } else {
      try {
        const members=[firstUserID,secondUserID]
        await Conversation.create({
          members,
        }).then((response) => {
          res.json({conversation:response});
        });
      } catch (error) {
        res.json(error);
      }
    }
  } catch (error) {}
};


module.exports = {
  savemembers,
  getConversation,
  AddMessage,
  getMessages,
  SearchConv
};
