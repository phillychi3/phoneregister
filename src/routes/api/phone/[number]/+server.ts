import type { RequestHandler } from './$types';
import Database from 'better-sqlite3';

const db = new Database('phones.db');

export const GET: RequestHandler = async ({ params }) => {
    const { number } = params;

    try {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM phones WHERE number = ?');
        const result = stmt.get(number);

        return new Response(
            JSON.stringify({
                exists: result.count > 0
            }),
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: error.message
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    const { number } = params;

    try {
        const stmt = db.prepare('DELETE FROM phones WHERE number = ?');
        stmt.run(number);

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: error.message
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};