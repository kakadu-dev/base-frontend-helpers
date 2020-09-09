import _ from 'lodash'

/**
 * Base model class
 */
export default class BaseModel {
    /**
     * @property model
     * @private
     *
     * @type {(BaseModel | object)}
     */
    model = {}

    /**
     * @protected
     *
     * @type {(BaseModel | object)}
     */
    relations = {}

    /**
     * Create new model
     *
     * @param {object} object
     *
     * @return {undefined}
     */
    constructor(object) {
        const obj = object?.result?.model
                    ?? object?.result
                    ?? (typeof object?.fetching === 'undefined' && object || {})

        /**
         * Detect object like state
         * @private
         */
        this.model = obj
    }

    /**
     * Create model
     *
     * @param {object} object
     *
     * @return {BaseModel}
     */
    static create(object) {
        return new this(object)
    }

    /**
     * Create list models
     *
     * @param {object} objects
     *
     * @return {Array.<BaseModel>}
     */
    static createList(objects) {
        return BaseModel.getArrayObjects(objects).map(object => new this(object))
    }

    /**
     * Map models
     *
     * @param {Array.<object>} objects
     * @param {function(BaseModel, number): undefined} callback
     *
     * @return {Array.<object>}
     */
    static map(objects, callback) {
        return BaseModel.getArrayObjects(objects).map((object, index) => {
            const modelInstance = this.create(object)

            return callback(modelInstance, index)
        })
    }

    /**
     * Get array objects
     *
     * @private
     *
     * @param {object} object
     *
     * @return {Array.<object>}
     */
    static getArrayObjects(object) {
        const list = Array.isArray(object && object.result && object.result.list) && object.result.list
                     || Array.isArray(object && object.list) && object.list
                     || Array.isArray(object && object.result) && object.result
                     || Array.isArray(object) && object
                     || []

        return list
    }

    /**
     * Get relation
     *
     * @param {string} name
     * @param {function} model
     * @param {(BaseModel | object)} instance
     * @param {boolean} many
     *
     * @return {object}
     */
    getRelation = (name, model, instance, many = false) => {
        if (!this.relations[name]) {
            this.relations[name] = !many
                                   ? new model(this.model[name] || instance || {})
                                   : model.createList(this.model[name] || instance || [])
        }

        return this.relations[name]
    }

    /**
     * If model exist
     *
     * @return {boolean}
     */
    isExist = () => {
        return this.model && !_.isEmpty(this.model)
    }

    /**
     * Get raw model
     *
     * @return {BaseModel|Object}
     */
    getRawModel = () => {
        return this.model
    }

    /**
     * Return model primary key
     * Default: id
     *
     * @return {null}
     */
    primaryKey() {
        return this.model.id
    }

    /**
     * Return primary key name
     *
     * @return {string}
     */
    primary = () => 'id'
}
