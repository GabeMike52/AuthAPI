import * as express from 'npm:express';
import cors from 'npm:cors';
import { Schema, model, connect } from 'npm:mongoose';

//Setting stuff up
connect('mongodb:localhost:27017/users') 
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.error('MOngoDB connection error: ', err));

const _corsOptions = {
	origin: '*',
};

const app = express();
app.use(cors());
app.use(express());

interface IUser {
	name: string;
	email: string;
	password: string;
}

const userSchema = new Schema<IUser>({
	name: { type: String, required: true, minLength: 4, },
	email: { type: String, required: true, unique: true, },
	password: { type: String, required: true, minlength: 6 }
});

const User = model<IUser>('User', userSchema);

//Endpoints
app.post('register', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });
		if(userExists) {
			res.status(400).send({ error: 'Email already in use!' });
		}
		const user = new User({ name, email, password });
		await user.save();
		res.status(201).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});