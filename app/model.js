// dane dla aplikacji


class Photo {
    constructor(id, album, originalName, url, lastChange, history) {
        this.id = id,
            this.album = album,
            this.originalName = originalName,
            this.url = url,
            this.lastChange = lastChange,
            this.history = history
    }
}

photoArray = []

tagArray = ["#love",
    "#instagood",
    "#fashion",
    "#photooftheday",
    "#beautiful",
    "#art",
    "#photography",
    "#happy",
    "#picoftheday",
    "#cute",
    "#follow",
    "#tbt",
    "#followme",
    "#nature",
    "#like4like",
    "#travel",
    "#instagram",
    "#style",
    "#repost",
    "#summer",
    "#instadaily",
    "#selfie",
    "#me",
    "#friends",
    "#fitness",
    "#girl",
    "#food",
    "#fun",
    "#beauty",
    "#instalike",
    "#smile",
    "#family",
    "#photo",
    "#life",
    "#likeforlike",
    "#music",
    "#follow4follow",
    "#makeup",
    "#amazing",
    "#igers",
    "#nofilter",
    "#dog",
    "#model",
    "#sunset",
    "#beach",
    "#instamood",
    "#motivation"]


tagJsonArray = []

userList = []

module.exports = { Photo, photoArray, tagArray, tagJsonArray, userList }