/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Canvas, Image } from 'cf-canvas';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const text = url.searchParams.get('text') || 'Hello YouTube!';
		return handleText(text);
	},
};

async function handleText(text) {
	const canvas = new Canvas(1280, 720);
	const ctx = canvas.getContext('2d');

	ctx.font = '60px Arial';
	ctx.fillStyle = '#003682';
	ctx.fillText(text, 50, 365);

	const buffer = canvas.toBuffer();
	return new Response(buffer, {
		headers: { 'Content-Type': 'image/png' },
	});
}
