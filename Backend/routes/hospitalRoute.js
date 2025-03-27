import express from 'express'
import { hospitalList } from '../controllers/hospitalContorller.js';
import authUser from '../middlewares/authUser.js';







const hospitalRouter=express.Router()

hospitalRouter.get('/list',hospitalList)


export default hospitalRouter

