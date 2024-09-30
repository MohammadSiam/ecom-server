import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthMechanism } from 'mongodb'; // Import AuthMechanism

dotenv.config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) { }

    public getMongoConfig(): MongooseModuleOptions {
        return {
            uri: this.env.DB_CONNECTION_STRING, // Full connection string from .env
            dbName: this.env.DB_NAME,           // The database name
            authMechanism: this.getAuthMechanism(), // Auth mechanism, validated below
            authSource: 'admin',  // The database for authentication, can vary depending on your MongoDB setup
            user: this.env.DB_NAME, // Use the username from the connection string (emaDbUser)
            pass: this.env.DB_PASSWORD, // Use the password from .env
        };
    }

    // Helper to map the auth mechanism from the environment to a valid MongoDB auth mechanism
    private getAuthMechanism(): AuthMechanism | undefined {
        const mechanism = this.env.DB_AUTH_MECHANISM;

        // Ensure the auth mechanism is a valid MongoDB auth mechanism
        if (mechanism === 'SCRAM-SHA-1' || mechanism === 'SCRAM-SHA-256' || mechanism === 'DEFAULT') {
            return mechanism as AuthMechanism;
        }

        // Return undefined if no valid auth mechanism is set, MongoDB will use default
        return undefined;
    }
}

const configService = new ConfigService(process.env);

export default configService;
