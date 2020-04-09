import { OptionsHelper } from 'src/helpers/OptionsHelper'

describe('OptionsHelper', () => {
    const color = '00000000000'

    it('should single color', () => {
        const colors = color
        const result = {
            type: 'single',
            value: colors,
            colorType: 'gradient',
        }

        const SingleColor = OptionsHelper.getPropertyColors(colors)

        expect(SingleColor).toEqual(result)
    })

    it('should double color and second type will be gradient', () => {
        const colors = `${color};${color}0`
        const result = {
            type: 'double',
            top: {
                value: color,
                type: 'color',
            },
            bottom: {
                value: `${color}0`,
                type: 'gradient',
            },
        }

        const doubleColor = OptionsHelper.getPropertyColors(colors)

        expect(doubleColor).toEqual(result)
    })

    it('should double color and first type will be gradient', () => {
        const colors = `${color}0;${color}`
        const result = {
            type: 'double',
            top: {
                value: `${color}0`,
                type: 'gradient',
            },
            bottom: {
                value: `${color}`,
                type: 'color',
            },
        }

        const doubleColor = OptionsHelper.getPropertyColors(colors)

        expect(doubleColor).toEqual(result)
    })
})
