/* eslint-disable @typescript-eslint/no-var-requires */

import fastify, { FastifyInstance } from "fastify";
import { connectToDB } from "./db";

export const build = async (): Promise<FastifyInstance> => {
    // Note: Ensure connection to DB is established, before importing any routes
    await connectToDB();

    const app = fastify({ logger: true });
    app.register(require('./routes/auth'), { prefix: '/auth/' });
    app.register(require('./routes/review'), { prefix: '/review/' });

    app.listen(80, '0.0.0.0');

    return app;
};

build();
