import typeorm, {DataSource} from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.db_host || 'localhost',
    port: parseInt(process.env.db_port || '3306'),
    username: process.env.db_user || 'root',
    password: process.env.db_password || "",
    database: process.env.db_name || 'content',
    entities: [],
    synchronize: true,
    logging: true,
});

export const connectSqldb = async () => {
    try{
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!")
    }catch(error){
        console.error("Error during Data Source initialization", error)
    }
    
}
export default AppDataSource