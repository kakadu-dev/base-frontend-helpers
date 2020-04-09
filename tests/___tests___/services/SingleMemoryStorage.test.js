import SingleMemoryStorage from 'src/services/SingleMemoryStorage'

describe('SingleMemoryStorage', () => {
    let inst
    let result
    const test = 'test'

    beforeEach(() => {
        inst   = SingleMemoryStorage.getInstance()
        result = { memory: {} }
    })

    it('should create instance', () => {
        expect(inst).toEqual(result)
    })

    it('should set name & value', () => {
        result = { memory: { test } }

        expect(inst.set('test', 'test')).toEqual(result)
    })

    it('should get name & value', () => {
        inst.set('test', 'result')

        expect(inst.get('test')).toEqual(inst.memory.test)
    })

    it('should remove name & value', () => {
        result.memory = { test: null }

        inst.set('test', 'result')
        inst.remove('test')

        expect(inst).toEqual(result)
    })
})
