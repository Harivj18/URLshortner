const Url = require('../models/urlSchema');
const { v4: uuidv4 } = require('uuid');

const generateShortCode = () => uuidv4().replace(/-/g, '').slice(0, 7);

module.exports = {

    shortenUrl: async (req, res) => {
        const { originalUrl } = req.body;
        console.log('originalUrl',originalUrl);
        
        if (!originalUrl?.trim()) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            let url = await Url.findOne({ originalUrl: originalUrl.trim() });
            if (url) {
                return res.json({
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
                shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
                shortCode,
                originalUrl: url.originalUrl,
                clicks: 0,
                createdAt: url.createdAt,
            });
        } catch (err) {
            console.error('Shorten error:', err);
            res.status(500).json({ error: 'Server error' });
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
                return res.status(404).json({ error: 'Short link not found' });
            }
            console.log('ss');
            
            res.redirect(url.originalUrl);
        } catch (err) {
            console.error('Redirect error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getStats: async (req, res) => {
        try {
            const url = await Url.findOne({ shortCode: req.params.shortCode });
            if (!url) return res.status(404).json({ error: 'Not found' });

            res.json({
                shortCode: url.shortCode,
                originalUrl: url.originalUrl,
                clicks: url.clicks,
                createdAt: url.createdAt,
            });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    getAllLinks: async (req, res) => {
        try {
            const urls = await Url.find().sort({ createdAt: -1 });
            res.json(urls);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    deleteLink: async (req, res) => {
        try {
            const result = await Url.findByIdAndDelete(req.params.id);
            if (!result) return res.status(404).json({ error: 'Link not found' });

            res.json({ message: 'Link deleted successfully' });
        } catch (err) {
            console.error('Delete error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}