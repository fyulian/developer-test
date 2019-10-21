const assert = require('chai').assert;
const expect = require('chai').expect;
const optimalpath = require('../optimal-path');


describe('optimal-path', function() {
    describe('test case 1: normal', () => {
        var vertices = ["A1","B2","C2"];
        var edges = ["A->B", "B->C", "A->C"];
        var originVertex = "A";
        var expectedPath = ["A", "B", "C"];
        var expectedWeight = 5;
        var testcase1 = optimalpath.optimalPath(vertices, edges, originVertex);
        it('should run test case 1', () => {
            it('Result path', () => {
                expect(testcase1[0]).to.eql(expectedPath); 
            });
            it('Result weight', () => {
                assert.equal(testCase1[1], expectedWeight);
            });
        });
    });

    describe('test case 2: normal', () => {
        var vertices = ["B2","C10","D2","A1","E5"];
        var edges = ["A->B", "B->D", "A->C", "C->E", "D->E"];
        var originVertex = "A";
        var expectedPath = ["A", "C", "E"];
        var expectedWeight = 16;
        var testcase1 = optimalpath.optimalPath(vertices, edges, originVertex);
        it('should run test case 2', () => {
            it('Result path', () => {
                expect(testcase1[0]).to.eql(expectedPath); 
            });
            it('Result weight', () => {
                assert.equal(testCase1[1], expectedWeight);
            });
        });
    });
});
