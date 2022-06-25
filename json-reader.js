const fs = require('fs');

module.exports = class JsonReader {
    constructor(filePath){
        this.filePath = filePath;
        try {
            if (!fs.existsSync(this.filePath)) {
                this.write({});    
            }
        } catch(err) {
            console.error(err)
        }
    }
    
    read() {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        return jsonData;
    }

    write(data){
        const stringifiedData = JSON.stringify(data, null, '\t');
        fs.writeFileSync(this.filePath, stringifiedData, 'utf8');
    }
}
