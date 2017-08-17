var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var permission = require('permission');
var types = require('validators').types;

var role = Schema({
    name: {
        type: String,
        required: true,
        validator: types.string({
            length: 20
        })
    },
    description: {
        type: String,
        validator: types.string({
            length: 1000
        })
    }
}, {collection: 'roles'});

role.plugin(mongins);
role.plugin(mongins.createdAt);
role.plugin(mongins.updatedAt);

role.set('toJSON', {
    getters: true,
    //virtuals: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});

role.methods.can = function (perm, action) {
    return permission.has(this.has, perm.split(':'), action);
};

role.methods.permit = function (perm, actions, done) {
    actions = actions instanceof Array ? actions : [actions];
    permission.add(this.has, perm.split(':'), actions);
    this.save(done);
};

role.virtual('id').get(function () {
    return this._id;
});

module.exports = mongoose.model('roles', role);