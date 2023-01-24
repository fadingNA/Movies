let page = 1;
let perPage = 10;

const loadMovieData = (title = null) => {
    let endpoint = 'https://exuberant-trench-coat-wasp.cyclic.app';
    let qp = title ? `${endpoint}/api/movies?page=${page}&perPage=${perPage}&title=${title}` :
        `${endpoint}/api/movies?page=${page}&perPage=${perPage}`;
    document.querySelector(".pagination").classList.remove("d-none");
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            // handle the data here, for example:
            let movies = data.movies;
            let tbody = document.querySelector('#moviesTable tbody');
            tbody.innerHTML = '';
            movies.forEach(movie => {
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${movie.year}</td>
                    <td>${movie.title}</td>
                    <td>${movie.plot}</td>
                    <td>${movie.rating}</td>
                    <td>${movie.runtime}</td>`;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            // handle the error here
            console.error(error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // attach event listeners for pagination and search here
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
