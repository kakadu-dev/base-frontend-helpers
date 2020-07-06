import KeyHelper from 'src/helpers/KeyHelper'

describe('KeyHelper', () => {
    const callback = { call: jest.fn() }
    const key      = 1

    it('should call callback when key is not undefined', () => {
        const enterObj = { keyCode: 1 }

        const enter = KeyHelper.enter(callback, key)

        expect(enter).toBeInstanceOf(Function)
        enter(enterObj)
        expect(callback.call).toHaveBeenCalled()
    })

    it('should call callback when key is undefined', () => {
        const enterObj = { keyCode: 13 }

        const enter = KeyHelper.enter(callback)

        expect(enter).toBeInstanceOf(Function)
        enter(enterObj)
        expect(callback.call).toHaveBeenCalled()
    })
})
