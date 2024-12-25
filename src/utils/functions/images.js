const os = require("os");

function getRelativePath(fullPath) {

    const platform = os.platform();
    if (platform == "win32") {
        pathSegments = fullPath.split("\\");
        uploadsIndex = pathSegments.indexOf("public");
        if (uploadsIndex !== -1 && uploadsIndex < pathSegments.length - 1) {
            const relativePath = pathSegments.slice(uploadsIndex + 1).join("\\");
            return "\\" + relativePath;
        } 
        else 
            return fullPath;
        
    } 
    
    pathSegments = fullPath.split("/");
    uploadsIndex = pathSegments.indexOf("public");
    if (uploadsIndex !== -1 && uploadsIndex < pathSegments.length - 1) {
        const relativePath = pathSegments.slice(uploadsIndex + 1).join("/");
        return "/" + relativePath;
    } 
    else 
        return fullPath;
        
    
}



module.exports = {
    getRelativePath
}