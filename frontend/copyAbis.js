const fs = require("fs").promises;
const path = require("path");

async function cleanAndCopy() {
    //defining paths
    const sourceDir = path.resolve(__dirname, '../smart-contract/build/contracts');
    const tragetDir = path.resolve(__dirname, './src/assets/abi');

    //check that the 2 directories exist
    if(!await fs.access(sourceDir).then(() => true).catch(() => false)) {
        console.error("The ABI files source dir does not exist", sourceDir);
        process.exit(1);
    }
    if(!await fs.access(tragetDir).then(() => true).catch(() => false)) {
        console.error("The ABI files target dir does not exist, creating dir ...", tragetDir);
        await fs.mkdir(tragetDir, {recursive: true});
    }

    try {
        //cleaning repository 
        console.log("Cleaning target repository...");
        const files = await fs.readdir(tragetDir);
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(tragetDir, file);
            await fs.unlink(filePath)
        }));
        console.log("All ABI files deleted");

        //copying ABI files
        console.log("Copying ABI files...");
        const sourceFiles = await fs.readdir(sourceDir);
        await Promise.all(sourceFiles.map(async (file) => {
            if(file.endsWith('.json')){
                const sourceFile = path.join(sourceDir, file);
                const targetFile = path.join(tragetDir, file);
                await fs.copyFile(sourceFile, targetFile);
                console.log("ABI file copied : ", file);
            }
        }));
        console.log("All ABI files copied");

    } catch (err) {
        console.error("An error occurded while cleaning or copying", err);
        process.exit(1);
    }
}

//calling func
cleanAndCopy();