/**
 * Check returned value
 *
 * @param {Array} methodsList
 * @param {Object} instance
 * @param {Object} model
 *
 * @return {function}
 */
export const shouldImplementGetters = (methodsList, instance, model) => {
    methodsList.forEach(item => {
        const target = item.target ? item.target : model[item.key]
        const foo    = instance[item.method].bind(instance)
        const value  = item.key

        return it(`should return ${value} of the model`, () => {
            expect(foo()).toEqual(target)
        })
    })
}

/**
 * Check is models list created
 *
 * @param {Array} modelsList
 * @param {Object} instanceOf
 *
 * @return {function}
 */
export const shouldCreateModelsList = (modelsList, instanceOf) => {
    const instanceList = instanceOf.createList(modelsList)

    return it(`should create models list`, () => {
        expect(instanceList).toBeInstanceOf(Array)
        expect(instanceList.length).toBe(modelsList.length)
        expect(instanceList[0]).toBeInstanceOf(instanceOf)
        expect(instanceList[1]).toBeInstanceOf(instanceOf)
    })

}

/**
 * Check is instance created
 *
 * @param {Object} instance
 * @param {Object} instanceOf
 */
export const shouldCreateModel = (instance, instanceOf) => {
    return it('should create instance', () => {
        expect(instance).toBeInstanceOf(Object)
        expect(instance).toBeInstanceOf(instanceOf)
    })
}


/**
 * Check is method map is implemented
 *
 * @param {Array} modelsList
 * @param {Object} instance
 *
 * @return {function}
 */
export const shouldImplementMap = (modelsList, instance) => {
    return it('should implement method map', () => {
        instance.map(modelsList, model => {
            expect(model).toBeInstanceOf(instance)
        })
    })
}
