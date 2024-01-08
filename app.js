const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
    try {
        const image = await Jimp.read(inputFile);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        const textData = {
            text,
            alignemntX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }
        image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
        await image.quality(100).writeAsync(outputFile);
        console.log('success!');
        startApp();
    } catch (error) {
        console.log('There is an error with adding text to image');
        startApp(); 
    }
    
};

//addTextWatermarkToImage('./test.jpg', './test-with-watermark.jpg', 'Hello world');

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
    try {
        const image = await Jimp.read(inputFile);
        const watermark = await Jimp.read(watermarkFile);

        const imgWidth = 400;
        watermark.resize(imgWidth, Jimp.AUTO);

        const x = image.getWidth() / 2 - watermark.getWidth() / 2;
        const y = image.getHeight() / 2 - watermark.getHeight() / 2;

        image.composite(watermark, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.5,
        });
        await image.quality(100).writeAsync(outputFile);
        console.log('success!');
        startApp();
    } catch (error) {
        console.log('There is an error with adding Watermark to Image');
        startApp();
    }

};

//addImageWatermarkToImage('./test.jpg', './test-with-watermark2.jpg', './logo.jpg');

const prepareOutputFilename = (filename) => {
    const [name, ext] = filename.split('.');
    return `${name}-with-watermark.${ext}`;
}

const startApp = async () => {
    const answer = await inquirer.prompt([{
        name: 'start',
        message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\`ll be able to use them in the app. Are you ready?',
        type: 'confirm'
    }]);

    // if answer is no, just quit the app
    if (!answer.start) process.exit();

    // ask about input file and watermark type
    const options = await inquirer.prompt([{
        name: 'inputImage',
        type: 'input',
        message: 'What file do you want to mark?',
        default: 'test.jpg'
    }, {
        name: 'watermarkType',
        type: 'list',
        choices: ['Text watermark', 'Image watermark'],
    }]);

    if (options.watermarkType === 'Text watermark') {
        const text = await inquirer.prompt([{
            name: 'value',
            type: 'input',
            message: 'Type your watermark text:',
        }]);
        options.watermarkText = text.value;

        if (fs.existsSync('./img/' + options.inputImage)) {
            addTextWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), options.watermarkText);
            console.log('plik jest!');
        } else {
            console.log('brakuje takiego pliku watertext');
        }


    }
    else {
        const image = await inquirer.prompt([{
            name: 'filename',
            type: 'input',
            message: 'Type your watermark name:',
            default: 'logo.jpg',
        }]);
        options.watermarkImage = image.filename;
        console.log(options);
        if (fs.existsSync('./img/' + options.watermarkImage) && fs.existsSync('./img/' + options.inputImage)) {
            addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), './img/' + options.watermarkImage);
            console.log('plik jest!');
        } else {
            console.log('brakuje takiego pliku watermark');
        }
    }
}

startApp();


// process.stdout.write('Type "E" to exit, type "H" to say hello!');

// process.stdin.on('readable', () => {
//     const input = process.stdin.read();

//     const instruction = input.toString().trim();
//     if (instruction === 'E') {
//         process.stdout.write('Exiting app...');
//         process.exit();
//     }
//     else if (instruction === 'H') {
//         process.stdout.write('Hi! How are you?');
//     }
//     else {
//         process.stdout.write('Wrong instruction!\n');
//     }
// })