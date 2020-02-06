import React from 'react'
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui-icons/Search';
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import List from 'material-ui/List'
import resource from 'fetch-resource'
import querystring from 'querystring'

import './App.css'
import SortSelect from './SortSelect'
import Article from './Article'
import Item from './Item'
import ErrorBoundary from './ErrorBoundary'
import Route from 'react-router-dom/Route'

class App extends React.Component {
  state = {
    query: '',
    typedQuery: '',
    pageSize: 7,
    sort: 'citations',
    response: {},
    cursor: '*',
  }

  componentDidMount () {
    this.setup(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.setup(nextProps)
  }

  setup ({ location, match }) {
    const { query, sort, cursor } = querystring.decode(location.search.replace(/^\?/, ''))

    const prevState = Object.assign({}, this.state)

    this.setState({
      query: query || '',
      typedQuery: query || '',
      cursor: cursor || '*',
      sort: sort || 'citations',
    })

    setTimeout(() => {
      if (this.state.query && (
        this.state.query !== prevState.query
        || this.state.cursor !== prevState.cursor
        || this.state.sort !== prevState.sort
      )) {
        this.fetch()
      }
    }, 10)
  }

  fetch = () => {
    const {query, sort, cursor, pageSize, response: {hitCount}} = this.state

    this.setState({response: {hitCount}})

    const sorts = {
      'citations': 'sort_cited:y',
      'relevance': null,
      'date': 'sort_date:y',
    }

    const params = {
      query: [query, 'src:med', sorts[sort]].join(' '),
      resulttype: 'lite',
      synonym: 'true',
      format: 'json',
      pageSize,
      cursorMark: cursor,
    }

    resource('https://www.ebi.ac.uk/europepmc/webservices/rest/search', params)
      .fetch('json')
      .then(response => {
        this.setState({response})
      })
  }

  search = (query, sort) => {
    this.transition(query, sort || this.state.sort)
  }

  change = (event) => {
    this.setState({ typedQuery: event.target.value })
  }

  select = (selected) => {
    const {query, sort, cursor} = this.state
    this.transition(query, sort, cursor, selected)
  }

  submit = (event) => {
    event.preventDefault()
    this.search(this.state.typedQuery)
  }

  sort = (sort) => {
    const {query} = this.state
    this.transition(query, sort)
  }

  transition = (query, sort, cursor, selected) => {
    const { location } = this.props

    this.props.history.push({
      ...location,
      pathname: selected ? `/article/${selected}` : '/',
      search: querystring.encode({ query, sort, cursor })
    })
  }

  render () {
    const {
      typedQuery,
      query,
      response: {hitCount, nextCursorMark, resultList},
      pageSize,
      sort
    } = this.state

    const { location: { pathname }} = this.props

    const matches = pathname.match(/(\d+$)/)
    const selected = matches ? matches[1] : null
    const narrow = document.documentElement.clientWidth < 600

    return (
      <div id="container">
        <div id="results" className={selected && narrow ? 'hidden' : ''}>
          <ErrorBoundary>
            <form onSubmit={this.submit} style={{marginTop: 20}}>
              <div style={{display: 'flex'}}>
                <TextField
                  name="query"
                  type="search"
                  value={typedQuery}
                  placeholder="Enter search terms…"
                  style={{flex: 1}}
                  onChange={this.change}/>
                <IconButton type="submit"><SearchIcon/></IconButton>
              </div>
            </form>

            {!query && <div>^ Enter query terms to search PubMed via Europe PubMed Central</div>}

            {!!hitCount && <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button>{hitCount.toLocaleString() + ' ' + (hitCount === 1 ? 'result' : 'results') }</Button>

              <SortSelect
                selected={sort}
                onChange={this.sort}
                options={{
                  'citations': 'Most cited first',
                  'relevance': 'Most relevant first',
                  'date': 'Most recent first'
                }}/>
            </div>}
          </ErrorBoundary>

          {resultList && (
            <ErrorBoundary>
              <List>
                {resultList.result.map(item => (
                  <Item key={item.id} result={item} select={this.select} selected={item.id === selected}/>
                ))}
              </List>

              {!!hitCount && resultList.result.length >= pageSize && (
                <div style={{textAlign: 'right'}}>
                  <Button
                    style={{visibility: nextCursorMark ? 'visible' : 'hidden'}}
                    onClick={() => this.transition(query, sort, nextCursorMark)}>Next page <ChevronRightIcon/></Button>
                </div>
              )}
            </ErrorBoundary>
          )}
        </div>

        <div id="item">
          <Route exact path="/article/:pmid"
                render={props => <Article {...props} select={this.select} search={this.search} total={hitCount} narrow={narrow}/>}/>
        </div>
      </div>
    )
  }
}

export default App
