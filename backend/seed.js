require('dotenv').config();
const mongoose=require('mongoose');
const User=require('./src/models/User');
const Event=require('./src/models/Event');
const generateEventId=require('./src/utils/eventId');
const bcrypt=require('bcryptjs');

mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/eventease',{useNewUrlParser:true,useUnifiedTopology:true}).then(async()=>{
  console.log('Connected');await User.deleteMany({});await Event.deleteMany({});const adminPass=process.env.ADMIN_PASSWORD||'admin123';const admin=new User({name:'Admin',email:process.env.ADMIN_EMAIL||'admin@example.com',password:await bcrypt.hash(adminPass,10),role:'admin'});await admin.save();const now=new Date();const ev1=new Event({title:'React Native Workshop',description:'Learn RN basics',category:'Tech',locationType:'In-Person',location:'Bengaluru',startDate:new Date(now.getTime()+1000*60*60*24*5),endDate:new Date(now.getTime()+1000*60*60*24*5),capacity:30,eventId:generateEventId(new Date(now.getTime()+1000*60*60*24*5))});const ev2=new Event({title:'Live Music Concert',description:'An evening of music',category:'Music',locationType:'In-Person',location:'Mumbai',startDate:new Date(now.getTime()+1000*60*60*24*15),endDate:new Date(now.getTime()+1000*60*60*24*15),capacity:100,eventId:generateEventId(new Date(now.getTime()+1000*60*60*24*15))});await ev1.save();await ev2.save();console.log('Seeded');process.exit(0);
}).catch(err=>{console.error(err);process.exit(1);});
