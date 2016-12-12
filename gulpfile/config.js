module.exports = {
    nodemon:{
        options:{
            verbose: true,
            ignore: ["sessions/**","./node-modules/**","public/css/styles.css", "public/lib/**"],
            script: 'server.js', 
            tasks: []  
        }
    }
};