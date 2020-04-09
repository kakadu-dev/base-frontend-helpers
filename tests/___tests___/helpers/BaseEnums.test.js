import { Enums, EnumsTypes } from 'src/helpers/BaseEnums'

describe('BaseEnums', () => {
    it('should have default properties', () => {
        expect(Enums).toHaveProperty('YesNot')
        expect(EnumsTypes).toHaveProperty('YesNot')
    })
})
