const { expect } = require('chai');

module.exports = {
    expectedStatus: function expectedStatus(status, code) {
        expect(status).to.equal(code, 'expected response status ' + code);
    },

    expectedContentType: function expectedContentType(headerContentType, type) {
        expect(headerContentType).to.match(type, 'expected json response');
    },

    expectedPropertyAndType: function expectedPropertyAndType(body, property, type) {
        expect(body, 'expected the response body to have property ' + property)
            .to.have.property(property)
            .that.is.a(type);
    },

    expectedNestedPropertyAndType: function expectedNestedPropertyAndType(body, property, type) {
        expect(body, 'expected the response body to have property ' + property)
            .to.have.nested.property(property)
            .that.is.a(type);
    },
};
