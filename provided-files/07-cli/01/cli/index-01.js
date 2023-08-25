#!/usr/bin/env node
const Table = require('cli-table')
const ApiClient = require('./api-client')

cli()

async function cli () {
  const [ tag ] = process.argv.slice(2)

  const api = ApiClient()
  const products = await api.listProducts({ tag })

  const headers = ['ID', 'Description', 'Tags', 'User']

  const margin = headers.length
  const width = process.stdout.columns - margin
  const widthId = 30
  const widthOther = Math.floor((width - widthId) / (headers.length - 1))

  const table = new Table({
    head: headers,
    colWidths: [widthId, widthOther, widthOther, widthOther]
  })

  products.forEach(p => table.push([
    p._id,
    p.description.replace(/\n|\r/g, ' '),
    p.userName,
    p.tags.slice(0, 3).join(', ')
  ]))

  console.log(table.toString())
}
