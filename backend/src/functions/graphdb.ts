import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.NEO4J_CONNECTION)

const createSession = () => {
    const driver = neo4j.driver(
        process.env.NEO4J_CONNECTION as string,
        neo4j.auth.basic(
            process.env.NEO4J_USERNAME as string,
            process.env.NEO4J_PASSWORD as string
        )
    );
    return driver.session();
};

export const graphdb = {
    createPerson: async (name: string, email: string) => {
        const session = createSession();
        try {
            const response = await session.run(
                `MERGE (p:Person {email: $email})
                 ON CREATE SET p.name = $name
                 RETURN p`,
                { name, email }
            );
            return response.records;
        } finally {
            session.close();
        }
    },

    createRelationship: async (from: string, to: string, relationship: string) => {
        const session = createSession();
        try {
            const response = await session.run(`
                MATCH (fromNode:Person { name: $from }), (toNode:Person { name: $to })
                MERGE (fromNode)-[r:${relationship.toUpperCase()}]->(toNode)
                RETURN r
            `, { from, to });
            return response.records;
        } finally {
            session.close();
        }
    },

    findPersonByEmail: async (email: string) => {
        const session = createSession();
        try {
            const response = await session.run(`MATCH(n:Person {email: $email}) RETURN n`, { email });
            if (response.records.length === 0) {
                return [];
            }
            return response.records[0].get("n").properties;
        } finally {
            session.close();
        }
    },

    matchRelationship: async (fromStr: string, toStr: string, relationship: string) => {
        const session = createSession()
        try {
            const response = await session.run(`
                MATCH (from:Person {name: $fromStr})-[rels]->(to:Person {name: $toStr})
                RETURN from, to, collect(type(rels)) AS relationships
            `, { fromStr, toStr, relationship })

            if (response.records.length === 0) {
                console.log("No records found")
                return undefined
            }

            const record = response.records[0];
            const from = record.get("from").properties
            const to = record.get("to").properties
            const relationships = record.get("relationships")

            // Check if the relationship is included in the list of all relationships
            if (!relationships.includes(relationship.toUpperCase())) {
                return undefined
            }

            return { from, to, relationships }
        } finally {
            session.close()
        }
    }
};