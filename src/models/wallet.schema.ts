import mongoose, {Schema} from 'mongoose';

const WalletSchema: Schema = new Schema({
  name: {type: String, lowerCase: true, unique: true},
  descriptor: String,
  imported: {type: Boolean, default: false}
});

export default mongoose.model('ServerWallet'+process.env.SERVER_ID, WalletSchema);
