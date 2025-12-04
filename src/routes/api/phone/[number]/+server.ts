import type { RequestHandler } from './$types';
import db from '$lib/database.js';

export const GET: RequestHandler = async ({ params }) => {
	const { number } = params;

	try {
		let count: number;

		if (number.length === 3) {
			const stmt = db.prepare('SELECT COUNT(*) as count FROM phones WHERE substr(number, -3) = ?');
			const result = stmt.get(number) as { count: number };
			count = result.count;
		} else {
			const stmt = db.prepare('SELECT COUNT(*) as count FROM phones WHERE number = ?');
			const result = stmt.get(number) as { count: number };
			count = result.count;
		}

		return new Response(
			JSON.stringify({
				exists: count > 0
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
