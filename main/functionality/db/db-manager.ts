import * as mongoose from "mongoose";
import * as moment from "moment";
import { IUserData } from "../../definitions/interfaces/IUserData";
import { userDataSchema } from "../../definitions/mongoose-related";
import { User, UserData } from "../../definitions";

/**
 * A database manager for a specified channel
 */
export class DataBaseManager {
    private userModel: mongoose.Model<IUserData>;
    private dbConnection: mongoose.Connection;

    constructor(private channelName: string) {
        this.connect(this.channelName);
        this.initializeMongooseInternals();
    }

    private connect(channelName: string): void {
        (<any>mongoose).Promise = global.Promise;
        this.dbConnection = mongoose.createConnection("mongodb://localhost/" + channelName);
    }

    private initializeMongooseInternals(): void {
        this.userModel = this.dbConnection.model<IUserData>("User", userDataSchema);
    } 

    public removeUser(userName: string): void {
        this.userModel.remove({ userName: userName }, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }

    public updateUser(userName: string, userData: UserData): void {
        this.userModel.findOneAndUpdate({ userName: userName },
            {
                currencies: userData.currencies,
                userName: userData.userName,
                gambling: userData.gambling.time,
                permission: userData.permission
            },
            (err, user) => {
                if (err) {
                    console.log(err);
                }
            });
    }

    /**
     * Registers a new user entry into the database
     * @param {User} user The user to register into the database
     */
    public registerUser(user: User): Promise<IUserData> {
        return new Promise<IUserData>((res, rej) => {
            let documentUser = new this.userModel(
                {
                    gambling: user.data.gambling.time,
                    currencies: user.data.currencies,
                    permission: user.data.permission,
                    userName: user.data.userName
                });
            documentUser.save((err, userData) => {
                if (err || !userData) {
                    console.log(`Error registering new user: ${err}`);
                    rej(err);
                }
                res(userData);
            });
        })
    }

    /** Gets a specific user from the db.
     * @param {string} userName User name to be searched.
     */
    public getUser(userName: string): Promise<IUserData> {
        return new Promise<IUserData>((res, rej) => {
            this.userModel.findOne({ userName: userName }, (err, userData) => {
                if (userData) {
                    userData = <IUserData>
                        {
                            userName: userData.userName,
                            currencies: userData.currencies,
                            gambling: userData.gambling,
                            permission: userData.permission
                        };
                }
                res(userData);
            })
        });
    }
}