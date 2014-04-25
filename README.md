song-graph
==========

A web-application to keep track of songs played at your church. Song titles are read from [SongSelect](http://songselect.com) and auto-categorized into *new* (newer than year 2000), *old* (older than year 2000) and *chant* (public domain) &ndash; these categorizations can be changed manually afterwards. Creates charts and pie chart diagrams of songs played at all, by single band, and by single date/church service.

Getting started
---------------

```bash
git clone https://github.com/dominikschreiber/song-graph
cd song-graph
npm install
bower install
npm start
```

This downloads, installs and starts your personal song-graph server (on port `process.env.PORT || 9802`). Everything will work, supposed you have met the **requirements**:

- [node.js](http://nodejs.org/)
- [bower](http://bower.io)
- [couchdb](http://couchdb.apache.org/) either local or remote (specify as environment variable)
```bash
# local installation (this is default)
export DB=http://localhost:5984/song-graph
# remote server (i.e.)
export DB=http://cloudno.de/database/<your-couchdb-instance>
```

Vision / TODOs
--------------

Want do contribute but don't know where to start? Here are some points I'd like to implement (but don't have the big need right now). So feel free to fork, pick one and start hacking.

- [x] list dates in nav dropdown instead of date-input
- [x] change song input field in nav dropdown from song ID to song name (like /new/date)
- [ ] add multilanguage support (with [angular-translate](https://github.com/PascalPrecht/angular-translate/))
- [ ] integrate [SongSelect API](http://blog.songselect.com/about-api/)
- [ ] categorize songs based on language (could mean natural language processing to make a guess from the `song.excerpt`)

Version history
---------------

### 0.0.5
- bootswatch theme instead of default bootstrap
- dates in nav with list instead of datepicker
- pie chart from own directive

### 0.0.4
- resolving frontend dependencies with bower
- deleted `public/lib` in favor of `public/vendor` (which is ignored via `.gitignore`)

### 0.0.3
- moved code to github, started history.


License
-------
&copy; Dominik Schreiber, 2014

Licensed under the [MIT License](./LICENSE).
