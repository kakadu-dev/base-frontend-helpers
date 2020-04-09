import { LoaderHelper } from 'src/helpers/LoaderHelper'
import { hp } from 'src/helpers/Responsive'

describe('LoaderHelper', () => {
    const prevElement              = {
        height: 1,
        y: 1,
    }
    const currentY                 = 1
    const { height, y: marginTop } = prevElement


    it('should return next Y when currentY is exist', () => {
        const result = height + marginTop + hp(1.563)

        const nextY = LoaderHelper.getNextY(prevElement)

        expect(nextY).toEqual(result)
    })

    it('should return nextY when currentY is not exist', () => {
        const result = height + marginTop + currentY

        const nextY = LoaderHelper.getNextY(prevElement, currentY)

        expect(nextY).toEqual(result)
    })

    describe('SetOnCenter', () => {
        it('should return center coordinates', () => {
            const fullWidth    = 10
            const elementWidth = 2
            const result       = (fullWidth - elementWidth) / 2

            const center = LoaderHelper.setOnCenter(fullWidth, elementWidth)

            expect(center).toEqual(result)
        })
    })

    describe('SetOnEnd', () => {
        it('should return coordinates of end', () => {
            const prevElement      = { x: 10, width: 20 }
            const prevElementSpace = prevElement.x + prevElement.width
            const containerWidth   = 2
            const currentWidth     = 2
            const result           = prevElementSpace + (containerWidth - (prevElementSpace + currentWidth))

            const end = LoaderHelper.setOnEnd(prevElement, containerWidth, currentWidth)

            expect(end).toEqual(result)
        })
    })
})
