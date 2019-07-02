const dynamodb = require('aws-dynamodb-axios')
const chunk = require('./modules/chunk')
const { unmarshall, marshall } = require('aws-dynamodb-axios')

const isEmpty = obj => !Object.keys(obj).length
const upperFirst = str => str[0].toUpperCase() + str.slice(1)

const itemFor = query => Object.values(query).pop().Item
const failedConditionType = 'ConditionalCheckFailedException'

const existsOrNull = async invoking => {
  try {
    return await invoking
  } catch (error) {
    if (
      error.statusCode === 400 &&
      error.data.__type.endsWith(failedConditionType)
    ) {
      return null
    }
    throw error
  }
}

const marshallRequest = request => {
  let marshalled = { ...request }
  if (request.Key) {
    marshalled = {
      ...marshalled,
      Key: marshall(request.Key)
    }
  }
  if (request.Item) {
    marshalled = {
      ...marshalled,
      Item: marshall(request.Item)
    }
  }
  if (request.ExpressionAttributeValues) {
    marshalled = {
      ...marshalled,
      ExpressionAttributeValues: marshall(request.ExpressionAttributeValues)
    }
  }
  return marshalled
}

const invoke = (db, config = {}) => async (query, options = {}) => {
  if (Array.isArray(query)) {
    return Promise.all(query.map(q => invoke(db, config)(q, options)))
  }

  const request = {
    ...marshallRequest(query.request),
    TableName: config.tableName
  }

  switch (query.action) {
    case 'get':
      const getResult = await db.get(request)
      return isEmpty(getResult)
        ? null
        : unmarshall(getResult.Item)
    case 'put':
      const putResult = await db.put(request)
      if (putResult === null) return null
      return query.request.Item
    case 'delete':
      return await existsOrNull(db.delete(request))
        ? {}
        : null
    case 'query':
      const getItems = await db.query(request)
      if (!getItems.Items && getItems.Count !== undefined) return getItems.Count
      return unmarshall(getItems.Items)
    case 'update':
      const updateResult = await existsOrNull(db.update(request))
      if (updateResult === null) return null
      return invoke(db, config)({
        action: 'get',
        request: { Key: query.request.Key }
      })
  }

  throw new Error(`query does not support ${query.action} action`)
}

const batch = (db, config = {}) => async (queries, options = {}) => {
  for (const queriesChunk of chunk(queries, 25)) {
    await db.batchWrite({
      RequestItems: {
        [config.tableName]: queriesChunk.map(
          ({ request, action }) =>
            ({ [`${upperFirst(action)}Request`]: marshallRequest(request) })
        )
      }
    })
  }
  return queries.map(itemFor)
}

const ensureArray = arr => Array.isArray(arr)
  ? arr
  : [arr]

const transact = (db, config = {}) => async queries => {
  const queriesArr = ensureArray(queries)
  for (const queriesChunk of chunk(queriesArr, 25)) {
    await existsOrNull(db.transactWrite({
      TransactItems: queriesChunk.map(query => ({
        [upperFirst(query.action)]: {
          ...marshallRequest(query.request),
          TableName: config.tableName
        }
      }))
    }))
  }
  return queriesArr.map(itemFor)
}

const crud = (config = {}) => {
  const db = dynamodb(config)
  return {
    batch: batch(db, config),
    invoke: invoke(db, config),
    transact: transact(db, config)
  }
}

module.exports = crud
