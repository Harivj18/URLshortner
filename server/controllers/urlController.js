const Url = require('../models/urlSchema');
const { v4: uuidv4 } = require('uuid');

const generateShortCode = () => uuidv4().replace(/-/g, '').slice(0, 7);

module.exports = {

    shortenUrl: async (req, res) => {
        console.log('urlController.js : shortenUrl => Request Received on server');

        const { originalUrl } = req.body;

        if (!originalUrl?.trim()) {
            console.log('urlController.js : shortenUrl => Original URL is required');
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            let url = await Url.findOne({ originalUrl: originalUrl.trim() });
            if (url) {
                console.log('urlController.js : shortenUrl => url already exist in db');
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

            console.log('urlController.js : shortenUrl => Shorten URL Progress Completed');
            return res.status(201).json({
                status: true,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
                shortCode,
                originalUrl: url.originalUrl,
                clicks: 0,
                createdAt: url.createdAt,
            });
        } catch (err) {
            console.error('urlController.js: shortenUrl => Unable to Shorten URL error:', err);
            return res.status(500).json({
                status: false,
                error: 'Unable to Shorten URL'
            });
        }
    },

    redirectToOriginal: async (req, res) => {
        try {
            console.log('urlController.js : redirectToOriginal => Request Received on server');

            const url = await Url.findOneAndUpdate(
                { shortCode: req.params.shortCode },
                { $inc: { clicks: 1 } },
                { new: true }
            );

            if (!url) {
                console.log('urlController.js : redirectToOriginal => Short link not found');
                return res.status(404).json({
                    status: false,
                    error: 'Short link not found'
                });
            }
            console.log('urlController.js : redirectToOriginal => Going to redirect on original url');
            res.redirect(url.originalUrl);
        } catch (err) {
            console.error('urlController.js:redirectToOriginal => Something wrong while redirecting the original url:', err);
            return res.status(500).json({
                status: false,
                error: 'Unable to redirecting the original url'
            });
        }
    },

    getStats: async (req, res) => {
        try {
            console.log('urlController.js : getStats => Stats Request from client received');
            const url = await Url.findOne({ shortCode: req.params.shortCode });
            if (!url) {
                console.error('urlController.js : getStats => url not found on mongodb');
                return res.status(404).json({
                    status: false,
                    error: 'Not found'
                });
            }

            console.log('urlController.js : getStats => Stats has been fetched from db');
            return res.json({
                status: true,
                shortCode: url.shortCode,
                originalUrl: url.originalUrl,
                clicks: url.clicks,
                createdAt: url.createdAt,
            });
        } catch (err) {
            console.error('urlController.js:getStats => Unable to get the stats for shortcode:', err);
            return res.status(500).json({
                status: false,
                error: 'Stats for Shortcode'
            });
        }
    },

    getAllLinks: async (req, res) => {
        try {
            console.log('urlController.js : getAllLinks => All link list request has been fetched');
            const urls = await Url.find().sort({ createdAt: -1 });
            return res.json(urls);
        } catch (err) {
            console.error('urlController.js:getAllLinks => Issue while list the url link', err);
            return res.status(500).json({
                status: false,
                error: 'Not able to list the link'
            });
        }
    },

    deleteLink: async (req, res) => {
        try {
            console.log('urlController.js : deleteLink => Link Deletion Request has been received');
            const result = await Url.findByIdAndDelete(req.params.id);
            if (!result) {
                console.error('urlController.js : deleteLink => Unable to get link - Not Exist');
                return res.status(404).json({
                    status: false,
                    error: 'Link not found'
                });
            }
            console.log('urlController.js : deleteLink => Link has been deleted from db');
            return res.json({
                status: true,
                message: 'Link deleted successfully'
            });
        } catch (err) {
            console.error('urlController.js: deleteLink => Not able to delete the link from db', err);
            return res.status(500).json({
                status: false,
                error: 'Not able to delete the link'
            });
        }
    }
}