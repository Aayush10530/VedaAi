import mongoose from 'mongoose';
const S = new mongoose.Schema({ name: String });
const M = mongoose.model('TestModel123', S);
const doc = new M({ name: 'test' });
console.log(JSON.stringify(doc.toObject()));
