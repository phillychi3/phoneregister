import type { RequestHandler } from './$types';
import Database from 'better-sqlite3';

const db = new Database('phones.db');

// 建立資料表
db.exec(`
  CREATE TABLE IF NOT EXISTS phones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL
  )
`);

export const GET: RequestHandler = async () => {
	try {
		const stmt = db.prepare('SELECT number FROM phones ORDER BY number ASC');
		const phones = stmt.all().map((row) => row.number);

		return new Response(JSON.stringify({ phones }), {
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

export const POST: RequestHandler = async ({ request }) => {
	const { phoneNumber } = await request.json();

	try {
		const stmt = db.prepare('INSERT INTO phones (number) VALUES (?)');
		stmt.run(phoneNumber);

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
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
