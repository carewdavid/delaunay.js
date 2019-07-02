const assert = require('assert');

const delaunay = require('../delaunay.js');
const points = [[0, 1], [1, -1], [-1, -1]];

describe('Triangle', function() {
    describe('#new', function() {
        it('should sort its vertices', function() {
            const tri = new delaunay.Triangle(...points);
            const irt = new delaunay.Triangle(...points.reverse());
            assert.deepStrictEqual(tri.vertices(), irt.vertices());
        });
    });
    describe('vertices', function() {
        const tri = new delaunay.Triangle([0, 1], [1, -1], [-1, -1]);
        it('there should be three', function() {
            assert(tri.vertexes.length === 3);
        });
        it('they should all be arrays', function() {
            assert(tri.vertexes.every(Array.isArray));
        });
        it('they should all be 2d points', function() {
            assert(tri.vertexes.every(p => p.length === 2));
        });
        it('the public method should give the same data as the internal array', function() {
            assert.deepStrictEqual(tri.vertexes, tri.vertices());
        });
        it('the vertices can be checked', function() {
            assert(tri.vertices().every(v => tri.hasVertex(v)));
        });
    });
    describe('edges', function() {
        const tri = new delaunay.Triangle([0, 1], [1, -1], [-1, -1]);
        it('there should be three', function() {
            assert(tri.edges().length === 3);
        });
        it('they should all be pairs of points', function() {
            assert(tri.edges().every(p => p.length === 2));
        });
        it('the edges can be checked', function() {
            assert(tri.edges().every(e => tri.hasEdge(e)));
        });
    });
    describe('#isInCircumcircle', function() {
        const tri = new delaunay.Triangle([1,1], [1,-1], [-1,-1]);
        it('should be false when the point is outside', function() {
            assert(!tri.isInCircumcircle([2,0]));
            assert(!tri.isInCircumcircle([-2,10]));
        });
        it('should be true when the point is inside', function() {
            assert(!tri.isInCircumcircle([0,0]));
            assert(!tri.isInCircumcircle([0.5,0.5]));
        });
    });  
});

