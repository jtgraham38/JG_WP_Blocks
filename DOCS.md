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
