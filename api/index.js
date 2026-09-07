const app = require('../server');

module.exports = (req, res, next) => {
	if (req.url && !req.url.startsWith('/api')) {
		req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
	}
	return app(req, res, next);
};