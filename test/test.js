const { expect, assert } = require('chai');
const { Crawler, CrawlerOptions } = require('../index');

describe('Crawler Suite', function() {
    describe('CrawlerOptions', function() {
        it('should throw error when URL is null', () => {
            expect(() => new CrawlerOptions(null, () => {}, [])).to.throw();
        });

        it('should throw error when URL is undefined', () => {
            expect(() => new CrawlerOptions(undefined, () => {}, [])).to.throw();
        });

        it('should throw error when URL is not a string', () => {
            expect(() => new CrawlerOptions({ url: 'url' }, () => {}, [])).to.throw();
        });

        it('should throw error when URL does not provide protocol', () => {
            expect(() => new CrawlerOptions('google.com', () => {}, [])).to.throw();
        });

        it('should throw error when extractor is null', () => {
            expect(() => new CrawlerOptions('https://google.com', null, [])).to.throw();
        });

        it('should throw error when extractor is undefined', () => {
            expect(() => new CrawlerOptions('https://google.com', undefined, [])).to.throw();
        });

        it('should throw error when extractor is not a function', () => {
            expect(() => new CrawlerOptions('https://google.com', 'something', [])).to.throw();
        });

        it('should throw error when extractor argument(s) is null', () => {
            expect(() => new CrawlerOptions('https://google.com', () => {}, null)).to.throw();
        });

        it('should throw error when extractor argument(s) is undefined', () => {
            expect(() => new CrawlerOptions('https://google.com', () => {}, undefined)).to.throw();
        });

        it('should throw error when extractor argument(s) is not an object', () => {
            expect(() => new CrawlerOptions('https://google.com', () => {}, 'arg')).to.throw();
        });

        it('should throw error when extractor argument(s) is not an array', () => {
            expect(() => new CrawlerOptions('https://google.com', () => {}, {})).to.throw();
        });

        it('should build CrawlerOptions object when targetting an http page', () => {
            expect(new CrawlerOptions('http://somepage.com/somepath', () => {}, [1, 'arg2']))
                .to
                .be
                .an
                .instanceOf(CrawlerOptions);
        });

        it('should build CrawlerOptions object when targetting an https page', () => {
            expect(new CrawlerOptions('https://google.com/?q=some_query', () => {}, [1, 'arg2']))
                .to
                .be
                .an
                .instanceOf(CrawlerOptions);
        });
    });

    describe('Crawler', () => {
        it('should throw error if supplied options is not of type \'CrawlerOptions\'', () => {
            expect(() => new Crawler({})).to.throw();
        });

        it('should return a new Crawler object', () => {
            const options = new CrawlerOptions('https://google.com', () => {}, []);

            expect(new Crawler(options)).to.be.instanceOf(Crawler);
        });

        it('should return a promise when calling crawl()', () => {
            const options = new CrawlerOptions('https://google.com', () => {}, []);
            const returnValue = new Crawler(options).crawl();

            expect(returnValue).to.be.instanceOf(Promise);
        });

        it('should resolve promise and return results when crawling ends', () => {
            const extractorFnReturnValue = 'return value';
            const options = new CrawlerOptions('https://google.com', (param) => param, [extractorFnReturnValue]);
            
            return new Crawler(options)
                .crawl()
                .then(value => {
                    expect(value).to.be.equal(extractorFnReturnValue);
                })
                .catch(err => {
                    assert.fail(`Expected promise to resolve but it was rejected. ${err}`);
                });
        }).timeout(10000);

        it('should reject promise with with original error when crawling fails', () => {
            const options = new CrawlerOptions('https://google.com', () => {
                throw new Error('throwing from browser');
            }, []);

            return new Crawler(options)
                .crawl()
                .then(value => {
                    assert.fail(`Expected promise to reject but it was resolved with value: ${value}`);
                })
                .catch(err => {
                    expect(err).to.be.instanceOf(Error);
                });
        }).timeout(10000);
    });
});