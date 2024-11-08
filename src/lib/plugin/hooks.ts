import type { AstroIntegration } from 'astro';

export const DevLoaderSetup: AstroIntegration = {
    name: 'sqlite-setup-hook',
    hooks: {
        'astro:server:setup': async ({ server, refreshContent }) => {
            server.middlewares.use('/_refresh_content', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end('Method Not Allowed');
                    return;
                }
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    try {
                        const webhookBody = JSON.parse(body);
                        await refreshContent?.({
                            context: { webhookBody },
                            loaders: ['astro-directus-blog-loader'],
                        });
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        res.end(
                            JSON.stringify({
                                message: 'Content refreshed successfully',
                            }),
                        );
                    } catch (error: any) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        });
                        res.end(
                            JSON.stringify({
                                error:
                                    'Failed to refresh content: ' +
                                    error.message,
                            }),
                        );
                    }
                });
            });
        },
    },
};
