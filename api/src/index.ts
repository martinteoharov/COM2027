/* eslint-disable @typescript-eslint/no-var-requires */

import fastify from "fastify";
import { connectToDB } from "./db";

const App = (async () => {
    // Note: Ensure connection to DB is established, before importing any routes
    await connectToDB();

    const app = fastify({
        logger: true
    })
        .register(require('./routes/auth'), { prefix: '/auth/' });

    app.listen(80, '0.0.0.0')
})();

export { App };
