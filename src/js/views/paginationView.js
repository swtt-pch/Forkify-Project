import View from "./View.js";
import icons from '../../img/icons.svg'; // Parcel 2

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);  
        
        // Page 1, and there are other pages
        if(curPage === 1 && numPages > 1){
            return `${this._generateMarkupButtonForwards(curPage +1)}`
        }

        // Last page
        if(curPage === numPages && numPages > 1){
            return `${this._generateMarkupButtonBackwards(curPage - 1)}`
        }

        // Other page
        if(curPage < numPages){
            return `${this._generateMarkupButtonBackwards(curPage - 1)} ${this._generateMarkupButtonForwards(curPage +1)}`
        }
        
        //Page 1, and there no other pages
        return ``
    }

    _generateMarkupButtonBackwards(page){
        return `<button data-goto="${page}" class="btn--inline pagination__btn--prev">
        <span>Page ${page}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
      </button>`
    }

    _generateMarkupButtonForwards(page){
        return `<button data-goto="${page}" class="btn--inline pagination__btn--next">
        <span>Page ${page}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`
    }
}

export default new PaginationView;