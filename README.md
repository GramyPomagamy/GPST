# gpst

Generator Piekielnie Szybkich Thumbnailsów

This tools aims to help generating Twitter/Youtube thumbnails

"Stable" version is available at https://gpst.halamix2.pl/

Latest main commit version available at https://gramypomagamy.github.io/GPST/

## URL parameters

GPST can read the following URL parameters

- runner
- title
- subtitle
- category
- money
- time

You can then sen someone a link like this one: `localhost?runner=Halamix2&title=Stunt GP&category=Arcade`

## Run GPST locally

To run GPST locally, run

```bash
# needed only once, unless the dependencies have changed
npm install
npm run dev
```

### Building

To build a release run

```bash
npm run build

#if you wish to store GPST in a subdir on a server you can use
npm run build -- -- --base
```
