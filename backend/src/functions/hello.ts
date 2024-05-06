import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent,
    context: HandlerContext) => {
    const rawNetlifyContext = context.clientContext?.custom.netlify;
    const netlifyContext = Buffer.from(rawNetlifyContext, 'base64').toString('utf-8');
    const { identity, user } = JSON.parse(netlifyContext);
    console.log({ identity, user })

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello, World!" }),
    };
};