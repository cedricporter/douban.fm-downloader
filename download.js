// Author: Hua Liang[Stupid ET]
// Website: http://EverET.org

var download_timeout, current_song_number = 0;
var songs_number = 500;
var last_size = -1;
var failed_retry = 0;

function go()
{
    try
    {
        window.DBR.act("skip");     // next song
        var len = Object.keys(song_list).length;
        if (last_size === len)
        {
            if (failed_retry++ > 10)
            {
                console.log("## Stopped ##");
                return;
            }
            else
            {
                console.log("## Retrying " + failed_retry + " times ##");
            }
        }

        // failed_retry = 0;
        console.log("Current list size: " + len);
        last_size = len;
        if (len % 10 === 0)
        {
            download_json();
        }

        var sleep_time = Math.ceil(Math.random() * (6 - 4) + 4);
        download_timeout = setTimeout(go, sleep_time * 1000);
    }
    catch (err)
    {
        console.error(err);
        download_timeout = setTimeout(go, 60 * 1000);
    }
}

function stop()
{
    clearTimeout(download_timeout);
}

function download_json()
{
    $("<a href='" + "data:application/x-json;base64," + encodeURIComponent(JSON.stringify(song_list)) + "' download='list.json'/>")[0].click();
}


// Thanks to `douban.fm Hacker`
// hook to douban.fm's handler

if (extStatusHandlerBak) {
    window.extStatusHandler = extStatusHandlerBak;
}
var extStatusHandlerBak = window.extStatusHandler;
var song_list = {};
var playlist;
window.extStatusHandler = function(a) {
    // run real douban.fm handler
    extStatusHandlerBak(a);
    
    var o = eval('(' + a + ')');
    console.log(o);
    if (o.type == 'nl') {
        playlist = o.playlist;
        for (var i = 0; i < o.playlist.length; i++) {
            var song = o.playlist[i];
            var save_file = song.title + ".mp3";
            song_list[save_file] = song.url; 
        }
    }
};



go();
