const assert = require('chai').assert;
const expect = require('chai').expect;
const storenload = require('../store-n-load');

const testCase1 = "key1=value1;key2=value2\nkeyA=valueA\nkeyC=valueC";
const testCase2 = [new Map(), new Map(), new Map()];
testCase2[0].set("key1", "value1");
testCase2[0].set("key2", "value2");
testCase2[1].set("keyA", "valueA");
testCase2[2].set("keyC", "valueC");

describe('store-n-load', function() {
    let result = storenload.load(testCase1);
    describe('load', () => {
        it('load should return type array', () => {
            assert.typeOf(result, 'array');
        });

        result.forEach((value, index) => {
            it(`compare result [${index}]`, () => {
                expect(result[index]).to.eql(testCase2[index]); 
            });
        })
    });

    let result2 = storenload.store(testCase2);
    describe('store', function() {
        it('load should return type string', () => {
            assert.typeOf(result2, 'string');
        });

        it('compare result', () => {
            assert.equal(result2, testCase1);
        });

    });

});
