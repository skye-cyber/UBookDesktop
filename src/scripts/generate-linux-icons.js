// generate-linux-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseImagePath = 'src/assets/UBookDesktop.png';
const outputDir = 'src/icons/linux';
const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

async function generateIcons() {
    if (!fs.existsSync(baseImagePath)) {
        console.error(`❌ Base image not found: ${baseImagePath}`);
        process.exit(1);
    }

    fs.mkdirSync(outputDir, { recursive: true });

    for (const size of sizes) {
        const outputFile = path.join(outputDir, `${size}x${size}.png`);
        try {
            await sharp(baseImagePath)
            .resize(size, size)
            .toFile(outputFile);
            console.log(`✔️  Created: ${outputFile}`);
        } catch (err) {
            console.error(`❌ Failed to create icon at ${size}x${size}:`, err);
        }
    }

    console.log('\n🎉 Linux icon set (flat structure) generation complete!');
}

generateIcons();
