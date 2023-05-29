import RowDataPacket from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import { User } from '../models/user';
import db from '../util/database';

export class UserRepository {
    static async saveUser(user: User): Promise<any> {
        const result = db.execute(
            'INSERT INTO users (firstName, lastName, email, password, gamesWon) VALUES (?, ?, ?, ?, ?)',
            [user.firstName, user.lastName, user.email, user.password, 0]
          );
    }

    static async findUserByEmail(email : String): Promise<User | null> {
        //need to use await for db operations, otherwise => undefined
        const result = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const rows = result[0] as RowDataPacket[];
    
        if (rows.length > 0) {
            const user: User = rows[0] as User;
            return user;
        }
        else {
            return null;
        }
    }

    static async getNrOfGamesWonByEmail(email: String): Promise<number | null> {
        //need to use await for db operations, otherwise => undefined
        const result = await db.execute('SELECT gamesWon FROM users WHERE email = ?', [email]);
        const firstRow = result[0] as RowDataPacket[];

        if (firstRow.length > 0) {
            const gamesWon: number = firstRow[0].gamesWon;
            return gamesWon;
        }
        else {
            return null;
        }
    }

    static async updateGamesWonOfUserByEmail(email: String, nrGamesWon: number): Promise<boolean> {
        try {
          // Execute the SQL query to update the user's gamesWon field
          await db.execute('UPDATE users SET gamesWon = ? WHERE email = ?', [nrGamesWon, email]);
          return true;
        } catch (error) {
            console.log("Could not update user's games won field in db!");
            return false;
        }
      }
}