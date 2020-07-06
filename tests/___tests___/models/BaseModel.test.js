import BaseModel from 'models/BaseModel'
import { shouldCreateModel, shouldCreateModelsList, shouldImplementGetters, shouldImplementMap } from '../../utils'

describe('BaseModel', () => {
    const model      = { result: { id: 1, test: 'test' } }
    const modelsList = [
        { result: { list: [{ test1: 'tes1t' }, { test1: 'test1' }] } },
        { result: { list: [{ test2: 'test2' }, { test2: 'test2' }] } },
    ]

    const baseModel = BaseModel.create(model)

    const methodsList = [
        { key: 'isExist', method: 'isExist', target: true },
        { key: 'countryId', method: 'getRawModel', target: model.result },
        { key: 'code', method: 'primaryKey', target: model.result.id },
    ]

    shouldCreateModel(baseModel, BaseModel)
    shouldCreateModelsList(modelsList, BaseModel)
    shouldImplementMap(modelsList, BaseModel)
    shouldImplementGetters(methodsList, baseModel, model)

    describe('Create with {new}', () => {
        it('should create when argument is exist', () => {
            const nextBaseModel = new BaseModel(model)

            expect(nextBaseModel).toBeInstanceOf(Object)
            expect(nextBaseModel.getRawModel()).toEqual(model.result)
            expect(nextBaseModel).toBeInstanceOf(BaseModel)
        })

        it('should create when argument is exist', () => {
            const nextBaseModel = new BaseModel()

            expect(nextBaseModel).toBeInstanceOf(Object)
            expect(nextBaseModel.getRawModel()).toEqual({})
            expect(nextBaseModel).toBeInstanceOf(BaseModel)
        })
    })

    describe('Create BaseModels list from object', () => {
        it('with structure: {Object}.{result}.[list]', () => {
            const nextList     = { result: { list: [1, 2] } }
            const nextBaseList = BaseModel.createList(nextList)

            expect(nextBaseList).toBeInstanceOf(Array)
            expect(nextBaseList.length).toBe(nextList.result.list.length)
            expect(nextBaseList[0]).toBeInstanceOf(BaseModel)
            expect(nextBaseList[1]).toBeInstanceOf(BaseModel)
        })

        it('with structure: {Object}.[list]', () => {
            const nextList = { list: [1, 2] }
            const nextBaseList = BaseModel.createList(nextList)

            expect(nextBaseList).toBeInstanceOf(Array)
            expect(nextBaseList.length).toBe(nextList.list.length)
            expect(nextBaseList[0]).toBeInstanceOf(BaseModel)
            expect(nextBaseList[1]).toBeInstanceOf(BaseModel)
        })

        it('with structure: {Object}.[result]', () => {
            const nextList = { result: [1, 2] }
            const nextBaseList = BaseModel.createList(nextList)

            expect(nextBaseList).toBeInstanceOf(Array)
            expect(nextBaseList.length).toBe(nextList.result.length)
            expect(nextBaseList[0]).toBeInstanceOf(BaseModel)
            expect(nextBaseList[1]).toBeInstanceOf(BaseModel)
        })

        it('with structure: [Object]', () => {
            const nextList = [1, 2]
            const nextBaseList = BaseModel.createList(nextList)

            expect(nextBaseList).toBeInstanceOf(Array)
            expect(nextBaseList.length).toBe(nextBaseList.length)
            expect(nextBaseList[0]).toBeInstanceOf(BaseModel)
            expect(nextBaseList[1]).toBeInstanceOf(BaseModel)
        })
    })

    describe('Relation', () => {
        it('should call when name & model & instance are exist', () => {
            const relation = baseModel.getRelation('test', BaseModel, {})

            expect(relation).toBeInstanceOf(BaseModel)
        })

        it('should call when model is exist, name & instance are not exist, many is true', () => {
            const relation = baseModel.getRelation('', BaseModel, false, true)

            expect(relation).not.toBeInstanceOf(BaseModel)
            expect(relation).toBeInstanceOf(Array)
        })

        it('should call when name & model are exist, many is true, instance is not exist', () => {
            const relation = baseModel.getRelation('test', BaseModel, false, true)

            expect(relation).toBeInstanceOf(BaseModel)
        })

        it('should call when name & instance are not exist, model is exist', () => {
            const relation = baseModel.getRelation(false, BaseModel, false)

            expect(relation).toBeInstanceOf(BaseModel)
        })
    })
})

