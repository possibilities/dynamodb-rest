const queries = require('../queries')

const testContext = {
  hashKeyName: 'hash',
  rangeKeyName: 'range',
  separator: '.'
}

describe('queries', () => {
  describe('operations', () => {
    describe('get', () => {
      test('basic', () => {
        const query = queries()
        expect(query.get(['a', 'b'])).toEqual({
          context: testContext,
          action: 'get',
          key: { hash: 'a.b', range: 'a.b' },
          request: { Key: { hash: 'a.b', range: 'a.b' } }
        })
      })

      test('with options', () => {
        const query = queries()
        expect(query.get(
          ['a', 'b'],
          { ProjectionExpression: 'foo, bar' }
        )).toEqual({
          context: testContext,
          action: 'get',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: { hash: 'a.b', range: 'a.b' },
            ProjectionExpression: 'foo, bar'
          }
        })
      })
    })

    describe('post', () => {
      test('basic', () => {
        const query = queries()

        expect(query.post(['a', 'b'], { foo: 'bar' })).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash <> :hash AND #range <> :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with function values', () => {
        const query = queries()

        const getBar = () => 'bar'

        expect(query.post(['a', 'b'], { foo: getBar })).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash <> :hash AND #range <> :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with options', () => {
        const query = queries()

        expect(
          query.post(
            ['a', 'b'],
            { foo: 'bar' },
            { ReturnConsumedCapacity: 'TOTAL' }
          )
        ).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash <> :hash AND #range <> :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            ReturnConsumedCapacity: 'TOTAL'
          }
        })
      })
    })

    describe('patch', () => {
      test('basic', () => {
        const query = queries()
        const patchQuery = query.patch(['a', 'b'], { foo: 'bar' })

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'update',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'SET #foo = :foo',
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range',
              '#foo': 'foo'
            },
            ExpressionAttributeValues: {
              ':foo': 'bar',
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with function values', () => {
        const query = queries()

        const getBar = () => 'bar'
        const patchQuery = query.patch(['a', 'b'], { foo: getBar })

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'update',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'SET #foo = :foo',
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range',
              '#foo': 'foo'
            },
            ExpressionAttributeValues: {
              ':foo': 'bar',
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with options', () => {
        const query = queries()
        const patchQuery = query.patch(
          ['a', 'b'],
          { foo: 'bar' },
          { ReturnConsumedCapacity: 'TOTAL' }
        )

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'update',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'SET #foo = :foo',
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range',
              '#foo': 'foo'
            },
            ExpressionAttributeValues: {
              ':foo': 'bar',
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            ReturnConsumedCapacity: 'TOTAL'
          }
        })
      })
    })

    describe('put', () => {
      test('basic', () => {
        const query = queries()
        const patchQuery = query.put(['a', 'b'], { foo: 'bar' })

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with function values', () => {
        const query = queries()
        const getBar = () => 'bar'
        const patchQuery = query.put(['a', 'b'], { foo: getBar })

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with options', () => {
        const query = queries()
        const patchQuery = query.put(
          ['a', 'b'],
          { foo: 'bar' },
          { ReturnConsumedCapacity: 'TOTAL' }
        )

        expect(patchQuery).toEqual({
          body: { foo: 'bar' },
          context: testContext,
          action: 'put',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Item: {
              hash: 'a.b',
              range: 'a.b',
              foo: 'bar'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            ReturnConsumedCapacity: 'TOTAL'
          }
        })
      })
    })

    describe('delete', () => {
      test('basic', () => {
        const query = queries()
        const deleteQuery = query.delete(['a', 'b'])

        expect(deleteQuery).toEqual({
          action: 'delete',
          context: testContext,
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with options', () => {
        const query = queries()
        const deleteQuery = query.delete(
          ['a', 'b'],
          { ReturnConsumedCapacity: 'TOTAL' }
        )

        expect(deleteQuery).toEqual({
          action: 'delete',
          context: testContext,
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            ReturnConsumedCapacity: 'TOTAL'
          }
        })
      })

      test('existing entity', () => {
        const query = queries()
        const deleteQuery = query.delete({
          hash: 'a.b',
          range: 'a.b'
        })

        expect(deleteQuery).toEqual({
          context: testContext,
          action: 'delete',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Key: {
              hash: 'a.b',
              range: 'a.b'
            },
            ConditionExpression: '#hash = :hash AND #range = :range',
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })
    })

    describe('list', () => {
      test('basic', () => {
        const query = queries()
        const listQuery = query.list(['a', 'b'])

        expect(listQuery).toEqual({
          context: testContext,
          action: 'query',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            KeyConditionExpression: (
              '#hash = :hash AND begins_with(#range, :range)'
            ),
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            }
          }
        })
      })

      test('with options', () => {
        const query = queries()
        const listQuery = query.list(['a', 'b'], { IndexName: 'test' })

        expect(listQuery).toEqual({
          context: testContext,
          action: 'query',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            KeyConditionExpression: (
              '#hash = :hash AND begins_with(#range, :range)'
            ),
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            IndexName: 'test'
          }
        })
      })

      test('with custom key names', () => {
        const query = queries({
          hashKeyName: 'customhash',
          rangeKeyName: 'customrange'
        })
        const listQuery = query.list(['a', 'b'], { IndexName: 'test' })

        expect(listQuery).toEqual({
          context: {
            ...testContext,
            hashKeyName: 'customhash',
            rangeKeyName: 'customrange'
          },
          action: 'query',
          key: { customhash: 'a.b', customrange: 'a.b' },
          request: {
            KeyConditionExpression: (
              '#customhash = :customhash AND ' +
              'begins_with(#customrange, :customrange)'
            ),
            ExpressionAttributeNames: {
              '#customhash': 'customhash',
              '#customrange': 'customrange'
            },
            ExpressionAttributeValues: {
              ':customhash': 'a.b',
              ':customrange': 'a.b'
            },
            IndexName: 'test'
          }
        })
      })
    })

    describe('count', () => {
      test('basic', () => {
        const query = queries()
        const countQuery = query.count(
          ['a', 'b'],
          { ReturnConsumedCapacity: 'TOTAL' }
        )

        expect(countQuery).toEqual({
          context: testContext,
          action: 'query',
          key: { hash: 'a.b', range: 'a.b' },
          request: {
            Select: 'COUNT',
            KeyConditionExpression: (
              '#hash = :hash AND begins_with(#range, :range)'
            ),
            ExpressionAttributeNames: {
              '#hash': 'hash',
              '#range': 'range'
            },
            ExpressionAttributeValues: {
              ':hash': 'a.b',
              ':range': 'a.b'
            },
            ReturnConsumedCapacity: 'TOTAL'
          }
        })
      })
    })
  })
})
