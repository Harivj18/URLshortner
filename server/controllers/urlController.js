const Url = require('../models/urlSchema');
const { v4: uuidv4 } = require('uuid');

const generateShortCode = () => uuidv4().replace(/-/g, '').slice(0, 7);

module.exports = {

    shortenUrl: async (req, res) => {
        const { originalUrl } = req.body;

        if (!originalUrl?.trim()) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            let url = await Url.findOne({ originalUrl: originalUrl.trim() });
            if (url) {
                return res.json({
                    status: true,
                    shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
                    shortCode: url.shortCode,
                    originalUrl: url.originalUrl,
                    clicks: url.clicks,
                    createdAt: url.createdAt,
                });
            }

            const shortCode = generateShortCode();

            url = new Url({
                originalUrl: originalUrl.trim(),
                shortCode,
            });

            await url.save();

            res.status(201).json({
                status: true,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
                shortCode,
                originalUrl: url.originalUrl,
                clicks: 0,
                createdAt: url.createdAt,
            });
        } catch (err) {
            console.error('urlController.js: shortenUrl => Unable to Shorten URL error:', err);
            res.status(500).json({
                status: false,
                error: 'Unable to Shorten URL'
            });
        }
    },

    redirectToOriginal: async (req, res) => {
        try {
            const url = await Url.findOneAndUpdate(
                { shortCode: req.params.shortCode },
                { $inc: { clicks: 1 } },
                { new: true }
            );

            if (!url) {
                return res.status(404).json({
                    status: false,
                    error: 'Short link not found'
                });
            }
            res.redirect(url.originalUrl);
        } catch (err) {
            console.error('urlController.js:redirectToOriginal => Something wrong while redirecting the original url:', err);
            res.status(500).json({
                status: false,
                error: 'Unable to redirecting the original url'
            });
        }
    },

    getStats: async (req, res) => {
        try {
            const url = await Url.findOne({ shortCode: req.params.shortCode });
            if (!url) return res.status(404).json({
                status: false,
                error: 'Not found'
            });

            res.json({
                status: true,
                shortCode: url.shortCode,
                originalUrl: url.originalUrl,
                clicks: url.clicks,
                createdAt: url.createdAt,
            });
        } catch (err) {
            console.error('urlController.js:getStats => Unable to get the stats for shortcode:', err);
            res.status(500).json({
                status: false,
                error: 'Stats for Shortcode'
            });
        }
    },

    getAllLinks: async (req, res) => {
        try {
            const urls = await Url.find().sort({ createdAt: -1 });
            res.json(urls);
        } catch (err) {
            console.error('urlController.js:getAllLinks => Issue while list the url link', err);
            res.status(500).json({
                status: false,
                error: 'Not able to list the link'
            });
        }
    },

    deleteLink: async (req, res) => {
        try {
            const result = await Url.findByIdAndDelete(req.params.id);
            if (!result) return res.status(404).json({ 
                status: false,
                error: 'Link not found'
            });

            res.json({
                status: true,
                message: 'Link deleted successfully'
            });
        } catch (err) {
            console.error('urlController.js: deleteLink => Not able to delete the link from db', err);
            res.status(500).json({
                status: false,
                error: 'Not able to delete the link'
            });
        }
    }
}