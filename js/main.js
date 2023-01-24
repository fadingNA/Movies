let page = 1;
let perPage = 10;

const loadMovieData = (title = null) => {

    let endpoint = 'https://exuberant-trench-coat-wasp.cyclic.app';
    let qp = title ? `${endpoint}/api/movies?page=${page}&perPage=${perPage}&title=${title}` :
        `${endpoint}/api/movies?page=${page}&perPage=${perPage}`;

    if(title){
        document.querySelector(".pagination").classList.add("d-none");
    }else{
        document.querySelector(".pagination").classList.remove("d-none");
    }
    fetch(qp).then((res) => res.json()).then((data) => {
        console.log(data)
        let movieList = "";
        data.forEach(movie => {
            movieList += `
          <tr data-id="${movie._id}">
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.fullplot}</td>
            <td>${movie.rated}</td>
            <td>${Math.floor(movie.runtime / 60)} hour ${(movie.runtime % 60).toString().padStart(2, '0')} minutes</td> 
          </tr>
        `;
        });
        // Add the formatted movie data to the DOM
        document.querySelector('#moviesTable tbody').innerHTML = movieList;
        $('#moviesTable tbody').html(movieList);
        // document.querySelector("#current-page").innerHTML = page;
        document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
            row.addEventListener('click', (e) => {
                let clicked = row.getAttribute('data-id');
                fetch(`${endpoint}/api/movies/${clicked}`).then((res) => res.json()).then((data) => {
                    document.querySelector(`#detailsModal .modal-title`).innerHTML = data.title;
                    document.querySelector(`#detailsModal .modal-body`).innerHTML = `
                        <img src="${data.poster}" style="{justify-content: center} alt="poster"/> 
                        <p>Director: ${data.directors.join(', ')}</p> 
                        <p>Fullplot: ${data.fullplot}</p> 
                        <p>Cast: ${data.cast ? data.cast.join(', ') : 'No data'}</p> 
                        <p>Nominated: ${data.awards.text}</p> 
                        <p>IMDB RATING: ${data.imdb.rating}</p>
                        <p>IMDB VOTES: ${data.imdb.votes}</p>;`
                    $(`#detailsModal`).modal(`show`);
                    $('.modal-footer').click(function(){
                        $('#detailsModal').modal('hide');
                    });
                })
            })
        })
    })
    document.querySelector(".pagination").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
    loadMovieData();
    // attach event listeners for pagination and search here
    document.querySelector("#cur-p").addEventListener("click", () => {
        loadMovieData();
    });
    document.querySelector("#p-page").addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });
    document.querySelector("#next-p").addEventListener("click", () => {
        page++;
        loadMovieData();
    });
    document.querySelector("#searchForm").addEventListener("submit", e => {
        e.preventDefault();
        let title = document.querySelector("#title").value;
        loadMovieData(title);
    });
    document.querySelector("#clearForm").addEventListener("click", () => {
        document.querySelector("#title").value = "";
        loadMovieData();
    });
});
