import mongoose from 'mongoose';

mongoose.connect(
    'mongodb://localhost:27017/userInfo_db',
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!');
});

const userInfoSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: false}
});

const User = mongoose.model("User", userInfoSchema);

const createUser = async (name, age, email, phoneNumber) => {
    // Call the constructor to create an instance of the model class Movie
    const user = new User({ name: name, age: age, email: email, phoneNumber: phoneNumber });
    // Call save to persist this object as a document in MongoDB
    return user.save();
}

const findUser = async (filter) => {
    const query = User.find(filter);
    if(filter.length > 0){
      query.and(filter);
    }
    return query.exec();
}

const replaceUser = async (_id, name, age, email, phoneNumber) => {
    const result = await User.findOneAndUpdate({ _id: _id },
        { name: name, age: age, email: email, phoneNumber: phoneNumber });
    return result.modifiedCount;
}

const deleteByquery = async (query) => {
    const result = await User.deleteMany(query);
    return result.deletedCount;
}

export { createUser, findUser, replaceUser, deleteByquery };