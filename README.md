# transcribe-en-to-zh
A program for [transcription into Chinese characters](https://en.wikipedia.org/wiki/Transcription_into_Chinese_characters) (and into [pinyin](https://en.wikipedia.org/wiki/Pinyin)) based on the rules laid out in Xinhua's *[Names of the World's Peoples](https://books.google.com/books/about/Names_of_the_World_s_Peoples.html?id=cFihRAAACAAJ)* (1993).

# installation

This program needs [natural](https://github.com/NaturalNode/natural) to run. If you don't have it, install it using [npm](https://www.npmjs.com/).
``` npm install natural ```

# usage

Currently, transcribe-en-to-zh uses a command-line interface. Run `transcribe.js` using node. (If you don't have node.js, download it [here](https://nodejs.org/en/)).
```
> node transcribe.js "dearest doll"
Raw input was: dearest doll
TRST => 迪尔西 díěrxī
TL => 迪尔 díěr
```
