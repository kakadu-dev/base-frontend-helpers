import StatePaginationService from 'src/services/StatePaginationService'

describe('StatePaginationService', () => {
    describe('Constructor', () => {
        it('should create state', () => {
            const state = { test: 'test' }

            const inst = new StatePaginationService(state)

            expect(inst.state).toEqual(state)
        })


        it('should create empty state', () => {
            const inst = new StatePaginationService()

            expect(inst.state).toEqual({})
        })
    })

    describe('Check methods when state props are exist', () => {
        const state = { totalItems: 1, pageCount: 2, currentPage: 3, perPage: 4 }
        const inst  = new StatePaginationService(state)

        it('should return currentPage', () => {
            expect(inst.getCurrentPage()).toEqual(state.currentPage)
        })

        it('should return pageCount', () => {
            expect(inst.getPageCount()).toEqual(state.pageCount)
        })

        it('should return totalItems', () => {
            expect(inst.getTotalItems()).toEqual(state.totalItems)
        })

        it('should return perPage', () => {
            expect(inst.getPerPage()).toEqual(state.perPage)
        })
    })

    describe('Check methods when state props are not exist', () => {
        const state = { test: 'test' }
        const inst  = new StatePaginationService(state)

        it('should return 0 when getTotalItems called', () => {
            expect(inst.getTotalItems()).toEqual(0)
        })

        it('should return 0 when getPageCount called', () => {
            expect(inst.getPageCount()).toEqual(0)
        })

        it('should return 0 when getCurrentPage called', () => {
            expect(inst.getCurrentPage()).toEqual(0)
        })

        it('should return 0 when getPerPage called', () => {
            expect(inst.getPerPage()).toEqual(0)
        })
    })
})
