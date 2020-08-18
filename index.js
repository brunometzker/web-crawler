const Nightmare = require('nightmare');
const inspector = require('my_inspector');

class Crawler {
    constructor(options) {
        if(!(options instanceof CrawlerOptions)) {
            throw Error('Argument must be of type CrawlerOptions');
        }

        this.options = options;
    }

    crawl() {
        return new Promise((resolve, reject) => {
            new Nightmare()
                .goto(this.options.url)
                .evaluate(this.options.extractor, ...this.options.extractorArgs)
                .end()
                .then(value => {
                    resolve(value)
                })
                .catch(err => { 
                    reject(err) 
                });
        });
    }
}

class CrawlerOptions {
    constructor(
        url, 
        extractor, 
        extractorArgs
    ) {
        const checkUrl = (url) => {            
            const pattern = /https?:\/\/.*/;

            if(!inspector.type.isOfType(url, 'string')) {
                throw new Error(`${url} must be a string`);
            }

            if(!inspector.string.stringMatches(url, pattern)) {
                throw new Error(`${url} must match pattern: ${pattern}`);
            }

            return url;
        }

        const checkExtractor = (extractor) => {
            if(!inspector.type.isOfType(extractor, 'function')) {
                throw new Error(`${extractor} must be a function`);
            }

            return extractor;
        }
        
        const checkExtractorArgs = (args) => {
            if(!inspector.type.isOfType(args, 'object')) {
                throw new Error(`${args} must be an object`);
            }

            if(!(args instanceof Array)) {
                throw new Error(`${args} must be an array`);
            }

            return args;
        }

        this.url = checkUrl(url);
        this.extractor = checkExtractor(extractor);
        this.extractorArgs = checkExtractorArgs(extractorArgs);
    }
}

module.exports = { Crawler, CrawlerOptions }