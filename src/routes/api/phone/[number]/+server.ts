import type { RequestHandler } from './$types';
import db from '$lib/database.js';

export const GET: RequestHandler = async ({ params }) => {
	const { number } = params;

	try {
		const stmt = db.prepare('SELECT COUNT(*) as count FROM phones WHERE number = ?');
		const result = stmt.get(number) as { count: number };

		return new Response(
			JSON.stringify({
				exists: result.count > 0
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		if (error instanceof Error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			console.error(error);
			return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
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
		if (error instanceof Error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			console.error(error);
			return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}
};
