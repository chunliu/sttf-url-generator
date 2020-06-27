---
layout: default
title: Home
---

# STTF Url Generator Extension for Chrome/Edge

<h5 style="text-align: right;"><a href="./privacy-policy.html">Privacy Policy</a></h5>

This browser extension helps you create a url with a text fragment. With this url, the browser will automatically scroll to and highlight the text fragment on the page, so users will be able to locate the information on the page more quickly and accurately. It is useful when you want to share with others the specific information with a link.

## How to use it

Get the extension from [Chrome Web Store](https://chrome.google.com/webstore/detail/sttf-url-generator/mlihnffnlcfgjkkmigdgahgpfpfddafo) or [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/sttf-url-generator/dpdjjailihobhcfmchiadaomllbdfhid?hl=en-US).

![how to use](./sttf-url-v1.1.gif)

### Copy or Open the URL

- Select a text snippet on the page and right click on the selection.
- Point to `STTF Link` on the context menu.
- Click `Copy` if you want to copy the sttf link without opening it.
- Click `Open` if you want to open the sttf link in a new tab. The link will also be copied to the clipboard.

### Copy the URL as Markdown

- Turn on the `Copy As Markdown` option from the browser's toolbar.
- Select a text snippet on the page and right click on the selection.
- Select `STTF Link` > `Copy as MD`.

### Multiple Text Fragments in One URL

- Select the 1st text fragment and click `STTF Link` > `Open` to open it in a new tab.
- In the new tab, select the 2nd text fragment and then choose either `Open` or `Copy` to get the URL.
- If there are more text fragments to be selected, repeat the above steps until all text fragments are covered.

## How it works

The extension works in the following way.

- Following the [suggestion of the text fragments spec](https://wicg.github.io/scroll-to-text-fragment/#prefer-exact-matching-to-range-based#:~:text=It%20is%20recommended%20that%20text%20snippets%20shorter%20than%20300%20characters%20always%20be%20encoded%20using%20an%20exact%20match.%20Above%20this%20limit%2C%20the%20UA%20should%20encode%20the%20string%20as%20a%20range-based%20match.), when the selection of the text snippet has less than 300 characters, the url will be generated with [exact matching](https://wicg.github.io/scroll-to-text-fragment/#syntax#:~:text=If%20only%20textStart%20is%20specified%2C%20the%20first%20instance%20of%20this%20exact%20text%20string%20is%20the%20target%20text.).
- If the text snippet has 300 or more characters, the url will be generated with [range-based matching](https://wicg.github.io/scroll-to-text-fragment/#syntax#:~:text=If%20the%20textEnd%20parameter%20is%20also%20specified%2C%20then%20the%20text%20directive%20refers%20to%20a%20range%20of%20text%20in%20the%20page.).
  - For range-based matching, the first 5 words of the text snippet will be used as textStart, and the last 5 words will be used as textEnd.

## Note

- According to the [spec](https://wicg.github.io/scroll-to-text-fragment/#word-boundaries#:~:text=The%20substring%20%22mountain%20range%22%20is%20word%20bounded%20within%20the%20string%20%22An%20impressive%20mountain%20range%22%20but%20not%20within%20%22An%20impressive%20mountain%20ranger%22.), the selection of the text snippet must adhere to the word boundaries. In another words, the selection needs to start from the beginning of the first word and end at the ending of the last word of the text snippet. If the selection starts or ends at a character in a word, the browser would not be able to find the matching accurately.
- Due to the [algorithm](https://wicg.github.io/scroll-to-text-fragment/#finding-ranges-in-a-document#:~:text=each%20of%20prefix%2C%20textStart%2C%20textEnd%2C%20and%20suffix%20will%20only%20match%20text%20within%20a%20single%20block.) of finding ranges in a document, the selection of the text snippet should avoid crossing multiple ["block-level" elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements#:~:text=%22block-level%22%20elements). For example, if a selection is across a `<h2>` and a `<div>`, the browser may not be able to scroll to the text fragment accurately.
