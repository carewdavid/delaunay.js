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
});

