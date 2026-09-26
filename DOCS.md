# JG Blocks Documentation

Blocks in this plugin can also be rendered as shortcodes, so they work without the block editor. The block and the shortcode share the same markup and attributes.

All shortcode tags are prefixed with `jgwd_`.

## Hero Slideshow

**Shortcode:** `[jgwd_slideshow_hero]`

**Block:** `jg-blocks/hero-slideshow`

Use this in the classic editor, a template, or any other content that processes shortcodes.

### Passing parameters

The shortcode accepts the same attributes as the block. You can pass the entire attributes object as one JSON parameter, or pass each attribute individually.

Wrap JSON values in **single quotes** so the double quotes inside the JSON are not broken by WordPress's shortcode parser.

WordPress lowercases shortcode attribute names. Camel-cased names (`autoPlay`, `textColor`, `fontSize`) also work as `autoplay`, `textcolor`, and `fontsize`.

#### Option 1: Entire attributes object (recommended)

Pass the full block `$attributes` array as JSON. This is the same payload the block editor stores.

```
[jgwd_slideshow_hero attributes='{"height":"32rem","autoPlay":5000,"textColor":"#ffffff","fontSize":"x-large","slides":[{"id":123,"url":"","alt":"Hero image","content":{"caption":"Welcome","buttonText":"Learn more"}}],"style":{"elements":{"button":{"color":{"text":"#ffffff","background":"#000000"}}}}}']
```

From PHP, pass the array directly:

```php
echo jg_blocks_slideshow_hero_shortcode( $attributes );
```

Or wrap it in the `attributes` key:

```php
echo jg_blocks_slideshow_hero_shortcode( array( 'attributes' => $attributes ) );
```

#### Option 2: Individual parameters

```
[jgwd_slideshow_hero height="40rem" autoPlay="5000" textColor="#ffffff" fontSize="x-large" slides='[{"id":123,"content":{"caption":"Welcome","buttonText":"Learn more"}}]' style='{"elements":{"button":{"color":{"text":"#ffffff","background":"#000000"}}}}']
```

### Attribute reference

- **`attributes`** (JSON object, optional) — the entire block attributes array. When this is set, it is merged over the other parameters.
- **`height`** (string, default `32rem`) — CSS height of the slideshow (for example `32rem`, `80vh`, `600px`).
- **`autoPlay`** / **`autoplay`** (number, default `5000`) — milliseconds between automatic slide changes.
- **`textColor`** / **`textcolor`** (string, default `#ffffff`) — caption text color. Use a hex value or a WordPress preset such as `var:preset|color|white`.
- **`fontSize`** / **`fontsize`** (string, default `x-large`) — caption and button font size. Use a CSS size or a WordPress preset slug such as `x-large`.
- **`slides`** (JSON array, default `[]`) — the slides to display. See format below.
- **`style`** (JSON object) — button colors in the WordPress block `style` shape. See format below.

### Slides JSON format

Each slide is an object. `id` should be a WordPress attachment ID so the image URL and alt text can be resolved from the media library. `url` and `alt` are fallbacks.

```json
[
  {
    "id": 123,
    "url": "https://example.com/image.jpg",
    "alt": "Description of the image",
    "content": {
      "caption": "Put a descriptive slide caption here.",
      "buttonText": "Go!"
    }
  }
]
```

- **`content.caption`** — text shown over the slide.
- **`content.buttonText`** — action button label. Supports `<a>`, `<strong>`, and `<em>`. Omit or leave empty to hide the button.

### Style JSON format

This matches the block's `style` attribute. Button colors may be hex values or WordPress preset strings (`var:preset|color|slug`).

```json
{
  "elements": {
    "button": {
      "color": {
        "text": "#ffffff",
        "background": "#000000"
      }
    }
  }
}
```

### Minimal example

```
[jgwd_slideshow_hero]
```

Renders an empty slideshow at the default height (`32rem`) with the default colors and autoplay interval.

### Example with one slide

```
[jgwd_slideshow_hero height="24rem" autoPlay="4000" slides='[{"id":123,"content":{"caption":"Spring sale","buttonText":"<a href=\"/shop\">Shop now</a>"}}]']
```

## Media Flip Card

**Shortcode:** `[jgwd_media_flip_card]`

**Block:** `jg-blocks/media-flip-card`

A card that shows a full-size image and caption on the front. Hover (desktop) or tap (phone) flips it to reveal nested content such as headings, lists, and paragraphs.

In the block editor, use **Edit Back** in the sidebar to flip the card and add child blocks. The front caption is editable in place.

### Passing parameters

Wrap JSON values in **single quotes**. WordPress lowercases shortcode attribute names, so `mediaId` may also be written as `mediaid` or `id`.

Content between the opening and closing tags becomes the back of the card.

#### Option 1: Entire attributes object

```
[jgwd_media_flip_card attributes='{"mediaId":123,"caption":"Our studio","height":"20rem"}']
<h3>About the space</h3>
<p>Tour the workshop and see current projects.</p>
[/jgwd_media_flip_card]
```

From PHP, pass the array and back-face HTML:

```php
echo jg_blocks_media_flip_card_shortcode( $attributes, $content );
```

#### Option 2: Individual parameters

```
[jgwd_media_flip_card mediaId="123" caption="Our studio" height="24rem"]
<h3>About the space</h3>
<ul><li>Open weekdays</li><li>Free parking</li></ul>
[/jgwd_media_flip_card]
```

### Attribute reference

- **`attributes`** (JSON object, optional) — the entire block attributes array. When this is set, it is merged over the other parameters.
- **`mediaId`** / **`mediaid`** / **`id`** (number) — WordPress attachment ID for the front image.
- **`mediaUrl`** / **`mediaurl`** (string) — image URL fallback if no attachment ID is used.
- **`mediaAlt`** / **`mediaalt`** (string) — alt text. Filled from the attachment when `mediaId` is set.
- **`caption`** (string) — text overlaid on the front image.
- **`height`** (string, default `20rem`) — CSS height of the card.
- **`textColor`** / **`textcolor`** (string) — base text color on the back of the card. Child blocks keep their own colors when set. Hex or a preset slug such as `contrast`.
- **`backgroundColor`** / **`backgroundcolor`** (string) — background color of the back of the card. Hex or a preset slug.
- **`borderColor`** / **`bordercolor`** (string) — border color of both faces. Hex or a preset slug.
- **`style`** (JSON object) — WordPress style object for custom colors and border width/radius/style, for example `{"color":{"background":"#111","text":"#fff"},"border":{"width":"2px","radius":"12px","color":"#000","style":"solid"}}`.

### Minimal example

```
[jgwd_media_flip_card]
```

Renders an empty card at the default height. Add an image in the block editor, or pass `mediaId` in the shortcode.
