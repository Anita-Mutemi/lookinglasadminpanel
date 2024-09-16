import React from 'react';


class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
      selected: null,
      results: [],
      isSearching: false,
      error: null,
    };

    this.handleInput = this.handleInput.bind(this);
    this.selectResult = this.selectResult.bind(this);
    this.renderNotFound = this.renderNotFound.bind(this);
  }

  async handleInput(event) {
    this.setState({ isSearching: true, query: event.target.value });

    var res = await this.props.searchFn(event);

    this.setState({ results: res });
    this.setState({ isSearching: false });
  }

  selectResult(item) {
    this.setState({ selected: item });
    if (this.props.setter) {
      this.props.setter(item);
    }
  }

  renderNotFound(query) {
    if (this.props.notFoundText) {
      return `${query}` + this.props.notFoundText;
    }
    return `${query} was not found`;
  }

  render() {
    return (
      <>
        <div className='input-group'>
          <span className='input-group-text' id={this.props.labelId}>
            {this.props.label} &nbsp; | &nbsp;&nbsp;
            {this.state.isSearching ? (
              <div className='pe-2'>
                <div
                  className='spinner-border spinner-border-sm text-secondary'
                  role='status'
                >
                  <span className='visually-hidden'>Loading...</span>
                </div>
                <span className='ps-2'>searching...</span>
              </div>
            ) : this.state.selected !== null ? (
              <span>{this.props.renderSelected(this.state.selected)}</span>
            ) : this.state.results && this.state.results.length !== 0 ? (
              <span>Choose result from list</span>
            ) : this.state.query ? (
              this.renderNotFound(this.state.query)
            ) : (
              'Type to search'
            )}
          </span>
          <input
            name={this.props.fieldName}
            type='text'
            className='form-control'
            placeholder={this.props.placeholder}
            aria-label={this.props.placeholder}
            defaultValue={this.state.selected}
            onChange={this.handleInput}
            aria-describedby={this.props.labelId}
          />
          <span className='input-group-text'>
            <i
              className='bi bi-x-square-fill'
              style={
                this.state.selected
                  ? { cursor: 'pointer', color: 'red' }
                  : { color: 'grey' }
              }
              onClick={() => this.selectResult(null)}
            />
          </span>
        </div>

        {this.state.results && this.state.results.length > 0 ? (
          <div>
            <ul className='searchList'>
              {this.state.results.map((item) => (
                <li onClick={() => this.selectResult(item)}>
                  {this.state.selected && item.id === this.state.selected.id ? (
                    <i className='bi bi-check-square' style={{ color: 'teal' }} />
                  ) : (
                    <i className='bi bi-plus-square' />
                  )}
                  &nbsp;
                  {this.props.renderResultItem(item)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}

export default SearchField;
