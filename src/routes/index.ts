import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from '..';
import { v8App } from './v8';

export const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/ping', (c) => c.text('pong'));

app.route('/v8', v8App);
