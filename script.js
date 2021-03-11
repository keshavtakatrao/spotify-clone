
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

const clientId = "0bcbb6ba80774c3eb325c193449c67c1";
const clientSecret = "74dd6795ec16424391a10050906f52a7";
const playlistID = '3N6BKeMfREQ6dPmymMYk93';

var getToken = fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  },
  body: "grant_type=client_credentials",
});

getToken
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    var token = response.access_token;
    var getPlayList = fetch(
      "https://api.spotify.com/v1/playlists/"+playlistID,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    getPlayList
      .then(function (response) {
        return response.json();
    })
      .then(function (response) {
        var data = response;
        var imgSrc = data.images[1].url;
        var coverImage = document.createElement('img');
        coverImage.setAttribute('src',imgSrc);
        coverImage.setAttribute('id','coverImage');
        coverImage.setAttribute('class','img-fluid');
        coverImage.setAttribute('width','192px');
        coverImage.setAttribute('height','192px');

        
        var playlistInfo = document.createElement('div');
        playlistInfo.setAttribute('id','playLsitInfo');

        var type = document.createElement('h2');
        type.innerHTML = 'PLAYLIST <br>';

        var playlistName = document.createElement('h1');
        playlistName.innerHTML = data.name;

        var div = document.createElement('div');
        var owner = document.createElement('span');
        owner.innerHTML=data.owner.display_name+" &middot; " +data.followers.total + ' likes  &middot ' + data.tracks.total+' songs'; 

        div.append(owner);
        playlistInfo.append(type,playlistName,div);
        document.getElementById('playlistHeader').append(coverImage,playlistInfo);
        console.log(data)

        for(i in data.tracks.items){
            var tableRow = buildTable(data.tracks.items[i],+i+1);
            document.getElementById('tableBody').append(tableRow);
        }

    });
});

function buildTable(info,index){
  var row = document.createElement('tr');

  var rowIndex = document.createElement('td');
  rowIndex.innerHTML = index;

  var title = document.createElement('td');
  var titleImg = document.createElement('img');
  titleImg.setAttribute('src',info.track.album.images[2].url);
  titleImg.setAttribute('class','titleImg');
  title.append(titleImg);
  title.innerHTML += info.track.name;

  var album = document.createElement('td');
  album.innerHTML = info.track.album.name;

  var dateStr = info.added_at;
  var date = new Date(dateStr);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  dstr = months[date.getMonth()]+' '+day+','+year;

  var dateAdded = document.createElement('td');
  dateAdded.innerHTML=dstr;

  var millis = info.track.duration_ms;
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  var duration = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

  var dur = document.createElement('td');
  dur.innerHTML = duration;

  row.append(rowIndex,title,album,dateAdded,dur);
  return row;
}

