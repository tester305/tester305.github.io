const express = require('express');
const si = require('systeminformation');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/neofetch', async (req, res) => {
    try {
        const osInfo = await si.osInfo();
        const cpu = await si.cpu();
        const mem = await si.mem();
        const user = await si.users();
        const graphics = await si.graphics();

        const neofetchData = {
            osInfo,
            cpu,
            mem,
            user,
            graphics
        };

        res.json(neofetchData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;