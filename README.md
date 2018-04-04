# transcribe-en-to-zh
A program for [transcription into Chinese characters](https://en.wikipedia.org/wiki/Transcription_into_Chinese_characters) (and into [pinyin](https://en.wikipedia.org/wiki/Pinyin)) based on the rules laid out in Xinhua's *[Names of the World's Peoples](https://books.google.com/books/about/Names_of_the_World_s_Peoples.html?id=cFihRAAACAAJ)* (1993).

# installation
This app depends on [TypeScript](https://github.com/Microsoft/TypeScript), [natural](https://github.com/NaturalNode/natural), and a few other packages. You can install any that are not in your environment with [npm](https://www.npmjs.com/).
``` npm install ```

# usage
Right now I run `transcribe-en-to-zh` on [ts-node](https://github.com/TypeStrong/ts-node), but later I will include options for workflows that involve transpiling to JavaScript and/or a HTTP/CSS interface.
```
> ts-node transcribe "dearest doll"
Raw input was: dearest doll
TRST => 迪尔西 díěrxī
TL => 迪尔 díěr
```

It is not necessary on a default install, but you can build the transcription rule `JSON` file by running
```
ts-node scrape.ts
```
