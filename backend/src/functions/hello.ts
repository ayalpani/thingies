import { Handler } from '@netlify/functions';
import dotenv from "dotenv";
import { graphdb } from "./graphdb";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config();
console.log(process.env.NEO4J_CONNECTION)

// export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
export const handler: Handler = async () => {
    // const result = await session.run("MATCH (n) RETURN n LIMIT 10")
    await graphdb.createPerson("Arash", "arash@example.org")
    await graphdb.createPerson("Maria", "maria@example.org")
    await graphdb.createRelationship("Arash", "Maria", "knows")
    await graphdb.createRelationship("Maria", "Arash", "likes")

    graphdb.findPersonByEmail("arash@example.org").then(console.log)
    // graphdb.matchRelationship("Arash", "Maria", "likes").then(console.log)

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello, World!" }),
    };
};