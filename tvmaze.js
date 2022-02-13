/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  try {
    const response = await axios.get("https://api.tvmaze.com/search/shows", {
      params: {
        q: query
      }
    });

    const arr = [];

    for (let show of response.data) {
      arr.push({
        id: show.show.id,
        name: show.show.name,
        summary: show.show.summary,
        image: show.show.image
      })
    }

    return arr;

  } catch (err) {

    alert(err);
  }

}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let image = show.image ? show.image.original : "https://tinyurl.com/tv-missing";

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src=${image}>
             <button class="btn btn-info episodes-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
  $("#search-query").val("");
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  try {
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
    const arr = [];
    // TODO: return array-of-episode-info, as described in docstring above

    for (let episodes of response.data) {
      let image = episodes.image ? episodes.image.original : "https://tinyurl.com/tv-missing";
      arr.push({
        id: episodes.id,
        name: episodes.name,
        season: episodes.season,
        number: episodes.number,
        image: image
      })
    }
    return arr;

  } catch (err) {
    alert(err);
  }

}

function populateEpisodes(episodes) {
  //find the ul with episodes list id
  const $episodesList = $("#episodes-list");
  //empty the list if its has html in it 
  $episodesList.empty();

  //append a div in the ul, that contains image, episode, name,season,number
  for (let episode of episodes) {
    let $list = $(`<div class="col-md-6 col-lg-3 Show" data-show-id="${episode.id}">
    <div class="card" data-show-id="${episode.id}">
      <div class="card-body">
        <h5 class="episode-title">${episode.name}</h5>
        <p class="season-episode">Season ${episode.season} - Episode ${episode.number}</p>
        <img class="card-img-top" src=${episode.image}>
      </div>
    </div>
  </div>
 `);
    //append each div to the list
    $episodesList.append($list);
  }
  //make the episodes area visible
  $("#episodes-area").show();

}

//add the event listener to the episodes button
$('#shows-list').on('click', '.episodes-button', async function handleEpisode(evt) {
  evt.preventDefault();
  //get the id of the show we clicked on
  let id = $(evt.target).parent().parent().data('show-id');
  //call the getEpisodes function with id to return list of episodes with data for each
  let episodes = await getEpisodes(id);
  //call the populateEpisodes function to add each episode to the episodes list
  populateEpisodes(episodes);
});

