//enter invokes iTunesSearch()
$('#mySearch').keypress(function(e) {
  if (e.which === 13) iTunesSearch();
})

const clickFavorite = (id, eleMarkup, ele) => {

  //toggles add and remove from localStorage for favorites list and changes button text
  if (localStorage[id] && localStorage[id] !== undefined) {
    localStorage.removeItem(id);
    ele.text('Add Favorite');
  } else {
    localStorage.setItem(id, eleMarkup);
    ele.text('Remove favorite');
  }
}

const showFavorites = () => {
  $('#queryResults').empty();

  if (!localStorage.length) $('#queryResults').append('<p class="center">You have no favorites.</p>');

  //favorites list data is stored in localStorage
  for (let key in localStorage) {

    //skip through the length key in localStorage
    if (key === 'length') continue;

    //render all favorited elements
    $('#queryResults').append(localStorage[key]);

    $('#' + key).text('Remove Favorite');

    //binds clickFavorite() to each list items favorite button inside favorites list
    $('#' + key).click(function() {
      clickFavorite(key, localStorage[key], $(this));

      //this refreshes the favorites list
      showFavorites();
    })
  }
}

const iTunesSearch = () => {
  let selectKindObj = {};
  let query = $('#mySearch').val();

  //replace spaces in query with +
  query = query.replace(/ /g, '+');

  //clear list before new query
  $('#queryResults').empty();

  if (query === '') {
    $('#queryResults').append('<p class="center">Please enter a search.</p>');
  } else {
    axios.get('https://itunes.apple.com/search?term=' + query)
    .then((res) => {

      //if get returns no results display no results message
      if (res.data.results.length === 0) return $('#queryResults').append('<p class="center">No search results. Please try again.</p>');

      //renders all results
      for (let i = 0; i <= res.data.results.length - 1; i++) {
        let kind = res.data.results[i].kind;

        //some results came back undefined so we are skipping through them
        if (kind === undefined) continue;

        //tracks amount of each kind in filter select dropdown
        selectKindObj[kind] ? selectKindObj[kind]++ : selectKindObj[kind] = 1;

        let id = res.data.results[i].trackId;
        let eleMarkup =
          `<li class="row" data-kind="${res.data.results[i].kind}" data-id="${id}">
            <img class="col-2" src="${res.data.results[i].artworkUrl100}" />
            <div class="col-8">
              <p>id: ${id} </p>
              <p>title: ${res.data.results[i].trackName} </p>
              <p>artist: ${res.data.results[i].artistName} </p>
              <p>kind: ${res.data.results[i].kind} </p>
              <p>genre: ${res.data.results[i].primaryGenreName} </p>
              <a href="${res.data.results[i].trackViewUrl}"><button>Preview</button></a>
              <button id="${id}">${localStorage[id] ? 'Remove Favorite' : 'Add Favorite'}</button>
            </div>
          </li>`;

        $('#queryResults').append(eleMarkup);

        //binds clickFavorite() to the Favorite button
        $('#' + id).click(function() {
          clickFavorite(id, eleMarkup, $(this));
        });
      }

      //adds filter select dropdown
      $('#queryResults').prepend(`<p id="filter" class="center"> filter by kind : <select id="select"></select></p>`);

      //renders options for filter select dropdown
      for (let key in selectKindObj) {
        $('#select').append(`<option value="${key}">${key} (${selectKindObj[key]})</option>`);
      }

      //default filter search option to nothing
      $('#select').val('');

      //shows only the selected filter option
      $('#select').change(() => {
        $('#queryResults > li').each(function() {
          $(this).data('kind') === $('#select').val() ? $(this).show() : $(this).hide();
        });
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }
}
