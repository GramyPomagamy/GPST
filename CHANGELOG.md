# Changelog

## WIP

- Refactor code, GPST now uses Fabric.js library
  - Final render to file applies Lanczos3 filter to the photo

## 0.3.0

- Input fields values are now transferrable between views
- Update view
  - Show usage help when hovering over the thumbnail
  - move update money button to the right of the input
  - add "Generate static link" button, which will generate link with runner, title, subtitle etc. data for easy reuse
- Refactor code

## 0.2.2

- fix photo view text position

## 0.2.1

- switch default iconset to material design symbols

## 0.2.0

- any image format supported by the browser should now be accepted
- reworked UI
  - better fit on both wide and small screens
  - UI is now pleasant-ish to look at
- foundation logos are not baked in anymore
- add grab cursor on canvas
- parametrized logos and donation counter through env file
- logos and tracker updated for GSPS2024
- automatically build nightly version

### Known issues

- image scaling uses linear filtering

## 0.1.0

- Initial version
