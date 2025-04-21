const fs = require('fs');
const path = require('path');
const pool = require('../../db/pool');
const queries = require('./queries');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
    const file = req.file;
    const { project_id } = req.body;

    if (!file || !project_id) {
        return res.status(400).json({ error: 'Missing file or project_id' });
    }

    const fileUrl = `/uploads/${file.filename}`;

    try {
        await pool.query(queries.insertFile, [
            Number(project_id),
            file.originalname,
            fileUrl
        ]);
        res.status(201).json({ file_url: fileUrl });
    } catch (err) {
        console.error('Error saving file metadata:', err);
        res.status(500).json({ error: 'Error saving file metadata' });
    }
};

const getFileByLink = async (req, res) => {
    const { link } = req.params;

    try {
        const result = await pool.query(queries.getFileByUrl, [`/uploads/${link}`]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching file:', err);
        res.status(500).json({ error: 'Error fetching file' });
    }
};

const deleteFileByLink = async (req, res) => {
    const { link } = req.params;
    const fullUrl = `/uploads/${link}`;
    const filePath = path.join(__dirname, '../../uploads', link);

    try {
        await pool.query(queries.deleteFileByUrl, [fullUrl]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ error: 'Error deleting file' });
    }
};

module.exports = {
    upload,
    uploadFile,
    getFileByLink,
    deleteFileByLink
};
