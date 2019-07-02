const resolveKey = (key, separator = '.') => {
  if (!Array.isArray(key)) return key

  const [resourceName, resourceId] = key

  const rangeParts = key.length === 2
    ? key
    : key.slice(2)
  const range = rangeParts.join(separator)

  const hash = [resourceName, resourceId].join(separator)
  return { hash, range }
}

module.exports = resolveKey