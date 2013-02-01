var download_timeout, current_song_number = 0;
var songs_number = 200;

function go()
{
    try
    {
        window.DBR.act("skip");     // next song
        var links = $(".saveBtn");
        links[links.length - 1].click(); // download
        console.log("Current song number: " + ++current_song_number);
        if (current_song_number < songs_number)
        {
            download_timeout = setTimeout(go, 30 * 1000);
        }
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

go();

