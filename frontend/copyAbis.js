const fs = require("fs");
const path = require("path");

//defining paths
const sourceDir = path.resolve(__dirname, '../smart-contract/build/contracts');
const tragetDir = path.resolve(__dirname, './src/abi');

//check that the 2 directories exist
if(!fs.existsSync(sourceDir)) {
    console.error("The ABI files source dir does not exist", sourceDir);
    process.exit(1);
}
if(!fs.existsSync(tragetDir)) {
    console.error("The ABI files target dir does not exist", tragetDir);
    process.exit(1);
}

//cleaning repository 
fs.readdir(tragetDir, (err, file) => {
    if(!err) {
        file.forEach((file) => {
            const filePath = path.join(tragetDir, file);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error while deleting ABI files", err);
            });
        });
    }
});

//copying ABI files
fs.readdir(sourceDir, (err, files) => {
    //processing errors
    if(err){
        console.error("Error while charging ABI files", err);
        process.exit(1);
    }

    //copying each files
    files.forEach((file) => {
        if(file.endsWith('.json')) {
            //defining full file name
            const sourceFile = path.join(sourceDir, file);
            const targetFile = path.join(tragetDir, file);

            //actually copying the file
            fs.copyFile(sourceFile, targetFile, (err) => {
                //processing err
                if(err){
                    console.error("Error while copying ABI file named : ", file, ": ", err);
                } else {
                    console.log("ABI file copied : ", file);
                }
            });
        }
    });
});