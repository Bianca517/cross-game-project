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
}