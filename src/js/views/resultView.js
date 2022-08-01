import View from './View.js';
import previewView from './previewView.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes fould for your query! Please try again...'
  _message = '';

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('\n')
  }
}

export default new ResultView();
