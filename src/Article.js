import React from 'react'
import resource from 'fetch-resource'
import Button from 'material-ui/Button'
import Chip from 'material-ui/Chip'
import FaceIcon from 'material-ui-icons/Face'
import Avatar from 'material-ui/Avatar'

class Article extends React.Component {
  state = {
    article: undefined,
    references: undefined,
    citations: undefined
  }

  componentDidMount () {
    this.fetch(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.pmid !== this.props.match.params.pmid) {
      this.fetch(nextProps)
    }
  }

  fetch = ({ match }) => {
    this.setState({
      article: undefined,
      references: undefined,
      citations: undefined
    })

    const params = {
      query: 'src:med ext_id:' + match.params.pmid,
      resulttype: 'core',
      format: 'json',
    }

    return resource('https://www.ebi.ac.uk/europepmc/webservices/rest/search', params)
      .fetch('json')
      .then(({resultList}) => this.setState({article: resultList.result[0]}))
  }

  render () {
    const {search, select, total, narrow} = this.props
    const {article} = this.state

    if (!article) return null

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {narrow && <Button onClick={() => select(null)}>Back to {total.toLocaleString()} results</Button>}

          {article.citedByCount > 0 && <Button
            onClick={() => search(`CITES:${article.id}_MED`, 'citations')}>Cited
            by {article.citedByCount.toLocaleString()}</Button>}
        </div>

        <a id="title" target="_blank"
           href={'https://doi.org/' + encodeURIComponent(article.doi)}>{article.title.replace(/\.$/, '')}</a>

        <div className="authors"
             style={{display: 'flex', flexWrap: 'wrap'}}>{ article.authorList.author.map((author, index) => <Chip
          key={index}
          label={author.fullName}
          avatar={<Avatar><FaceIcon/></Avatar>}
          onClick={() => search(`AUTHOR:"${author.fullName}"`)}
          className="author"/>)}</div>

        <p>{article.abstractText}</p>

        <div>
          {article.hasReferences === 'Y' && <Button
            onClick={() => search(`REFFED_BY:${article.id}_MED`)}>References</Button>}

          {/*TODO: display references here?*/}
        </div>
      </div>
    )
  }
}

export default Article
