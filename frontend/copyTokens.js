const fs = require("fs").promises;
const path = require("path");

async function cleanAndCopyTokensInfo() {
    //defining filepath
    const filePath = path.resolve(__dirname, '../smart-contract/build/deployedTokens.json');
    const targetDir = path.resolve(__dirname, './src/assets/config');
    const targetFilePath = path.join(targetDir, 'deployedTokens.json');

    //check that source file and target dir exists
    if(!await fs.access(filePath).then(() => true).catch(() => false)) {
        console.error("The deployedToken source file does not exist", filePath);
        process.exit(1);
    }
    if(!await fs.access(targetDir).then(() => true).catch(() => false)) {
        console.error("The deployedToken target dir does not exist, creating dir ...", targetDir);
        //dir creation
        await fs.mkdir(targetDir, {recursive: true});
    }

    try {
        //cleaning existing deployedToken.json file if needed
        if(await fs.access(targetFilePath).then(() => true).catch(() => false)) {
            console.log("deleting existing deployedToken.json file");
            await fs.unlink(targetFilePath);
        }

        //copying new deployedToken.json file
        console.log("copy of deployedToken file");
        await fs.copyFile(filePath, targetFilePath);

        console.log("deployedToken.json successfully copied");

    } catch (err) {
        console.error("An error occurded while cleaning or copying tokens config file", err);
        process.exit(1);
    }
}

//call func
cleanAndCopyTokensInfo();