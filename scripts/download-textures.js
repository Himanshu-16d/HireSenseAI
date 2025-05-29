const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
    {
        url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        filename: 'color.jpg'
    },
    {
        url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        filename: 'normal.jpg'
    },
    {
        url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        filename: 'specular.jpg'
    }
];

const downloadFile = (url, filename) => {
    return new Promise((resolve, reject) => {
        const targetPath = path.join(__dirname, '../public/earth', filename);
        const file = fs.createWriteStream(targetPath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(targetPath, () => {});
            reject(err);
        });
    });
};

async function downloadAll() {
    try {
        await Promise.all(textures.map(texture => 
            downloadFile(texture.url, texture.filename)
        ));
        console.log('All textures downloaded successfully!');
    } catch (error) {
        console.error('Error downloading textures:', error);
    }
}

downloadAll();
