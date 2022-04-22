import { FastifyInstance } from 'fastify';

import 'reflect-metadata';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import review_req from '../common/review_req';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { authenticateAccessToken } from '../services/jwt';
import { verify_publication } from '../services/publication_helper';
import { create_review } from '../services/review_helper';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.post('/submit', async (req, res) => pipe(req.body, review_req.decode, fold(
            async () => res.code(400).send({ error: 'Invalid request body' }),
            async (request) => {
                const user = await authenticateAccessToken(req, res);
                if (user === undefined) {
                    res.code(401).send({ error: 'Unauthorised' });
                    return
                }
                const publication = await verify_publication(connection, request.url);
                if (!publication) { // If publication does not exist, create it
                    res.code(400).send({ error: 'Invalid URL provided' });
                    return
                }
                
                if (await create_review(connection, user, publication, request.review)) {
                    return res.code(200).send({ ok: 'Review submitted' });
                }
                return res.code(400).send({ error: 'Invalid review' });
            }
        ))
    )

    done();
}
