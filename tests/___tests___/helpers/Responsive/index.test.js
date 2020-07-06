import * as _ from 'src/helpers/Responsive'

describe('Responsive methods', () => {
    it('should return 0 when wp called', () => {
        const widthPercent = '100'
        expect(_.wp(widthPercent)).toEqual(0)
    })

    it('should return 0 when fs called', () => {
        const fontPercent = 100
        expect(_.fs(fontPercent)).toEqual(0)
    })

    it('should return undefined when lor called', () => {
        expect(_.lor('test', () => null)).toEqual(undefined)
    })

    it('should return undefined when rol called', () => {
        expect(_.rol()).toEqual(undefined)
    })
})
